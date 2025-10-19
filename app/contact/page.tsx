import type { Metadata } from "next"
import ContactClient from "./ContactClient"

export const metadata: Metadata = {
  title: "Contact • Rense Off",
  description: "Get in touch with Rense Off",
}

const CONTACT = {
  email: "renseoff.gmail.com",
  phone: "+91-90000-00000",
  website: "https://your-website.example",
  instagram: "",
  facebook: "https://facebook.com/your-page",
  twitter: "https://x.com/your-handle",
}

export default function ContactPage() {
  return <ContactClient />
}
