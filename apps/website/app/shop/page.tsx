import Link from "next/link";
import { WEBSITE_ROUTES } from "@archana/constants";

export default function ShopPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="mb-4 text-3xl font-bold text-brand-900">Shop</h1>
      <p className="text-brand-700">
        Product catalog coming in Phase 1.4.{" "}
        <Link href={WEBSITE_ROUTES.HOME} className="text-brand-600 underline">
          Back to home
        </Link>
      </p>
    </div>
  );
}
