"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { isAuthenticated, getAuthToken } from "@/lib/auth"
import { useRouter } from "next/navigation"
import { Smartphone, Lock } from "lucide-react"

export function ProfileClient() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [otpData, setOtpData] = useState({
    phone: "",
    otp: "",
  })
  const [otpSent, setOtpSent] = useState(false)
  const [otpTimer, setOtpTimer] = useState(0)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    // Check if user is authenticated
    if (!isAuthenticated()) {
      router.push('/login?redirectTo=/profile')
      return
    }

    // Get user data from auth token
    const token = getAuthToken()
    if (token) {
      setUser(token)
      if (token.phone) {
        setOtpData(prev => ({ ...prev, phone: token.phone }))
      }
    }
  }, [router])

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer((prev) => prev - 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [otpTimer])

  const handleSendOTP = async () => {
    if (!otpData.phone || otpData.phone.length < 10) {
      alert("Please enter a valid phone number")
      return
    }
    
    setIsLoading(true)
    try {
      const response = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phone: otpData.phone }),
      })
      
      const data = await response.json()
      
      if (data.success) {
        setOtpSent(true)
        setOtpTimer(30) // 30 seconds countdown
        alert("OTP sent to your phone number")
      } else {
        alert(data.error || "Failed to send OTP")
      }
    } catch (error) {
      console.error("OTP send error:", error)
      alert("Failed to send OTP. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }
  
  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!otpData.otp || otpData.otp.length < 4) {
      alert("Please enter a valid OTP")
      return
    }
    
    setIsLoading(true)
    try {
      const response = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          phone: otpData.phone,
          otp: otpData.otp 
        }),
      })
      
      const data = await response.json()
      
      if (data.success) {
        alert("Phone number verified successfully")
        window.location.reload() // Refresh to update auth token
      } else {
        alert(data.error || "Invalid OTP")
      }
    } catch (error) {
      console.error("OTP verification error:", error)
      alert("Failed to verify OTP. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  if (!user) {
    return <div className="container py-16">Loading...</div>
  }

  return (
    <main className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold mb-8">My Profile</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Account Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {user.email && (
                  <div>
                    <Label>Email</Label>
                    <div className="text-lg">{user.email}</div>
                  </div>
                )}
                
                {user.phone && (
                  <div>
                    <Label>Phone</Label>
                    <div className="text-lg">{user.phone}</div>
                  </div>
                )}
                
                <div>
                  <Label>Authentication Method</Label>
                  <div className="text-lg capitalize">{user.authMethod || "Password"}</div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div>
            <Card>
              <CardHeader>
                <CardTitle>OTP Login Setup</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleVerifyOTP} className="space-y-4">
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <div className="relative">
                      <Smartphone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="phone"
                        type="tel"
                        value={otpData.phone}
                        onChange={(e) => setOtpData({ ...otpData, phone: e.target.value })}
                        placeholder="Enter your phone number"
                        className="pl-10"
                        required
                        disabled={otpSent}
                      />
                    </div>
                  </div>

                  {!otpSent ? (
                    <Button 
                      type="button" 
                      className="w-full" 
                      onClick={handleSendOTP}
                      disabled={isLoading || !otpData.phone}
                    >
                      {isLoading ? "Sending..." : "Send OTP"}
                    </Button>
                  ) : (
                    <>
                      <div>
                        <Label htmlFor="otp">Enter OTP</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="otp"
                            type="text"
                            value={otpData.otp}
                            onChange={(e) => setOtpData({ ...otpData, otp: e.target.value })}
                            placeholder="Enter OTP sent to your phone"
                            className="pl-10"
                            required
                          />
                        </div>
                        {otpTimer > 0 && (
                          <p className="text-xs text-muted-foreground mt-1">
                            Resend OTP in {otpTimer} seconds
                          </p>
                        )}
                        {otpTimer === 0 && (
                          <Button
                            type="button"
                            variant="link"
                            className="p-0 h-auto text-xs mt-1"
                            onClick={() => {
                              setOtpSent(false);
                            }}
                          >
                            Resend OTP
                          </Button>
                        )}
                      </div>
                      <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? "Verifying..." : "Verify Phone"}
                      </Button>
                    </>
                  )}
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  )
}