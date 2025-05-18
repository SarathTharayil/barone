import Link from "next/link"
import { Facebook, Instagram, Twitter } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-barone-darkteal text-white py-2">
      <div className="container text-center text-xs text-white/60 py-0">
        <p>&copy; {new Date().getFullYear()} Bar One. All rights reserved.</p>
      </div>
    </footer>
  )
}
