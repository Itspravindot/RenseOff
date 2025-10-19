"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Search, Package, Truck, CheckCircle } from "lucide-react"
import Link from "next/link"

interface Order {
  id: string
  status: string
  createdAt: string
  customer: {
    firstName: string
    lastName: string
    email: string
  }
  items: Array<{
    id: number
    name: string
    price: number
    quantity: number
  }>
  pricing: {
    total: number
  }
}

export function OrderTracker() {
  const [searchType, setSearchType] = useState<"orderId" | "email">("orderId")
  const [searchValue, setSearchValue] = useState("")
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchValue.trim()) return

    setLoading(true)
    setError("")

    try {
      const params = new URLSearchParams()
      if (searchType === "orderId") {
        params.set("orderId", searchValue)
      } else {
        params.set("email", searchValue)
      }

      const response = await fetch(`/api/orders?${params}`)
      const data = await response.json()

      if (data.success) {
        if (searchType === "orderId") {
          setOrders(data.order ? [data.order] : [])
        } else {
          setOrders(data.orders || [])
        }
      } else {
        setError(data.error || "Failed to find orders")
        setOrders([])
      }
    } catch (err) {
      setError("Failed to search orders")
      setOrders([])
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Package className="h-4 w-4" />
      case "processing":
        return <Package className="h-4 w-4 text-blue-500" />
      case "shipped":
        return <Truck className="h-4 w-4 text-orange-500" />
      case "delivered":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      default:
        return <Package className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "secondary"
      case "processing":
        return "default"
      case "shipped":
        return "secondary"
      case "delivered":
        return "default"
      default:
        return "secondary"
    }
  }

  return (
    <main className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Track Your Order</h1>
          <p className="text-lg text-muted-foreground">
            Enter your order ID or email address to track your order status
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Order Search</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="flex gap-4 mb-4">
                <Button
                  type="button"
                  variant={searchType === "orderId" ? "default" : "outline"}
                  onClick={() => setSearchType("orderId")}
                >
                  Order ID
                </Button>
                <Button
                  type="button"
                  variant={searchType === "email" ? "default" : "outline"}
                  onClick={() => setSearchType("email")}
                >
                  Email Address
                </Button>
              </div>

              <div>
                <Label htmlFor="search">{searchType === "orderId" ? "Order ID" : "Email Address"}</Label>
                <Input
                  id="search"
                  type={searchType === "email" ? "email" : "text"}
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  placeholder={
                    searchType === "orderId" ? "Enter your order ID (e.g., ORD-123456)" : "Enter your email address"
                  }
                  required
                />
              </div>

              <Button type="submit" disabled={loading} className="w-full">
                <Search className="h-4 w-4 mr-2" />
                {loading ? "Searching..." : "Track Order"}
              </Button>
            </form>

            {error && (
              <div className="mt-4 p-3 bg-destructive/10 border border-destructive/20 rounded text-destructive text-sm">
                {error}
              </div>
            )}
          </CardContent>
        </Card>

        {orders.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">
              {orders.length === 1 ? "Order Found" : `${orders.length} Orders Found`}
            </h2>

            {orders.map((order) => (
              <Card key={order.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-lg">Order #{order.id}</h3>
                      <p className="text-sm text-muted-foreground">
                        Placed on {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge variant={getStatusColor(order.status)} className="flex items-center gap-1">
                      {getStatusIcon(order.status)}
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </Badge>
                  </div>

                  <div className="space-y-3 mb-4">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                        </div>
                        <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>

                  <Separator className="my-4" />

                  <div className="flex justify-between items-center">
                    <div className="text-lg font-semibold">Total: ${order.pricing.total.toFixed(2)}</div>
                    <Link href={`/orders/${order.id}`}>
                      <Button variant="outline">View Details</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
