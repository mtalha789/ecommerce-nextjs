import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import db from "@/db/db"
import { formatCurrency, formatNumber } from "@/lib/formatter"

async function getProductsDetail() {
  const [activeProducts , inActiveProducts ] = await Promise.all([
    db.product.count({where:{isAvailableForPurchase:true}}),
    db.product.count({where:{isAvailableForPurchase:false}})
  ])
  return { activeProducts , inActiveProducts }  
}

async function getSalesDetail() {
  const data= await db.order.aggregate({
    _sum:{pricePaid :true},
    _count:true
  })
  return {
    amount : data._sum.pricePaid,
    numberOfSales : data._count
  }  
}

async function getUsersData() {
  const [userCount,orderData] = await Promise.all([
    db.user.count(),
    db.order.aggregate({
      _sum:{pricePaid:true}
    }) 
  ])

  return {
    userCount,
    averageSalePerUser: userCount === 0 ? 0 : (orderData._sum.pricePaid || 0) /userCount
  }
}

export default async function AdminDashboardPage() {

  const [ salesData , productData , userData ] = await Promise.all([
    getSalesDetail() ,getProductsDetail() , getUsersData()
  ])

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <DashboardCard 
      title="Sales" 
      subtitle={`${formatNumber(salesData.numberOfSales)} Orders`} 
      body={formatCurrency(salesData.amount || 0)}
      />
      <DashboardCard 
      title="Active Products" 
      subtitle={`${formatNumber(productData.inActiveProducts)} Inactive`} 
      body={formatNumber(productData.activeProducts)}
      />
      <DashboardCard 
      title="Customers" 
      subtitle={`${formatCurrency(userData.averageSalePerUser)} Average Value`} 
      body={formatNumber(userData.userCount)}
      />
    </div>
  )
}



type DashboardCardProps = {
    title: string
    subtitle: string
    body: string
  }
  

export function DashboardCard({title,subtitle,body} : DashboardCardProps){

    return(
        <Card>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{subtitle}</CardDescription>
            </CardHeader>
            <CardContent>
                <p>{body}</p>
            </CardContent>
        </Card>
    )
}
