import { ProductCard, ProductCardSkeleton } from "@/components/ProductCard"
import { Button } from "@/components/ui/button"
import db from "@/db/db"
import { cache } from "@/lib/cache"
import { Product } from "@prisma/client"
import Link from "next/link"
import { Suspense } from "react"

const getMostPopularProducts = cache(()=>{
    return db.product.findMany({
        where:{isAvailableForPurchase:true},
        orderBy: { order:{_count:"desc"}},
        take:6
    })
},
["/","getMostPopularProducts"],
{revalidate : 60 * 60 * 24 }
)

const getNewestProducts = cache(()=>{
    return db.product.findMany({
        where:{isAvailableForPurchase:true},
        orderBy: { createdAt : "desc"},
        take:6
    })
},
["/","getNewestProducts"],
{revalidate : 60 * 60 * 24 }
)

export default function HomePage(){
    return (
        <main className="space-y-12">
            <ProductGrid 
            title="Most Popular" 
            productFetcher={getMostPopularProducts} 
            />
            <ProductGrid 
            title="Newest" 
            productFetcher={getNewestProducts} 
            />
        </main>
    )
}

type ProductGridProps = {
    productFetcher : ()=>Promise<Product[]>,
    title : string
}

async function ProductGrid({
    title,
    productFetcher
}:ProductGridProps){
    return (
        <div className="space-y-4">
            <div className="flex gap-4">
                <h2 className="text-3xl font-bold">{title}</h2>
                <Button asChild variant={"outline"}>
                    <Link href='/products' className="space-x-2">
                        <span>View All</span>
                    </Link>
                </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                <Suspense
                fallback={
                    <>
                        <ProductCardSkeleton/>
                        <ProductCardSkeleton/>
                        <ProductCardSkeleton/>
                    </>
                }
                >
                    <ProductSuspense productFetcher={productFetcher}/>
                </Suspense>
            </div>
        </div>
    )
}

async function ProductSuspense({productFetcher}:{productFetcher :()=>Promise<Product[]>}) {
    return (await productFetcher()).map(product => (<ProductCard key={product.id} {...product}/>))
}