import { redirect } from "next/navigation";
import { DASHBOARD_ROUTES } from "@archana/constants";

export default function RootPage() {
  redirect(DASHBOARD_ROUTES.HOME);
}
