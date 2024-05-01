import { graphql, useStaticQuery } from 'gatsby';
import React, { FC } from 'react';
import { Helmet } from 'react-helmet';

type SeoProps = {
  description?: string;
  lang?: string;
  meta?: HTMLMetaElement[];
  title: string;
};

const Seo: FC<SeoProps> = ({
  description = '',
  lang = 'en',
  title,
  meta = [],
}) => {
  const { wp, wpUser } = useStaticQuery(graphql`
    query {
      wp {
        generalSettings {
          title
          description
        }
      }

      # if there's more than one user this would need to be filtered to the main user
      wpUser {
        twitter: name
      }
    }
  `);

  const metaDescription = description || wp.generalSettings?.description;
  const defaultTitle = wp.generalSettings?.title;

  return (
    <Helmet
      htmlAttributes={{
        lang,
      }}
      title={title ?? defaultTitle}
      meta={[
        {
          name: `description`,
          content: metaDescription,
        },
        {
          property: `og:title`,
          content: title,
        },
        {
          property: `og:description`,
          content: metaDescription,
        },
        {
          property: `og:type`,
          content: `website`,
        },
        {
          name: `twitter:card`,
          content: `summary`,
        },
        {
          name: `twitter:creator`,
          content: wpUser?.twitter || ``,
        },
        {
          name: `twitter:title`,
          content: title,
        },
        {
          name: `twitter:description`,
          content: metaDescription,
        },
      ].concat(meta)}
    />
  );
};

export default Seo;
