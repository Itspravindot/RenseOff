"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { Mail, Phone, Instagram, Send } from "lucide-react"

type ContactPayload = { name: string; email: string; subject?: string; message: string }

export default function ContactClient() {
  const { toast } = useToast()
  const [loading, setLoading] = useState<{ contact?: boolean }>({})

  async function submitContact(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const payload: ContactPayload = {
      name: String(fd.get("name") || ""),
      email: String(fd.get("email") || ""),
      subject: String(fd.get("subject") || ""),
      message: String(fd.get("message") || ""),
    }
    setLoading((s) => ({ ...s, contact: true }))
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error("Failed")
      toast({ title: "Message sent", description: "Thanks! We’ll get back to you shortly." })
      e.currentTarget.reset()
    } catch {
      toast({ title: "Something went wrong", description: "Please try again.", variant: "destructive" })
    } finally {
      setLoading((s) => ({ ...s, contact: false }))
    }
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 md:py-14">
      {/* Header */}
      <section className="mb-10 md:mb-12">
        <h1 className="text-balance text-3xl font-semibold tracking-tight md:text-4xl">Contact Rense Off</h1>
        <p className="mt-2 text-muted-foreground max-w-prose">
          Questions or feedback? Reach us here—our team is happy to help.
        </p>
      </section>

      {/* Quick info cards */}
      <section className="grid gap-4 md:grid-cols-3 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center gap-2">
            <Mail className="h-5 w-5 text-primary" />
            <CardTitle className="text-base">Email</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">support@example.com</CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center gap-2">
            <Phone className="h-5 w-5 text-primary" />
            <CardTitle className="text-base">Phone</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">+91 90000 00000</CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center gap-2">
            <Instagram className="h-5 w-5 text-primary" />
            <CardTitle className="text-base">Instagram</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">@renseoff</CardContent>
        </Card>
      </section>

      <Separator className="mb-8" />

      {/* Single contact form card */}
      <section>
        <Card>
          <CardHeader>
            <CardTitle>How can we help?</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={submitContact} className="grid gap-4 md:grid-cols-2">
              <div className="grid gap-2">
                <label className="text-sm font-medium">Name</label>
                <Input name="name" required placeholder="Your name" />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">Email</label>
                <Input type="email" name="email" required placeholder="you@example.com" />
              </div>
              <div className="md:col-span-2 grid gap-2">
                <label className="text-sm font-medium">Subject</label>
                <Input name="subject" placeholder="What’s this about?" />
              </div>
              <div className="md:col-span-2 grid gap-2">
                <label className="text-sm font-medium">Message</label>
                <Textarea name="message" required placeholder="Write your message..." rows={5} />
              </div>
              <div className="md:col-span-2">
                <Button type="submit" disabled={!!loading.contact} className="inline-flex items-center gap-2">
                  <Send className="h-4 w-4" />
                  {loading.contact ? "Sending..." : "Send message"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </section>
    </main>
  )
}
