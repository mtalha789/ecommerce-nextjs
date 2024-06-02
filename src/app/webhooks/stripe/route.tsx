import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import {Resend} from "resend";
import db from "@/db/db";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)
const resend = new Resend(process.env.RESEND_API_KEY as string)

export async function POST(req:NextRequest){
    const event = await stripe.webhooks.constructEvent(
        await req.text(),
        req.headers.get("stripe-signature") as string,
        process.env.STRIPE_WEBHOOK_SECRET as string
    )

    console.log('event:',event);
    
    if (event.type == "charge.succeeded") {
        const charge = event.data.object
        const productId = charge.metadata.productId
        const email = charge.billing_details.email  
        const pricePaid = charge.amount

        const product = await db.product.findUnique({where:{id:productId}})

        if (product == null || email == null) {
                return new NextResponse("Bad request",{status: 400})
        }

        const userFields = {
            email,
            order : { create : {productId, pricePaid}}
        }

        const {
            order : [order],
        } = await db.user.upsert({
            where : {email},
            create: userFields,
            update : userFields,
            select:{order:{orderBy: {createdAt : "desc"} , take:1}}
        })
    }
}