import { ModeToggle } from "@/components/theme-toggle";
import { LocaleToggle } from "@/components/locale-toggle";

export default async function Layout() {
  return (
    <div className="relative flex w-full flex-col min-h-dvh">
      <header className="border-x px-10 border-dashed py-3 flex justify-between items-center container">
        <div></div>
        <div className="flex items-center gap-2">
          <LocaleToggle />
          <ModeToggle />
        </div>
      </header>
      <div className="h-px w-full border-t border-dashed"></div>
      <main className="container border-x px-10 py-5 border-dashed flex-1"></main>
      <div className="h-px w-full border-t border-dashed"></div>
      <footer className="container border-x px-10 py-5 border-dashed text-xs">
        Lychee!
      </footer>
    </div>
  );
}
