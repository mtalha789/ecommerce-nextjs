import db from "@/db/db";
import { notFound } from "next/navigation";

export async function deleteOrder(orderId : string) {
    const order = await db.order.delete({
        where : {id:orderId}
    })

    if(order==null){
        return notFound()
    }
    return order
}