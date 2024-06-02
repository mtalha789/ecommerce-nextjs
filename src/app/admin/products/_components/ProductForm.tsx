"use client"

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Product } from '@prisma/client'
import Image from "next/image";
import { useFormState, useFormStatus } from "react-dom";
import { addProduct, updateProduct } from "../../_actions/product"

export function ProductForm({ product } : {product ? : Product | null} ){
    const [ error , action ]=useFormState(
        product == null ? addProduct : updateProduct.bind(null , product.id),
        {}
    )
    
    return (
        <form action={action}>
            <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                type="text"
                name="name"
                id="name"
                defaultValue={product?.name || ""}
                required
                />
                {error.name && <div className="text-destructive">{error.name}</div>}
            </div>
            <div className="space-y-2">
                <Label htmlFor="price">Price In Paisa</Label>
                <Input
                type="number"
                name="price"
                id="price"
                defaultValue={product?.price || undefined}
                required
                />
                {error.price && <div className="text-destructive">{error.price}</div>}
            </div>
            <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                name="description"
                id="description"
                defaultValue={product?.description || ""}
                required
                />
                {error.description && (
                  <div className="text-destructive">{error.description}</div>
                )}
            </div>
            <div className="space-y-2">
                <Label htmlFor="file">File</Label>
                <Input
                type="file"
                name="file"
                id="file"
                required = {product == null}
                />
                {product != null && (
                <div className="text-muted-foreground">{product.filePath}</div>
                )}
                {error.file && (
                  <div className="text-destructive">{error.file}</div>
                )}
            </div>
            <div className="space-y-2">
                <Label htmlFor="image">Image</Label>
                <Input
                type="file"
                name="image"
                id="image"
                required = {product == null}
                />
                {product != null && (
                <Image src={product.imagePath} width="400" height="400" alt="Product Image"/>
                )}
                {error.image && (
                  <div className="text-destructive">{error.image}</div>
                )}
            </div>
            <SubmitButton/>
        </form>
    )
}

function SubmitButton() {
    const { pending } = useFormStatus()
  
    return (
      <Button type="submit" disabled={pending}>
        {pending ? "Saving..." : "Save"}
      </Button>
    )
  }