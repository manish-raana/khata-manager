import React from 'react'
import TeamSwitcher from './dashboard/team-switcher';
import { MainNav } from './dashboard/main-nav';
import { Search } from './dashboard/search';
import { ThemeModeToggle } from './theme/Toggle';
import { UserNav } from './dashboard/user-nav';

const Header = () => {
  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-4">
        <TeamSwitcher />
        <MainNav className="mx-6" />
        <div className="ml-auto flex items-center space-x-4">
          <Search />
          <ThemeModeToggle />
          <UserNav />
        </div>
      </div>
    </div>
  );
}

export default Header