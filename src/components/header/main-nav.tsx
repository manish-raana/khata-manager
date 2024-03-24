'use client'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { usePathname } from 'next/navigation'
const activeClass =
  'dark:text-black text-white font-bold bg-black dark:bg-white'

const menuList = [
  { name: 'Overview', href: '/' },
  { name: 'Customers', href: '/customers' },
  { name: 'Suppliers', href: '/suppliers' },
  { name: 'Employees', href: '/employees' },
]

export function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const pathname = usePathname()
  return (
    <nav
      className={cn('flex items-center space-x-4 lg:space-x-6', className)}
      {...props}
    >
      {menuList.map((menu) => (
        <Link
          key={menu.href}
          href={menu.href}
          className={cn(
            'text-xs md:text-sm font-medium text-muted-foreground transition-colors px-2 md:px-3 py-2 rounded-lg',
            pathname === menu.href && activeClass
          )}
        >
          {menu.name}
        </Link>
      ))}
    </nav>
  )
}
