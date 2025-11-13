export const metadata = {
  title: "Noble Web Designs",
  description: "Sites with motion, strategy, clarity.",
}

import "./globals.css"

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}