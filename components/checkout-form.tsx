"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { RazorpayPayment } from "@/components/razorpay-payment"
import { useCart } from "@/hooks/use-cart"
import { ArrowLeft, Lock } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { isAuthenticated } from "@/lib/auth"

interface CheckoutData {
  email: string
  firstName: string
  lastName: string
  phone: string
  shippingAddress: {
    address: string
    city: string
    state: string
    zipCode: string
    country: string
  }
  billingAddress: {
    address: string
    city: string
    state: string
    zipCode: string
    country: string
  }
  sameAsShipping: boolean
}

interface PaymentData {
  cardNumber: string
  expiryDate: string
  cvv: string
  cardholderName: string
  paymentMethod: "card" | "paypal" | "apple_pay"
}

export function CheckoutForm() {
  const { items, total, clearCart } = useCart()
  const router = useRouter()
  const [isProcessing, setIsProcessing] = useState(false)
  const [currentStep, setCurrentStep] = useState<"shipping" | "payment">("shipping")
  
  // Check if user is authenticated
  useEffect(() => {
    if (!isAuthenticated()) {
      router.push(`/login?redirectTo=${encodeURIComponent('/checkout')}`);
    }
  }, [router]);
  
  const [formData, setFormData] = useState<CheckoutData>({
    email: "",
    firstName: "",
    lastName: "",
    phone: "",
    shippingAddress: {
      address: "",
      city: "",
      state: "",
      zipCode: "",
      country: "United States",
    },
    billingAddress: {
      address: "",
      city: "",
      state: "",
      zipCode: "",
      country: "United States",
    },
    sameAsShipping: true,
  })

  const [paymentData, setPaymentData] = useState<PaymentData>({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardholderName: "",
    paymentMethod: "card",
  })

  const shipping = total > 50 ? 0 : 5.99
  const tax = total * 0.08
  const finalTotal = total + shipping + tax

  const handleInputChange = (field: string, value: string) => {
    if (field.includes(".")) {
      const [parent, child] = field.split(".")
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof CheckoutData],
          [child]: value,
        },
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }))
    }
  }

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      sameAsShipping: checked,
      billingAddress: checked ? prev.shippingAddress : prev.billingAddress,
    }))
  }

  const handlePaymentChange = (field: keyof PaymentData, value: string | "card" | "paypal" | "apple_pay") => {
    setPaymentData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const validateShippingForm = () => {
    const required = [
      formData.email,
      formData.firstName,
      formData.lastName,
      formData.shippingAddress.address,
      formData.shippingAddress.city,
      formData.shippingAddress.state,
      formData.shippingAddress.zipCode,
    ]
    return required.every((field) => field.trim() !== "")
  }

  const handleContinueToPayment = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateShippingForm()) {
      setCurrentStep("payment")
    }
  }

  const handlePaymentSuccess = async (paymentData: any) => {
    setIsProcessing(true)

    try {
      const orderData = {
        customer: {
          email: formData.email,
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
        },
        shippingAddress: formData.shippingAddress,
        billingAddress: formData.sameAsShipping ? formData.shippingAddress : formData.billingAddress,
        items: items,
        pricing: {
          subtotal: total,
          shipping: shipping,
          tax: tax,
          total: finalTotal,
        },
        payment: {
          method: "razorpay",
          razorpay_payment_id: paymentData.razorpay_payment_id,
          razorpay_order_id: paymentData.razorpay_order_id,
          razorpay_signature: paymentData.razorpay_signature,
        },
      }

      const orderResponse = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      })

      const orderResult = await orderResponse.json()

      if (orderResult.success) {
        clearCart()
        router.push(`/order-success?order=${orderResult.orderId}`)
      } else {
        throw new Error(orderResult.error || "Order creation failed")
      }
    } catch (error) {
      console.error("Order error:", error)
      alert("Order failed. Please try again.")
    } finally {
      setIsProcessing(false)
    }
  }

  const handlePaymentError = (error: any) => {
    console.error("Payment error:", error)
    alert(`Payment failed: ${error.description || "Please try again"}`)
    setIsProcessing(false)
  }

  if (items.length === 0) {
    return (
      <main className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-3xl font-bold mb-4">Your cart is empty</h1>
          <p className="text-muted-foreground mb-8">Add some products to your cart before checking out.</p>
          <Link href="/products">
            <Button>Continue Shopping</Button>
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-8">
          <Link href="/cart" className="inline-flex items-center text-primary hover:text-primary/80 mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Cart
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">Checkout</h1>

          <div className="flex items-center mt-4 space-x-4">
            <div
              className={`flex items-center ${currentStep === "shipping" ? "text-primary" : "text-muted-foreground"}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${currentStep === "shipping" ? "bg-primary text-primary-foreground" : "bg-muted"}`}
              >
                1
              </div>
              <span className="ml-2">Shipping</span>
            </div>
            <div className="w-8 h-px bg-border"></div>
            <div
              className={`flex items-center ${currentStep === "payment" ? "text-primary" : "text-muted-foreground"}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${currentStep === "payment" ? "bg-primary text-primary-foreground" : "bg-muted"}`}
              >
                2
              </div>
              <span className="ml-2">Payment</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Checkout Form */}
          <div className="space-y-6">
            {currentStep === "shipping" ? (
              <form onSubmit={handleContinueToPayment}>
                {/* Contact Information */}
                <Card>
                  <CardHeader>
                    <CardTitle>Contact Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        required
                        placeholder="your@email.com"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">First Name *</Label>
                        <Input
                          id="firstName"
                          value={formData.firstName}
                          onChange={(e) => handleInputChange("firstName", e.target.value)}
                          required
                          placeholder="John"
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Last Name *</Label>
                        <Input
                          id="lastName"
                          value={formData.lastName}
                          onChange={(e) => handleInputChange("lastName", e.target.value)}
                          required
                          placeholder="Doe"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        placeholder="(555) 123-4567"
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Shipping Address */}
                <Card>
                  <CardHeader>
                    <CardTitle>Shipping Address</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="shippingAddress">Street Address *</Label>
                      <Input
                        id="shippingAddress"
                        value={formData.shippingAddress.address}
                        onChange={(e) => handleInputChange("shippingAddress.address", e.target.value)}
                        required
                        placeholder="123 Main Street"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="shippingCity">City *</Label>
                        <Input
                          id="shippingCity"
                          value={formData.shippingAddress.city}
                          onChange={(e) => handleInputChange("shippingAddress.city", e.target.value)}
                          required
                          placeholder="New York"
                        />
                      </div>
                      <div>
                        <Label htmlFor="shippingState">State *</Label>
                        <Input
                          id="shippingState"
                          value={formData.shippingAddress.state}
                          onChange={(e) => handleInputChange("shippingAddress.state", e.target.value)}
                          required
                          placeholder="NY"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="shippingZip">ZIP Code *</Label>
                        <Input
                          id="shippingZip"
                          value={formData.shippingAddress.zipCode}
                          onChange={(e) => handleInputChange("shippingAddress.zipCode", e.target.value)}
                          required
                          placeholder="10001"
                        />
                      </div>
                      <div>
                        <Label htmlFor="shippingCountry">Country *</Label>
                        <Input
                          id="shippingCountry"
                          value={formData.shippingAddress.country}
                          onChange={(e) => handleInputChange("shippingAddress.country", e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Billing Address */}
                <Card>
                  <CardHeader>
                    <CardTitle>Billing Address</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="sameAsShipping"
                        checked={formData.sameAsShipping}
                        onCheckedChange={handleCheckboxChange}
                      />
                      <Label htmlFor="sameAsShipping">Same as shipping address</Label>
                    </div>

                    {!formData.sameAsShipping && (
                      <>
                        <div>
                          <Label htmlFor="billingAddress">Street Address *</Label>
                          <Input
                            id="billingAddress"
                            value={formData.billingAddress.address}
                            onChange={(e) => handleInputChange("billingAddress.address", e.target.value)}
                            required
                            placeholder="123 Main Street"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="billingCity">City *</Label>
                            <Input
                              id="billingCity"
                              value={formData.billingAddress.city}
                              onChange={(e) => handleInputChange("billingAddress.city", e.target.value)}
                              required
                              placeholder="New York"
                            />
                          </div>
                          <div>
                            <Label htmlFor="billingState">State *</Label>
                            <Input
                              id="billingState"
                              value={formData.billingAddress.state}
                              onChange={(e) => handleInputChange("billingAddress.state", e.target.value)}
                              required
                              placeholder="NY"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="billingZip">ZIP Code *</Label>
                            <Input
                              id="billingZip"
                              value={formData.billingAddress.zipCode}
                              onChange={(e) => handleInputChange("billingAddress.zipCode", e.target.value)}
                              required
                              placeholder="10001"
                            />
                          </div>
                          <div>
                            <Label htmlFor="billingCountry">Country *</Label>
                            <Input
                              id="billingCountry"
                              value={formData.billingAddress.country}
                              onChange={(e) => handleInputChange("billingAddress.country", e.target.value)}
                              required
                            />
                          </div>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>

                <Button type="submit" size="lg" className="w-full">
                  Continue to Payment
                </Button>
              </form>
            ) : (
              <div className="space-y-6">
                <RazorpayPayment
                  amount={finalTotal}
                  currency="INR"
                  orderData={{
                    customerName: `${formData.firstName} ${formData.lastName}`,
                    customerEmail: formData.email,
                    customerPhone: formData.phone,
                    orderId: `ORD-${Date.now().toString().slice(-6)}`,
                  }}
                  onSuccess={handlePaymentSuccess}
                  onError={handlePaymentError}
                />

                <Button type="button" variant="outline" onClick={() => setCurrentStep("shipping")} className="w-full">
                  Back to Shipping
                </Button>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Order Items */}
                <div className="space-y-3">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center gap-3">
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{item.name}</p>
                        <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                      </div>
                      <span className="text-sm font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <Separator />

                {/* Pricing Breakdown */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                </div>

                <Separator />

                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span>${finalTotal.toFixed(2)}</span>
                </div>

                <div className="text-xs text-muted-foreground text-center">
                  <Lock className="h-3 w-3 inline mr-1" />
                  Your payment information is secure and encrypted
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  )
}
