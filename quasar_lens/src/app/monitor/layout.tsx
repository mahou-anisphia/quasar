import { Header } from "~/app/_components/header";
import { Footer } from "~/app/_components/footer";

export default function MonitorLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen flex-col" style={{ background: "var(--q-bg)" }}>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
