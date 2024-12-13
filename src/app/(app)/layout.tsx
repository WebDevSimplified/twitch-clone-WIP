import { SignedIn, UserButton } from "@clerk/nextjs"
import Link from "next/link"

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <NavBar />
      <main className="container py-10">{children}</main>
    </>
  )
}

function NavBar() {
  return (
    <header className="flex py-2 shadow bg-background">
      <nav className="flex items-center gap-6 container">
        <Link className="mr-auto text-lg" href="/">
          Lively
        </Link>
        <SignedIn>
          <Link
            href="/stream/mine"
            className="hover:underline focus-visible:underline"
          >
            Your Stream
          </Link>
          <div className="size-8">
            <UserButton
              appearance={{
                elements: {
                  userButtonAvatarBox: { width: "100%", height: "100%" },
                },
              }}
            />
          </div>
        </SignedIn>
      </nav>
    </header>
  )
}
