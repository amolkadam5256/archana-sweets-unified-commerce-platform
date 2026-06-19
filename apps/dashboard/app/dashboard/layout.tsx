import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@archana/ui";
import { DASHBOARD_ROUTES } from "@archana/constants";

const NAV_ITEMS = [
  { label: "Overview", href: DASHBOARD_ROUTES.HOME },
  { label: "Products", href: DASHBOARD_ROUTES.PRODUCTS },
  { label: "Orders", href: DASHBOARD_ROUTES.ORDERS },
  { label: "Users", href: DASHBOARD_ROUTES.USERS },
  { label: "Settings", href: DASHBOARD_ROUTES.SETTINGS },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <aside className="w-64 border-r border-slate-200 bg-white">
        <div className="border-b border-slate-200 p-6">
          <p className="text-xs font-medium uppercase tracking-widest text-brand-600">
            Archana Commerce
          </p>
          <p className="text-lg font-bold text-slate-900">Dashboard</p>
        </div>
        <nav className="p-4">
          <ul className="space-y-1">
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="block rounded-md px-3 py-2 text-sm text-slate-700 hover:bg-slate-100"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}

export { Card, CardContent, CardHeader, CardTitle };
