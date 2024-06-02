"use client"

import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { deleteUser } from "../../_actions/customer";
import { useTransition } from "react";
import { useRouter } from "next/navigation";

export async function DeleteUserDropdownItem({id}:{id:string}){
    const [isPending , startTransition] =useTransition()
    const router = useRouter()
    
    return (
        <DropdownMenuItem 
        disabled={isPending}
        onClick={()=>{
            startTransition(async()=>{
                await deleteUser(id)
                router.refresh()
            })
        }}>Delete</DropdownMenuItem>
    )
}