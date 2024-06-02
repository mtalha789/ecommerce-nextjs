"use client"

import React, { FormEvent, useState } from "react";
import {
  PaymentElement,
  useStripe,
  useElements,
  LinkAuthenticationElement,
  Elements
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { userOrderExist } from "@/actions/order";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/formatter";
import Image from "next/image";

type CheckoutFormProps={
  product:{
    id:string
    imagePath : string
    name : string
    description : string
    price : number
  }
  clientSecret : string
}

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string)

export default function CheckoutForm({ product , clientSecret} : CheckoutFormProps) {
  return (
    <div className="max-w-5xl w-full space-y-8 mx-auto">
      <div className="flex gap-4 items-center">
        <div className="flex-shrink-0 aspect-video w-1/3 relative">
          <Image
          src={product.imagePath}
          alt={product.name}
          className="object-cover"
          fill
          />
        </div>
        <div>
          <div className="text-lg">
            {formatCurrency(product.price)}
          </div>
          <h1 className="text-2xl font-bold">{product.name}</h1>
          <div className="line-clamp-3 text-muted-foreground">{product.description}</div>
        </div>
      </div>
      <Elements options={{clientSecret}} stripe={stripePromise}>
        <Form price={product.price} productId={product.id}/>
      </Elements>
    </div>
  )
}

function Form({
  price,
  productId
} : {
  price : number,
  productId : string
}){
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string>()
  const [email, setEmail] = useState<string>()

  const handleSubmit = async (e:FormEvent) => {
    e.preventDefault();

    if (stripe==null || elements ==  null || email == null) return 

    setIsLoading(true);

    const orderExist = await userOrderExist({email,productId})

    if(orderExist){
      setErrorMessage("You have already purchased this product. Try downloading it from the My Orders page")

      setIsLoading(false)
      return
    }

    stripe
      .confirmPayment({
        elements,
        confirmParams:{
          return_url:`${process.env.NEXT_PUBLIC_SERVER_URL}/stripe/purchase-success`
        }
      })
      .then(({error})=>{
        if(error.type == "card_error" || error.type == "validation_error"){
          setErrorMessage(error.message)
        }else{
          setErrorMessage("An unknown error ocurred")
        }
      }).finally(()=>{
        setIsLoading(false);
      })
  };

  return (
    <form id="payment-form" onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Checkout</CardTitle>
          {
            errorMessage && <CardDescription>
              {errorMessage}
            </CardDescription>
          }
        </CardHeader>
        <CardContent>
          <PaymentElement/>
          <div className="mt-4">
            <LinkAuthenticationElement
            onChange={e=>setEmail(e.value.email)}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button
          className="w-full"
          size='lg'
          disabled={isLoading || stripe==null || elements == null}
          >
            {isLoading?'Purchasing...':`Purchase pkr${formatCurrency(price)}`}
          </Button>
        </CardFooter>
      </Card>
    </form>
    )
}