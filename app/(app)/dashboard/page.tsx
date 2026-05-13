import { getOrderedProgramDays } from "@/lib/content";
import { DashboardView } from "@/components/dashboard/dashboard-view";

export default function DashboardPage() {
  const days = getOrderedProgramDays();
  return <DashboardView days={days} />;
}
