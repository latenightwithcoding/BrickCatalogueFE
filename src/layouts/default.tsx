import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div data-lenis className="lenis-wrapper min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 w-full pb-12">
        {children}
      </main>
      <Footer />
    </div>
  );
}
