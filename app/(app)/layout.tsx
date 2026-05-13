import { BottomNav } from "@/components/layout/bottom-nav";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-full flex-col">
      <main className="mx-auto w-full max-w-[480px] flex-1 px-6 pb-28 pt-6 md:max-w-[560px] md:pt-8">
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
