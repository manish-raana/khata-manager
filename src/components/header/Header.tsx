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
    <div className="border-b py-4 pb-10 md:p-0">
      <div className="md:flex h-16 items-center justify-between px-2 md:px-4">
        <div className="flex items-center justify-between">
          <StoreSwitcher storeData={storeData ? storeData : []} />
          <div className="md:hidden flex items-center space-x-6 pr-4">
            <ThemeModeToggle />
            <UserNav />
          </div>
        </div>
        <MainNav className="mx-6 mt-5 md:mt-0" />
        <div className="ml-auto hidden md:flex items-center justify-center space-x-4">
          {/*  <Search /> */}
          <ThemeModeToggle />
          <UserNav />
        </div>
      </div>
    </div>
  )
}

export default Header
