"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, CreditCard, Smartphone, Wallet } from "lucide-react"
import { getRazorpayConfig } from "@/lib/razorpay-config"

interface RazorpayPaymentProps {
  amount: number
  currency?: string
  orderData: {
    customerName: string
    customerEmail: string
    customerPhone: string
    orderId: string
  }
  onSuccess: (paymentData: any) => void
  onError: (error: any) => void
}

export function RazorpayPayment({ amount, currency = "INR", orderData, onSuccess, onError }: RazorpayPaymentProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [selectedMethod, setSelectedMethod] = useState<string>("card")
  const [razorpayKeyId, setRazorpayKeyId] = useState<string>("")

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const config = await getRazorpayConfig()
        setRazorpayKeyId(config.keyId)
      } catch (error) {
        console.error("Failed to fetch Razorpay config:", error)
      }
    }
    fetchConfig()
  }, [])

  const handlePayment = async () => {
    if (!razorpayKeyId) {
      onError({ description: "Payment configuration not loaded" })
      return
    }

    setIsLoading(true)

    try {
      // Create Razorpay order on your backend
      const response = await fetch("/api/razorpay/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: amount * 100, // Razorpay expects amount in paise
          currency,
          receipt: orderData.orderId,
        }),
      })

      const order = await response.json()

      if (!response.ok) {
        throw new Error(order.error || "Failed to create order")
      }

      // Initialize Razorpay
      const options = {
        key: razorpayKeyId, // Use key from server action
        amount: order.amount,
        currency: order.currency,
        name: "Rense Off",
        description: "Premium Cleaning Products",
        order_id: order.id,
        handler: (response: any) => {
          // Payment successful
          onSuccess({
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_signature: response.razorpay_signature,
          })
        },
        prefill: {
          name: orderData.customerName,
          email: orderData.customerEmail,
          contact: orderData.customerPhone,
        },
        theme: {
          color: "#059669", // Your brand green color
        },
        method: {
          netbanking: true,
          card: true,
          wallet: true,
          upi: true,
        },
      }

      // @ts-ignore - Razorpay is loaded via script
      const rzp = new window.Razorpay(options)

      rzp.on("payment.failed", (response: any) => {
        onError(response.error)
      })

      rzp.open()
    } catch (error) {
      console.error("Payment error:", error)
      onError(error)
    } finally {
      setIsLoading(false)
    }
  }

  const paymentMethods = [
    { id: "card", name: "Credit/Debit Card", icon: CreditCard },
    { id: "upi", name: "UPI", icon: Smartphone },
    { id: "wallet", name: "Wallet", icon: Wallet },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Payment Details
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">Select payment method:</p>
          <div className="grid grid-cols-3 gap-2">
            {paymentMethods.map((method) => {
              const Icon = method.icon
              return (
                <button
                  key={method.id}
                  onClick={() => setSelectedMethod(method.id)}
                  className={`p-3 rounded-lg border text-center transition-colors ${
                    selectedMethod === method.id
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <Icon className="h-5 w-5 mx-auto mb-1" />
                  <p className="text-xs">{method.name}</p>
                </button>
              )
            })}
          </div>
        </div>

        <div className="pt-4 border-t">
          <div className="flex justify-between items-center mb-4">
            <span className="font-medium">Total Amount:</span>
            <span className="text-xl font-bold">₹{amount.toFixed(2)}</span>
          </div>

          <Button onClick={handlePayment} disabled={isLoading || !razorpayKeyId} className="w-full" size="lg">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              `Pay ₹${amount.toFixed(2)}`
            )}
          </Button>
        </div>

        <p className="text-xs text-muted-foreground text-center">
          Secured by Razorpay. Your payment information is encrypted and secure.
        </p>
      </CardContent>
    </Card>
  )
}
