"use server"

import db from "@/db/db"
import OrderHistoryEmail from "@/email/OrderHistory"
import { Resend } from "resend"
import { z } from "zod"

const resend = new Resend(process.env.RESEND_API_KEY as string)
const emailSchema = z.string().email()

export async function userOrderExist({
    email,
    productId
}:{
    email : string,
    productId : string
}) {
    return (
        await db.order.findFirst({
            where: { user: {email } , productId}
        })
    )
}

export async function emailOrderHistory(prevState : unknown , formData : FormData) : Promise<{message? : string ; error? : string}> {
    const result = emailSchema.safeParse(formData.get("email"))

    if(result.success == false){
        return {error:"Invalid email address"}
    }

    const user = await db.user.findUnique({
        where : {email : result.data},
        select : { 
            email : true,
            order : {
                select : {
                    pricePaid : true,
                    id : true,
                    createdAt : true,
                    product : {
                        select : {
                            id : true,
                            name : true,
                            description : true,
                            imagePath : true,
                        }
                    }
                }
            }
        }

    })

    if (user == null) {
        return { message : "Check your email address to view your order history and download your products"}
    }

    const orders = user.order.map(async ord=>{
        return {
            ...ord,
            downloadVerificationId : (
                await db.downloadVerification.create({
                    data:{
                        productId : ord.product.id,
                        expiresAt : new Date(Date.now() + 1000 * 60 * 60 *24 )
                    }
                })
            ).id
        }
    })

    const data = await resend.emails.send({
        from : `Support <${process.env.SENDER_EMAIL}>`,
        to : user.email ,
        subject : "Order History",
        react : <OrderHistoryEmail orders={await Promise.all(orders)}/> 
    })

    if(data.error){
        return {error:"There was an error sending email. Please try again."}
    }

    return {message : "Visit your email to download your products"}
}