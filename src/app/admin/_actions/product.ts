'use server'

import db from "@/db/db";
import { revalidatePath } from "next/cache";
import { notFound, redirect } from "next/navigation";
import fs from 'fs/promises'
import { z } from "zod";

const fileSchema = z.instanceof(File,{message:"Required"})

const imageSchema = fileSchema.refine(
    file => file.size == 0 || file.type.startsWith('image/')
)

const addSchema = z.object({
    name : z.string().min(1),
    description : z.string().min(1),
    price : z.coerce.number().int().min(300),
    file : fileSchema.refine(file=>file.size>0,"Required"),
    image : imageSchema.refine(file=>file.size>0,"Required"),
})

export async function addProduct(prevState : unknown, formData : FormData) {
    const result = addSchema.safeParse(Object.fromEntries(formData.entries()))

    if(!result.success){
        return result.error.formErrors.fieldErrors
    }

    const data = result.data

    //uploading file
    await fs.mkdir("products", {recursive : true})
    const filePath = `products/${crypto.randomUUID()}-${data.file.name}`
    await fs.writeFile(filePath, Buffer.from(await data.file.arrayBuffer()))
    
    // uploading image
    await fs.mkdir("public/products", {recursive : true})
    const imagePath = `/products/${crypto.randomUUID()}-${data.image.name}`
    await fs.writeFile(`public${imagePath}`, Buffer.from(await data.image.arrayBuffer()))

    // saving product

    await db.product.create({
        data:{
            isAvailableForPurchase:false,
            name:data.name,
            description:data.description,
            filePath,
            imagePath,
            price:data.price
        }
    })

    //handling cache
    revalidatePath('/')
    revalidatePath('/products')

    redirect('/admin/products')
}

//Edit Product
const editSchema = addSchema.extend({
    file:fileSchema.optional(),
    image :imageSchema.optional()
})

export async function updateProduct(
    id:string,
    prevState:unknown,
    formData:FormData
) {
    const result = editSchema.safeParse(Object.fromEntries(formData.entries()))
    
    if(result.success == false){
        return result.error.formErrors.fieldErrors
    }

    let product = await db.product.findUnique({where : {id}})

    let filePath = product?.filePath
    if(result.data.file != null && result.data.file.size>0){
        await fs.unlink(product?.filePath!)
        filePath=`products/${crypto.randomUUID()}-${result.data.file}`
        await fs.writeFile(filePath,Buffer.from(await result.data.file.arrayBuffer()))
    
    }

    let imagePath = product?.imagePath
    if(result.data.image != null && result.data.image.size>0){
        await fs.unlink(product?.imagePath!)
        imagePath=`products/${crypto.randomUUID()}-${result.data.image}`
        await fs.writeFile(imagePath,Buffer.from(await result.data.image.arrayBuffer()))
    }

    await db.product.update({
        where: { id },
        data : {
            name : result.data.name,
            price : result.data.price,
            description : result.data.description,
            filePath,
            imagePath
        }
    })

    revalidatePath('/')
    revalidatePath('/products')

    redirect('/admin/products')
}

export async function toggleProductAvailiblitiy(id:string,isAvailableForPurchase:boolean) {
    await db.product.update(
        {
            where : { id },
            data: { isAvailableForPurchase }
        }
    )

    revalidatePath("/")
    revalidatePath("/products")
}

export async function deleteProduct(id:string) {
    const product = await db.product.delete({where:{ id : id}})

    if(product === null) return notFound()

    await fs.unlink(product.filePath)
    await fs.unlink(`public${product.imagePath}`)

    revalidatePath("/")
    revalidatePath("/products")
}