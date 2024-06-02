import db from "@/db/db";
import { PageHeader } from "../_components/PageHeader";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CheckCircle2, MoreVertical, XCircle } from "lucide-react";
import { formatCurrency, formatNumber } from "../../../lib/formatter";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { DeleteProductDropdownItem, ToggleProductDropdoenItem } from "./_components/ProductAction";
import { Button } from "@/components/ui/button";

export default function ProductPage() {
  return (
    <>
    <PageHeader>Products</PageHeader>
    <Button asChild>
      <Link href="/admin/products/new">Add Product</Link>
    </Button>
    <ProductTable/>
    </>
  )
}

async function ProductTable() {
  const products = await db.product.findMany({
    select:{
      id:true,
      price : true,
      name : true ,
      isAvailableForPurchase : true,
      _count : { select :{ order:true}}
    },
    orderBy:{name:"asc"}
  })

  if(products.length === 0)
  return <p>No Product Found</p>

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-0">
            <span className="sr-only">
              Available For Purchase
            </span>
          </TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Price</TableHead>
          <TableHead>Orders</TableHead>
          <TableHead className="w-0">
            <span className="sr-only">
              Actions
            </span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {
          products.map(product=>(
            <TableRow>
              <TableCell>
                {
                  product.isAvailableForPurchase?(
                    <>
                    <span className="sr-only">Available</span>
                    <CheckCircle2/>
                    </>
                  ) : (
                    <>
                    <span className="sr-only">Unavailable</span>
                    <XCircle className="stroke-destructive"/>
                    </>
                  )
                }
              </TableCell>
              <TableCell>{product.name}</TableCell>
              <TableCell>{formatCurrency(product.price)}</TableCell>
              <TableCell>{formatNumber(product._count.order)}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <span className="sr-only">Actions</span>
                    <MoreVertical/>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem asChild>
                      <a download href={`/admin/products/${product.id}/download`}>Download</a>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href={`/admin/products/${product.id}/edit`}>Edit</Link>
                    </DropdownMenuItem>
                    <ToggleProductDropdoenItem 
                    id={product.id} 
                    isAvailableForPurchase={product.isAvailableForPurchase}
                    />
                    <DropdownMenuSeparator/>
                    <DeleteProductDropdownItem
                    id={product.id}
                    disabled = {product._count.order > 0}
                    />
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))
        }
      </TableBody>
    </Table>
  )
}