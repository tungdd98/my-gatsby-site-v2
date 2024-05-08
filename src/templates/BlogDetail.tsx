import { Link, PageProps, graphql } from 'gatsby';
import React, { FC } from 'react';
import DefaultLayout from '../layouts/DefaultLayout';
import Seo from '../components/Seo';
import parse from 'html-react-parser';
import { GatsbyImage, IGatsbyImageData } from 'gatsby-plugin-image';

type DataProps = {
  post: {
    id: string;
    excerpt: string;
    content: string;
    title: string;
    date: string;
    featuredImage: {
      node: {
        altText: string;
        localFile: {
          childImageSharp: {
            gatsbyImageData: IGatsbyImageData;
          };
        };
      };
    };
  };
  previous: {
    uri: string;
    title: string;
  };
  next: {
    uri: string;
    title: string;
  };
};

const BlogDetail: FC<PageProps<DataProps>> = ({
  data: { post, next, previous },
}) => {
  const featuredImage = {
    data: post.featuredImage?.node?.localFile?.childImageSharp?.gatsbyImageData,
    alt: post.featuredImage?.node?.altText || ``,
  };

  return (
    <DefaultLayout>
      <Seo title={post.title} description={post.excerpt} />
      <article>
        <header className="mb-10">
          <h1 className="text-4xl font-bold mb-2">{parse(post.title)}</h1>

          <p className="text-slate-500 mb-4">{post.date}</p>

          {featuredImage?.data && (
            <GatsbyImage
              image={featuredImage.data}
              alt={featuredImage.alt}
              class="aspect-video object-cover"
            />
          )}
        </header>

        {!!post.content && (
          <section itemProp="articleBody">{parse(post.content)}</section>
        )}
      </article>

      <nav className="mt-10">
        <ul className="flex justify-between items-center">
          <li>
            {previous && (
              <Link to={previous.uri} rel="prev">
                ← {parse(previous.title)}
              </Link>
            )}
          </li>

          <li>
            {next && (
              <Link to={next.uri} rel="next">
                {parse(next.title)} →
              </Link>
            )}
          </li>
        </ul>
      </nav>
    </DefaultLayout>
  );
};

export default BlogDetail;

export const pageQuery = graphql`
  query BlogPostById(
    $id: String!
    $previousPostId: String
    $nextPostId: String
  ) {
    post: wpPost(id: { eq: $id }) {
      id
      excerpt
      content
      title
      date(formatString: "MMMM DD, YYYY")
      featuredImage {
        node {
          altText
          localFile {
            childImageSharp {
              gatsbyImageData(
                quality: 100
                placeholder: TRACED_SVG
                layout: FULL_WIDTH
              )
            }
          }
        }
      }
    }
    previous: wpPost(id: { eq: $previousPostId }) {
      uri
      title
    }
    next: wpPost(id: { eq: $nextPostId }) {
      uri
      title
    }
  }
`;
