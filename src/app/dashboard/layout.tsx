"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  Store, 
  LayoutDashboard, 
  ShoppingBag, 
  PenTool, 
  FolderOpen, 
  CreditCard, 
  Settings, 
  LogOut 
} from "lucide-react";
import { cn } from "@/lib/utils";

const sidebarLinks = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Create Store", href: "/dashboard/create-store", icon: ShoppingBag },
  { name: "Product Generator", href: "/dashboard/product-generator", icon: PenTool },
  { name: "Projects", href: "/dashboard/projects", icon: FolderOpen },
  { name: "Pricing", href: "/pricing", icon: CreditCard },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  };

  return (
    <div className="flex min-h-screen flex-col md:flex-row bg-muted/20">
      {/* Sidebar */}
      <aside className="w-full md:w-64 border-r bg-card flex flex-col hidden md:flex">
        <div className="h-16 flex items-center px-6 border-b">
          <Link href="/dashboard" className="flex items-center gap-2 text-primary">
            <Store className="h-6 w-6" />
            <span className="font-bold tracking-tight text-lg">StoreCraft</span>
          </Link>
        </div>
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-3">
            {sidebarLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className={cn(
                      "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                      isActive 
                        ? "bg-primary text-primary-foreground" 
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {link.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="p-4 border-t">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile Header (minimal) */}
      <header className="flex md:hidden h-16 items-center justify-between px-4 border-b bg-card">
        <Link href="/dashboard" className="flex items-center gap-2 text-primary">
          <Store className="h-6 w-6" />
          <span className="font-bold tracking-tight">StoreCraft</span>
        </Link>
        <button onClick={handleLogout} className="text-sm font-medium text-muted-foreground">
          Logout
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {children}
      </main>
    </div>
  );
}
