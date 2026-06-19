import Link from "next/link";
import { Button, Card, CardContent, CardHeader, CardTitle } from "@archana/ui";
import { WEBSITE_ROUTES } from "@archana/constants";
import { HealthBadge } from "@/components/health-badge";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <header className="border-b border-brand-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Link href={WEBSITE_ROUTES.HOME} className="text-xl font-bold text-brand-800">
            Archana Sweets
          </Link>
          <nav className="flex items-center gap-4">
            <Link href={WEBSITE_ROUTES.SHOP} className="text-sm text-brand-700 hover:text-brand-900">
              Shop
            </Link>
            <Link href={WEBSITE_ROUTES.CART} className="text-sm text-brand-700 hover:text-brand-900">
              Cart
            </Link>
            <Link href={WEBSITE_ROUTES.LOGIN}>
              <Button size="sm">Sign In</Button>
            </Link>
          </nav>
        </div>
      </header>

      <main>
        <section className="mx-auto max-w-6xl px-4 py-20 text-center">
          <p className="mb-4 text-sm font-medium uppercase tracking-widest text-brand-600">
            Since 1985
          </p>
          <h1 className="mb-6 text-5xl font-bold tracking-tight text-brand-900">
            Premium Indian Sweets
            <br />
            <span className="text-brand-600">Delivered Fresh</span>
          </h1>
          <p className="mx-auto mb-8 max-w-xl text-lg text-brand-700">
            Handcrafted with love using traditional recipes. Order online for
            doorstep delivery across India.
          </p>
          <div className="flex justify-center gap-4">
            <Link href={WEBSITE_ROUTES.SHOP}>
              <Button size="lg">Browse Sweets</Button>
            </Link>
            <Link href={WEBSITE_ROUTES.TRACK_ORDER}>
              <Button size="lg" variant="outline">Track Order</Button>
            </Link>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 pb-20">
          <Card>
            <CardHeader>
              <CardTitle>Platform Status</CardTitle>
            </CardHeader>
            <CardContent>
              <HealthBadge />
            </CardContent>
          </Card>
        </section>
      </main>

      <footer className="border-t border-brand-200 py-8 text-center text-sm text-brand-600">
        © {new Date().getFullYear()} Archana Sweets Pvt. Ltd.
      </footer>
    </div>
  );
}
