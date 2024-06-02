import { ProductCard, ProductCardSkeleton } from "@/components/ProductCard";
import db from "@/db/db";
import { cache } from "@/lib/cache";
import { Suspense } from "react";

const getProducts=cache(()=>{
    return db.product.findMany({
        select:{
            id : true,
            name : true,
            description : true,
            imagePath : true,
            price : true,
        }
    })
},
['/products','getProducts'])

export default function ProductPage() {
    return <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        <Suspense
        fallback={<>
        <ProductCardSkeleton/>
        <ProductCardSkeleton/>
        <ProductCardSkeleton/>
        <ProductCardSkeleton/>
        <ProductCardSkeleton/>
        <ProductCardSkeleton/>
        </>}
        >
            <ProductSuspense/>
        </Suspense>
    </div>
}

async function ProductSuspense(){
    await setTimeout(()=>{
        return Promise.resolve()
    },2000)
    return (await getProducts()).map(product=><ProductCard key={product.id} {...product}/>)
}