import { PageHeader } from "@/app/admin/_components/PageHeader";
import { ProductForm } from "../../_components/ProductForm";
import db from "@/db/db";

export default async function EditPage({
    params:{id}
}:{
    params : { id : string}
}){
    const product = await db.product.findFirst({
        where:{id}
    })
    return (
        <>
            <PageHeader>Edit Page</PageHeader>
            <ProductForm product={product}/>
        </>
    )
}