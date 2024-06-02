import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PageHeader } from "../_components/PageHeader";
import db from "@/db/db";
import { formatCurrency } from "@/lib/formatter";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";
import { DeleteOrderDropdownItem } from "./_components/orderAction";

function getOrders(){
    return db.order.findMany({
        select : {
            id:true,
            pricePaid : true,
            product : {select: { name: true }},
            user : {select: { email: true }},
        },
        orderBy : {createdAt:"desc"}
    })
}

export default function OrderPage(){
    return (
        <>
            <PageHeader>Sales</PageHeader>
            <OrdersTable/>
        </>
    )
}

async function OrdersTable(){
    const orders = await getOrders()

    if (orders.length == 0) {
        return <p>No Sales</p>
    }
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead className="w-0"> 
                        <span className="sr-only">Actions</span>
                    </TableHead>
                </TableRow>
            </TableHeader>
            {orders.map(order=>(
                <TableBody>
                    <TableRow>
                        <TableCell>{order.product.name}</TableCell>
                        <TableCell>{order.user.email}</TableCell>
                        <TableCell>{formatCurrency(order.pricePaid)}</TableCell>
                        <TableCell>{formatCurrency(order.pricePaid)}</TableCell>
                        <TableCell>
                            <DropdownMenu>
                                <DropdownMenuTrigger>
                                    <MoreVertical/>
                                    <span className="sr-only">Actions</span>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DeleteOrderDropdownItem id={order.id}/>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </TableCell>
                    </TableRow>
                </TableBody>
            ))}
        </Table>
    )
}