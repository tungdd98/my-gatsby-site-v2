import { Link, PageProps, graphql } from 'gatsby';
import React, { FC } from 'react';
import DefaultLayout from '../layouts/DefaultLayout';
import Seo from '../components/Seo';
import parse from 'html-react-parser';
import { TPost } from '../types/post.type';
import PostItem from '../components/BlogPost/PostItem';

type DataProps = {
  allWpPost: {
    nodes: TPost[];
  };
};

type PageContextType = {
  nextPagePath: string;
  previousPagePath: string;
};

const BlogPostArchive: FC<PageProps<DataProps, PageContextType>> = ({
  data,
  pageContext: { previousPagePath, nextPagePath },
}) => {
  const posts = data.allWpPost.nodes;

  if (!posts.length) {
    return (
      <DefaultLayout>
        <Seo title="All posts" />
        <p>
          No blog posts found. Add posts to your WordPress site and they'll
          appear here!
        </p>
      </DefaultLayout>
    );
  }

  return (
    <DefaultLayout>
      <Seo title="All posts" />

      {posts.map((post) => (
        <PostItem key={post.uri} data={post} />
      ))}

      {previousPagePath && (
        <>
          <Link to={previousPagePath}>Previous page</Link>
          <br />
        </>
      )}
      {nextPagePath && <Link to={nextPagePath}>Next page</Link>}
    </DefaultLayout>
  );
};

export default BlogPostArchive;

export const pageQuery = graphql`
  query WordPressPostArchive($offset: Int!, $postsPerPage: Int!) {
    allWpPost(
      sort: { fields: [date], order: DESC }
      limit: $postsPerPage
      skip: $offset
    ) {
      nodes {
        excerpt
        uri
        date(formatString: "MMMM DD, YYYY")
        title
      }
    }
  }
`;
