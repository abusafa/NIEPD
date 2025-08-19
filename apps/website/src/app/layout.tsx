// This root layout is handled by middleware
// The middleware will redirect all requests to the appropriate locale
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
