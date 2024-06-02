import { Nav, NavLink } from '@/components/Nav'
import { ReactNode } from 'react'

export default function layout({
    children 
}:Readonly<{
    children : ReactNode
}>) {
  return (
    <>
    <Nav>
        <NavLink href='/admin'>Dashboard</NavLink>
        <NavLink href='/admin/products'>Products</NavLink>
        <NavLink href='/admin/orders'>Orders</NavLink>
        <NavLink href='/admin/customers'>Customers</NavLink>
    </Nav>
    <div className="container my-6">{children}</div>
    </>
  )
}
