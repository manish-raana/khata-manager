import React from 'react'
import StoreSwitcher from './store-switcher'
import { MainNav } from './main-nav'
import { ThemeModeToggle } from '../theme/Toggle'
import { UserNav } from './user-nav'
import { IStore } from '@/types/store'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

const Header = async () => {
  const supabase = createClient()
  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect('/login')
  }
  const { data: storeData, error: storeError } = await supabase
    .from('store')
    .select('*')
  if (storeError) {
    console.error(storeError)
  }
  return (
    <div className="border-b">
      <div className="hidden md:flex h-16 items-center px-4">
        <StoreSwitcher storeData={storeData ? storeData : []} />
        <MainNav className="mx-6" />
        <div className="ml-auto flex items-center space-x-4">
          {/*  <Search /> */}
          <ThemeModeToggle />
          <UserNav />
        </div>
      </div>
    </div>
  )
}

export default Header
