import * as React from 'react';
import DefaultLayout from '../layouts/DefaultLayout';
import Seo from '../components/Seo';

const IndexPage: React.FC = () => {
  return (
    <DefaultLayout>
      <Seo title="My WordPress Blog" />
      <h1 className="text-3xl font-bold my-4">My WordPress Blog</h1>
    </DefaultLayout>
  );
};

export default IndexPage;
