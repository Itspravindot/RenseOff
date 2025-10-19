"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { CreditCard, Smartphone, DollarSign } from "lucide-react"

interface PaymentData {
  cardNumber: string
  expiryDate: string
  cvv: string
  cardholderName: string
  paymentMethod: "card" | "paypal" | "apple_pay"
}

interface PaymentFormProps {
  paymentData: PaymentData
  onPaymentChange: (field: keyof PaymentData, value: string | "card" | "paypal" | "apple_pay") => void
  isProcessing: boolean
}

export function PaymentForm({ paymentData, onPaymentChange, isProcessing }: PaymentFormProps) {
  const [errors, setErrors] = useState<Record<string, string>>({})

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
    const matches = v.match(/\d{4,16}/g)
    const match = (matches && matches[0]) || ""
    const parts = []
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }
    if (parts.length) {
      return parts.join(" ")
    } else {
      return v
    }
  }

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
    if (v.length >= 2) {
      return v.substring(0, 2) + "/" + v.substring(2, 4)
    }
    return v
  }

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value)
    onPaymentChange("cardNumber", formatted)
  }

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatExpiryDate(e.target.value)
    onPaymentChange("expiryDate", formatted)
  }

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, "").substring(0, 4)
    onPaymentChange("cvv", value)
  }

  return (
    <div className="space-y-6">
      {/* Payment Method Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Method</CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={paymentData.paymentMethod}
            onValueChange={(value) => onPaymentChange("paymentMethod", value as "card" | "paypal" | "apple_pay")}
            className="space-y-3"
          >
            <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-muted/50">
              <RadioGroupItem value="card" id="card" />
              <Label htmlFor="card" className="flex items-center gap-2 cursor-pointer flex-1">
                <CreditCard className="h-4 w-4" />
                Credit/Debit Card
              </Label>
            </div>
            <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-muted/50">
              <RadioGroupItem value="paypal" id="paypal" />
              <Label htmlFor="paypal" className="flex items-center gap-2 cursor-pointer flex-1">
                <DollarSign className="h-4 w-4" />
                PayPal
              </Label>
            </div>
            <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-muted/50">
              <RadioGroupItem value="apple_pay" id="apple_pay" />
              <Label htmlFor="apple_pay" className="flex items-center gap-2 cursor-pointer flex-1">
                <Smartphone className="h-4 w-4" />
                Apple Pay
              </Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Credit Card Form */}
      {paymentData.paymentMethod === "card" && (
        <Card>
          <CardHeader>
            <CardTitle>Card Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="cardholderName">Cardholder Name *</Label>
              <Input
                id="cardholderName"
                value={paymentData.cardholderName}
                onChange={(e) => onPaymentChange("cardholderName", e.target.value)}
                placeholder="John Doe"
                required
              />
            </div>

            <div>
              <Label htmlFor="cardNumber">Card Number *</Label>
              <Input
                id="cardNumber"
                value={paymentData.cardNumber}
                onChange={handleCardNumberChange}
                placeholder="1234 5678 9012 3456"
                maxLength={19}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="expiryDate">Expiry Date *</Label>
                <Input
                  id="expiryDate"
                  value={paymentData.expiryDate}
                  onChange={handleExpiryChange}
                  placeholder="MM/YY"
                  maxLength={5}
                  required
                />
              </div>
              <div>
                <Label htmlFor="cvv">CVV *</Label>
                <Input
                  id="cvv"
                  value={paymentData.cvv}
                  onChange={handleCvvChange}
                  placeholder="123"
                  maxLength={4}
                  required
                />
              </div>
            </div>

            <div className="text-xs text-muted-foreground">
              Your card information is encrypted and secure. We never store your payment details.
            </div>
          </CardContent>
        </Card>
      )}

      {/* PayPal Integration Placeholder */}
      {paymentData.paymentMethod === "paypal" && (
        <Card>
          <CardContent className="p-6 text-center">
            <DollarSign className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-semibold mb-2">PayPal Payment</h3>
            <p className="text-sm text-muted-foreground mb-4">
              You will be redirected to PayPal to complete your payment securely.
            </p>
            <div className="bg-muted p-3 rounded text-xs text-muted-foreground">
              PayPal integration ready - connect your PayPal merchant account
            </div>
          </CardContent>
        </Card>
      )}

      {/* Apple Pay Integration Placeholder */}
      {paymentData.paymentMethod === "apple_pay" && (
        <Card>
          <CardContent className="p-6 text-center">
            <Smartphone className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-semibold mb-2">Apple Pay</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Use Touch ID or Face ID to pay securely with Apple Pay.
            </p>
            <div className="bg-muted p-3 rounded text-xs text-muted-foreground">
              Apple Pay integration ready - requires Apple Pay merchant setup
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
