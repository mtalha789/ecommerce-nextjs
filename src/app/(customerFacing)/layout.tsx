import { Nav, NavLink } from '@/components/Nav'
import { ReactNode } from 'react'

export const dynamice = "force-dynamic"

export default function layout({
    children 
}:Readonly<{
    children : ReactNode
}>) {
  return (
    <>
    <Nav>
        <NavLink href='/'>Home</NavLink>
        <NavLink href='/products'>Products</NavLink>
        <NavLink href='/orders'>My Orders</NavLink>
    </Nav>
    <div className="container my-6">{children}</div>
    </>
  )
}
