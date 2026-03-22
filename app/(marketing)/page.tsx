import { Button } from "@/components/ui/button"
import Image from "next/image"
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ListBulletsIcon,
  SparkleIcon,
  UsersThreeIcon,
} from "@phosphor-icons/react/dist/ssr"
import { SignInButton, SignUpButton, UserButton } from "@clerk/nextjs"
import { auth } from "@clerk/nextjs/server"
import Link from "next/link"

export default async function MarketingPage() {
  const { userId } = await auth()
  const isAuthenticated = !!userId

  const features = [
    {
      icon: ListBulletsIcon,
      title: "Track watchlist",
      description:
        "Keep a detailed record of every movie and show you want to watch or have already seen. Never lose track of your library again.",
    },
    {
      icon: SparkleIcon,
      title: "Discover content",
      description:
        "Get personalized recommendations based on your unique viewing habits, powered by our advanced discovery engine.",
    },
    {
      icon: UsersThreeIcon,
      title: "See friends",
      description:
        "Connect with friends to see their ratings, reviews, and what's currently trending in your social circle.",
    },
  ]

  return (
    <div className="min-h-screen bg-sidebar-primary-foreground">
      {/* navbar */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-sidebar-primary-foreground/80 px-4 py-4 backdrop-blur-md sm:px-8">
        <nav className="container mx-auto flex items-center justify-between">
          <span className="text-xl font-extrabold tracking-tight sm:text-2xl">
            Watch<span className="text-chart-2">logger</span>
          </span>
          <div className="flex items-center gap-2 sm:gap-4">
            {isAuthenticated ? (
              <UserButton />
            ) : (
              <>
                <SignInButton>
                  <Button
                    variant="ghost"
                    className="hidden cursor-pointer text-sm sm:inline-flex"
                  >
                    Sign in
                  </Button>
                </SignInButton>
                <SignUpButton>
                  <Button className="cursor-pointer bg-chart-2 text-sm font-bold text-sidebar-primary-foreground hover:bg-chart-2/80">
                    Get Started
                  </Button>
                </SignUpButton>
              </>
            )}
          </div>
        </nav>
      </header>

      <main>
        {/* hero */}
        <section className="container mx-auto flex flex-col items-center gap-6 px-4 pt-20 pb-20 text-center sm:gap-8 sm:px-8 sm:pt-28">
          <div className="inline-flex items-center gap-2 rounded-full border border-chart-2/30 bg-chart-2/10 px-4 py-1.5 text-xs font-medium text-chart-2 sm:text-sm">
            <SparkleIcon size={14} />
            Your cinema companion
          </div>

          <h1 className="max-w-4xl text-4xl leading-tight font-extrabold tracking-tight sm:text-6xl">
            Track. <span className="text-chart-2">Discover.</span> Share.
          </h1>

          <p className="mx-auto max-w-md text-sm leading-relaxed text-muted-foreground sm:max-w-xl sm:text-base">
            The ultimate companion for your cinematic journey. Organise your
            watchlist, find your next favourite film, and see what your circle
            is watching.
          </p>

          {/* same for both — just go to home */}
          <Button
            className="cursor-pointer bg-chart-2 px-8 py-5 text-sm font-bold text-sidebar-primary-foreground hover:bg-chart-2/80"
            asChild
          >
            <Link href="/home">Go to Home →</Link>
          </Button>

          <div className="mt-4 w-full overflow-hidden rounded-2xl border border-white/10 shadow-2xl shadow-black/40">
            <Image
              src="/movie-hall.jpg"
              width={1200}
              height={600}
              alt="Movie hall"
              className="w-full object-cover"
              quality={100}
              sizes="100vw"
              priority
            />
          </div>
        </section>

        {/* features */}
        <section className="container mx-auto mb-24 px-4 sm:px-8">
          <div className="mb-10 text-center">
            <p className="text-xs font-semibold tracking-widest text-chart-2 uppercase sm:text-sm">
              Everything you need
            </p>
            <h2 className="mt-2 text-2xl font-extrabold sm:text-3xl">
              Built for movie lovers
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <Card
                key={feature.title}
                className="group border border-white/10 bg-amber-900/60 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-chart-2/40 hover:shadow-xl hover:shadow-chart-2/10"
              >
                <CardHeader className="gap-4 p-6">
                  <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-chart-2 shadow-md shadow-chart-2/30">
                    <feature.icon size={22} weight="fill" />
                  </div>
                  <div className="space-y-1.5">
                    <CardTitle className="text-base font-bold">
                      {feature.title}
                    </CardTitle>
                    <CardDescription className="text-sm leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="container mx-auto mb-28 px-4 sm:px-8">
          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-amber-900/60 px-6 py-14 text-center shadow-2xl sm:px-12 sm:py-20">
            <div className="pointer-events-none absolute top-0 left-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-chart-2/10 blur-3xl" />
            <p className="mb-3 text-xs font-semibold tracking-widest text-chart-2 uppercase sm:text-sm">
              Join the community
            </p>
            <h2 className="mb-4 text-3xl font-extrabold sm:text-4xl">
              Ready to dive in?
            </h2>
            <p className="mx-auto mb-8 max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">
              Join thousands of cinephiles today and transform how you
              experience cinema.
            </p>
            <div className="flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
              {isAuthenticated ? (
                <Button
                  className="w-full cursor-pointer bg-chart-2 px-8 py-5 text-sm font-bold text-sidebar-primary-foreground hover:bg-chart-2/80 sm:w-auto"
                  asChild
                >
                  <Link href="/home">Go to Home →</Link>
                </Button>
              ) : (
                <>
                  <SignInButton>
                    <Button
                      variant="outline"
                      className="w-full cursor-pointer border-white/20 bg-white/5 px-8 py-5 text-sm font-medium hover:bg-white/10 sm:w-auto"
                    >
                      Sign in
                    </Button>
                  </SignInButton>
                  <SignUpButton>
                    <Button className="w-full cursor-pointer bg-chart-2 px-8 py-5 text-sm font-bold text-sidebar-primary-foreground hover:bg-chart-2/80 sm:w-auto">
                      Create free account →
                    </Button>
                  </SignUpButton>
                </>
              )}
            </div>
          </div>
        </section>
      </main>

      <footer className="flex flex-col items-center gap-1 border-t border-white/10 px-4 py-6 text-center text-sm text-muted-foreground">
        <span className="font-semibold text-white">
          Watch<span className="text-chart-2">logger</span>
        </span>
        <span>Made with ❤️ by Supratik</span>
      </footer>
    </div>
  )
}
