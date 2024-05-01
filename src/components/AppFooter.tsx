import React, { FC } from 'react';

const AppFooter: FC = () => {
  return (
    <footer className="bg-slate-500 text-center py-4">
      <div className="container">
        ©{new Date().getFullYear()}, Built with
        {` `}
        <a href="https://www.gatsbyjs.com">Gatsby</a>
        {` `}
        And <a href="https://wordpress.org/">WordPress</a>
      </div>
    </footer>
  );
};

export default AppFooter;
