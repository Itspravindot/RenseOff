import type { Metadata } from "next"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export const metadata: Metadata = {
  title: "About • Rense Off",
  description: "Learn more about Rense Off premium cleaning products",
}

export default function AboutPage() {
  return (
    <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <section className="max-w-3xl">
        <h1 className="text-3xl font-semibold tracking-tight text-pretty">About Rense Off</h1>
        <p className="mt-4 text-muted-foreground leading-relaxed">
          This page is fully editable. Replace the copy below with your brand story, mission, and values. Keep
          paragraphs concise and customer-focused.
        </p>

        <div className="grid gap-6 mt-8 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Our Promise</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground leading-relaxed">
              We craft effective, safe, and reliable cleaning solutions for every home. Pet-safe and surface-friendly
              formulas you can trust.
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quality First</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground leading-relaxed">
              Small-batch production with rigorous quality testing ensures consistent results and a premium experience.
            </CardContent>
          </Card>
        </div>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-lg">Edit This Section</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground leading-relaxed">
            You can freely edit this page later to include certifications, ingredients, sustainability practices,
            manufacturing details, or brand timeline.
          </CardContent>
        </Card>
      </section>
    </main>
  )
}
