import * as path from 'path';
import type { CreatePagesArgs, GatsbyNode } from 'gatsby';
import chunk from 'lodash/chunk';
import { APP_ROUTE } from './src/constants/route';

type TPost = {
  previous: {
    id: string;
  };
  post: {
    id: string;
    uri: string;
  };
  next: {
    id: string;
  };
};

type TAllWpPost = {
  allWpPost: {
    edges: TPost[];
  };
};

export const createPages: GatsbyNode['createPages'] = async (
  gatsbyUtilities
) => {
  const posts = await getPosts(gatsbyUtilities);

  if (!posts?.length) {
    return;
  }

  await createIndividualBlogPostPages({ posts, gatsbyUtilities });

  await createBlogPostArchive({ posts, gatsbyUtilities });
};

/**
 * This function creates all the individual blog pages in this site
 */
const createIndividualBlogPostPages = async ({
  posts,
  gatsbyUtilities,
}: {
  posts: TPost[];
  gatsbyUtilities: CreatePagesArgs;
}) =>
  Promise.all(
    posts.map(({ previous, post, next }: any) =>
      gatsbyUtilities.actions.createPage({
        path: post.uri,
        component: path.resolve(`./src/templates/BlogPost.tsx`),
        context: {
          id: post.id,
          previousPostId: previous ? previous.id : null,
          nextPostId: next ? next.id : null,
        },
      })
    )
  );

type TReadingSettings = {
  wp: {
    readingSettings: {
      postsPerPage: number;
    };
  };
};

/**
 * This function creates all the individual blog pages in this site
 */
const createBlogPostArchive = async ({
  posts,
  gatsbyUtilities,
}: {
  posts: TPost[];
  gatsbyUtilities: CreatePagesArgs;
}) => {
  const graphqlResult = await gatsbyUtilities.graphql<TReadingSettings>(
    /* GraphQL */ `
      query WpSetting {
        wp {
          readingSettings {
            postsPerPage
          }
        }
      }
    `
  );

  const postsPerPage = graphqlResult.data?.wp.readingSettings.postsPerPage ?? 1;

  const postsChunkedIntoArchivePages = chunk(posts, postsPerPage);
  const totalPages = postsChunkedIntoArchivePages.length;

  return Promise.all(
    postsChunkedIntoArchivePages.map(async (_posts: any, index: number) => {
      const pageNumber = index + 1;

      const getPagePath = (page: number) => {
        if (page > 0 && page <= totalPages) {
          return page === 1 ? APP_ROUTE.BLOGS : `/${APP_ROUTE.BLOGS}/${page}`;
        }

        return '';
      };

      gatsbyUtilities.actions.createPage({
        path: getPagePath(pageNumber),
        component: path.resolve(`./src/templates/BlogPostArchive.tsx`),
        context: {
          offset: index * postsPerPage,
          postsPerPage,
          nextPagePath: getPagePath(pageNumber + 1),
          previousPagePath: getPagePath(pageNumber - 1),
        },
      });
    })
  );
};

const getPosts = async ({ graphql, reporter }: CreatePagesArgs) => {
  const graphqlResult = await graphql<TAllWpPost>(/* GraphQL */ `
    query WpPosts {
      # Query all WordPress blog posts sorted by date
      allWpPost {
        edges {
          previous {
            id
          }

          # note: this is a GraphQL alias. It renames "node" to "post" for this query
          # We're doing this because this "node" is a post! It makes our code more readable further down the line.
          post: node {
            id
            uri
          }

          next {
            id
          }
        }
      }
    }
  `);

  if (graphqlResult.errors) {
    reporter.panicOnBuild(
      `There was an error loading your blog posts`,
      graphqlResult.errors
    );
    return;
  }

  return graphqlResult.data?.allWpPost.edges;
};
