import Image from "next/image"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card"
import { formatNumber } from "@/lib/formatter"
import { Button } from "./ui/button"
import Link from "next/link"

type ProductCardProps = {
    id : string,
    name : string,
    price : number,
    description : string,
    imagePath : string,
}

export function ProductCard({
    id,
    description,
    name,
    imagePath,
    price
}:ProductCardProps) {
    return (
        <Card className="flex flex-col overflow-hidden">
            <div className="w-full aspect-video relative h-auto">
                <Image src={imagePath} alt={name} fill/>
            </div>
            <CardHeader>
                <CardTitle>{name}</CardTitle>
                <CardDescription>{formatNumber(price)}</CardDescription>
            </CardHeader>
            <CardContent>
                <p className="line-clamp-4">{description}</p>
            </CardContent>
            <CardFooter>
                <Button asChild size={"lg"} className="w-full">
                    <Link href={`/products/${id}/purchase`}>Purchase</Link>
                </Button>
            </CardFooter>
        </Card>
    )
}
export function ProductCardSkeleton() {
    return (
    <Card className="flex flex-col overflow-hidden animate-pulse">
        <div className="w-full aspect-video bg-gray"></div>
        <CardHeader>
            <CardTitle>
            <div className="w-3/4 h-6 rounded-full bg-gray-300" />
            </CardTitle>
            <CardDescription>
            <div className="w-1/2 h-4 rounded-full bg-gray-300" />
            </CardDescription>
        </CardHeader>
        <CardContent>
            <div className="w-full h-4 rounded-full bg-gray-300" />
            <div className="w-full h-4 rounded-full bg-gray-300" />
            <div className="w-3/4 h-4 rounded-full bg-gray-300" />
        </CardContent>
        <CardFooter>
            <Button disabled size={"lg"} className="w-full"></Button>
        </CardFooter>
    </Card>
    )
}