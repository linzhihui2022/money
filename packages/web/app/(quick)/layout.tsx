import "../globals.css";
import { Auth } from "@/features/auth";
import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";

export default function QuickLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Auth>
      <main className="w-full flex flex-row">
        <div className="flex flex-col min-h-dvh no-scrollbar space-y-3 px-3 @container w-full max-w-screen-sm mx-auto">
          <Header />
          <div className="flex-1">{children}</div>
          <Footer />
        </div>
      </main>
    </Auth>
  );
}
