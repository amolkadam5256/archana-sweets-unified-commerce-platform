import { Card, CardContent, CardHeader, CardTitle } from "@archana/ui";

export default function DashboardPage() {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-slate-900">Overview</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Orders Today", value: "—" },
          { label: "Revenue Today", value: "—" },
          { label: "Active Products", value: "—" },
          { label: "Pending Orders", value: "—" },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-slate-500">
                {stat.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <p className="mt-8 text-sm text-slate-500">
        KPIs populate in Phase 1.6 when orders and products are live.
      </p>
    </div>
  );
}
