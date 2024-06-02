"use client"

import { useTransition } from 'react';
import {
    DropdownMenuItem
} from '../../../../components/ui/dropdown-menu';
import { deleteProduct, toggleProductAvailiblitiy } from '../../_actions/product';
import { useRouter } from 'next/navigation';

export function ToggleProductDropdoenItem({id,isAvailableForPurchase}:{id : string , isAvailableForPurchase : boolean}){
    const [isPending , startTransition] =useTransition()
    const router = useRouter()
    return (
        <DropdownMenuItem 
        disabled={isPending}
        onClick={()=>{
            startTransition(async()=>{
                await toggleProductAvailiblitiy(id,!isAvailableForPurchase)
                router.refresh()
            })
        }}
        >
            {isAvailableForPurchase?"Deaactivate":"Activate"}
        </DropdownMenuItem>
    )
}


export function DeleteProductDropdownItem({
    id,
    disabled
}:{
    id:string,
    disabled : boolean
}){
    const [isPending , startTransition] =useTransition()
    const router = useRouter()

    return (
        <DropdownMenuItem
        // variant="destructive"
        disabled = {disabled || isPending}
        onClick={()=>{
            startTransition(async()=>{
                await deleteProduct(id)
                router.refresh()
            })
        }}
        >
            Delete
        </DropdownMenuItem>
    )
}