import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PageHeader } from "../_components/PageHeader";
import db from "@/db/db";
import { formatCurrency, formatNumber } from "@/lib/formatter";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";
import { DeleteUserDropdownItem } from "./_components/userActions";

function getUsers(){
    return db.user.findMany({
        select : {
            id:true,
            email : true,
            order : {select:{pricePaid : true}},
        },
        orderBy : {createdAt:"desc"}
    })
}

export default function UserPage(){
    return (
        <>
            <PageHeader>Customers</PageHeader>
            <UsersTable/>
        </>
    )
}

async function UsersTable(){
    const users = await getUsers()

    if (users.length == 0) {
        return <p>No customers found</p>
    }
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Email</TableHead>
                    <TableHead>Orders</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead className="w-0"> 
                        <span className="sr-only">Actions</span>
                    </TableHead>
                </TableRow>
            </TableHeader>
            {users.map(user=>(
                <TableBody>
                    <TableRow>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{formatNumber(user.order.length)}</TableCell>
                        <TableCell>{formatCurrency(user.order.reduce((sum,order)=>sum+order.pricePaid,0))}</TableCell>
                        <TableCell>
                            <DropdownMenu>
                                <DropdownMenuTrigger>
                                    <MoreVertical/>
                                    <span className="sr-only">Actions</span>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DeleteUserDropdownItem id={user.id}/>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </TableCell>
                    </TableRow>
                </TableBody>
            ))}
        </Table>
    )
}