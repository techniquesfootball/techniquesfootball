import Navbar from "@/components/ui/navbar";

const menus = [
  { title: "Home", path: "/first-website" },
  { title: "Contact us", path: "/contact" },
  { title: "About us", path: "/about" },
  { title: "Match rules", path: "/rules" },
  { title: "Our locations", path: "/locations" },
  { title: "Jobs", path: "/jobs" },
];

export default function Page({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar menus={menus} logoText="Techniques football" />
      <main className="relative flex flex-grow">{children}</main>
    </div>
  );
}
