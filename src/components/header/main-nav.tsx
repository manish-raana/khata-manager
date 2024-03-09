'use client'
import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
const activeClass = "text-black font-bold rounded-lg";

export function MainNav({ className, ...props }: React.HTMLAttributes<HTMLElement>) {
  const pathname = usePathname();
  return (
    <nav className={cn("flex items-center space-x-4 lg:space-x-6", className)} {...props}>
      <Link href="/" className={cn("text-sm font-medium text-muted-foreground transition-colors px-3 py-2", pathname === "/" && activeClass)}>
        Overview
      </Link>
      <Link
        href="/customers"
        className={cn("text-sm font-medium text-muted-foreground transition-colors px-3 py-2", pathname === "/customers" && activeClass)}
      >
        Customers
      </Link>
      <Link
        href="/suppliers"
        className={cn("text-sm font-medium text-muted-foreground transition-colors px-3 py-2", pathname === "/suppliers" && activeClass)}
      >
        Suppliers
      </Link>
      <Link
        href="/employees"
        className={cn("text-sm font-medium text-muted-foreground transition-colors px-3 py-2", pathname === "/employees" && activeClass)}
      >
        Employees
      </Link>
    </nav>
  );
}
