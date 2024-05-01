import { Link } from 'gatsby';
import React, { FC } from 'react';
import { MENUS } from '../constants/header';

const AppHeader: FC = () => {
  return (
    <header className="shadow-md sticky top-0 bg-white z-20">
      <div className="container flex justify-between items-center py-2">
        <Link to="/">
          <h1 className="text-3xl">LOGO</h1>
        </Link>
        <nav className="flex">
          {MENUS.map((item) => (
            <div className="mx-7" key={item.label}>
              <span className="nav-item-header transition-header pb-3">
                <Link className="text-xl uppercase" to={item.path}>
                  {item.label}
                </Link>
              </span>
            </div>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default AppHeader;
