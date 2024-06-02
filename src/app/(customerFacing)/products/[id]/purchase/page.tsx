import db from "@/db/db"
import { notFound } from "next/navigation"
import Stripe from "stripe";
import CheckoutForm from "./_components/CheckoutForm";

const stripe=new Stripe(process.env.STRIPE_SECRET_KEY as string)

export default async function PurchasePage({
    params : {id}
}:{
    params : { id : string}
}) {
    const product = await db.product.findUnique({
        where:{id}
    })

    if (product==null) {
        return notFound()
    }

    const stripePaymentIntent = await stripe.paymentIntents.create({
        amount:product.price *100,
        currency : "PKR",
        metadata:{productId:product.id}
    })

    if (stripePaymentIntent.client_secret === null) {
        throw new Error("stripe failed to create payment intent")
    }

    return (
        <CheckoutForm product={product} clientSecret={stripePaymentIntent.client_secret}/>
    )
}