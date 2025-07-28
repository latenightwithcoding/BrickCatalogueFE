import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div data-lenis className="min-h-screen flex flex-col overflow-x-hidden">
      <Navbar />
      <main className="flex-1 w-full max-w-full overflow-hidden">
        {children}
      </main>
      <Footer />
    </div>
  );
}
