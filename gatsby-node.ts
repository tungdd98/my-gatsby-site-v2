import * as path from 'path';
import type { CreatePagesArgs, GatsbyNode } from 'gatsby';
import chunk from 'lodash/chunk';
import { APP_ROUTE } from './src/constants/route';

type TPost = {
  previous: {
    id: string;
  };
  node: {
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

type TReadingSettings = {
  wp: {
    readingSettings: {
      postsPerPage: number;
    };
  };
};

export const createPages: GatsbyNode['createPages'] = async (
  gatsbyUtilities
) => {
  const blogs = await getBlogs(gatsbyUtilities);
  const comics = await getComics(gatsbyUtilities);
  const chapters = await getChapters(gatsbyUtilities);

  if (blogs?.length) {
    await createBlogDetailPages({ data: blogs, gatsbyUtilities });
    await createBlogList({ data: blogs, gatsbyUtilities });
  }

  if (comics?.length) {
    await createComicDetailPages({ data: comics, gatsbyUtilities });
    await createComicList({ data: comics, gatsbyUtilities });
  }

  if (chapters?.length) {
    await createChapterPages({ data: chapters, gatsbyUtilities });
  }
};

const createBlogDetailPages = async ({
  data,
  gatsbyUtilities,
}: {
  data: TPost[];
  gatsbyUtilities: CreatePagesArgs;
}) =>
  Promise.all(
    data.map(({ previous, node, next }: any) =>
      gatsbyUtilities.actions.createPage({
        path: node.uri,
        component: path.resolve(`./src/templates/BlogDetail.tsx`),
        context: {
          id: node.id,
          previousPostId: previous ? previous.id : null,
          nextPostId: next ? next.id : null,
        },
      })
    )
  );

const createBlogList = async ({
  data,
  gatsbyUtilities,
}: {
  data: TPost[];
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

  const postsChunkedIntoArchivePages = chunk(data, postsPerPage);
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
        component: path.resolve(`./src/templates/BlogList.tsx`),
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

const createComicDetailPages = async ({
  data,
  gatsbyUtilities,
}: {
  data: TPost[];
  gatsbyUtilities: CreatePagesArgs;
}) =>
  Promise.all(
    data.map(({ previous, node, next }: any) =>
      gatsbyUtilities.actions.createPage({
        path: node.uri,
        component: path.resolve(`./src/templates/ComicDetail.tsx`),
        context: {
          id: node.id,
          previousPostId: previous ? previous.id : null,
          nextPostId: next ? next.id : null,
        },
      })
    )
  );

const createComicList = async ({
  data,
  gatsbyUtilities,
}: {
  data: TPost[];
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

  const postsChunkedIntoArchivePages = chunk(data, postsPerPage);
  const totalPages = postsChunkedIntoArchivePages.length;

  return Promise.all(
    postsChunkedIntoArchivePages.map(async (_posts: any, index: number) => {
      const pageNumber = index + 1;

      const getPagePath = (page: number) => {
        if (page > 0 && page <= totalPages) {
          return page === 1 ? APP_ROUTE.COMICS : `/${APP_ROUTE.COMICS}/${page}`;
        }

        return '';
      };

      gatsbyUtilities.actions.createPage({
        path: getPagePath(pageNumber),
        component: path.resolve(`./src/templates/ComicList.tsx`),
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

const createChapterPages = async ({
  data,
  gatsbyUtilities,
}: {
  data: TPost[];
  gatsbyUtilities: CreatePagesArgs;
}) =>
  Promise.all(
    data.map(({ previous, node, next }: any) =>
      gatsbyUtilities.actions.createPage({
        path: node.uri,
        component: path.resolve(`./src/templates/Chapter.tsx`),
        context: {
          id: node.id,
          previousPostId: previous ? previous.id : null,
          nextPostId: next ? next.id : null,
        },
      })
    )
  );

const getBlogs = async ({ graphql, reporter }: CreatePagesArgs) => {
  const graphqlResult = await graphql<TAllWpPost>(/* GraphQL */ `
    query WpBlogs {
      allWpPost(
        filter: {
          categories: { nodes: { elemMatch: { name: { eq: "blogs" } } } }
        }
      ) {
        edges {
          previous {
            id
          }
          node {
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

const getComics = async ({ graphql, reporter }: CreatePagesArgs) => {
  const graphqlResult = await graphql<TAllWpPost>(/* GraphQL */ `
    query WpComics {
      allWpPost(
        filter: {
          categories: { nodes: { elemMatch: { name: { eq: "comics" } } } }
        }
      ) {
        edges {
          previous {
            id
          }
          node {
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

const getChapters = async ({ graphql, reporter }: CreatePagesArgs) => {
  const graphqlResult = await graphql<TAllWpPost>(/* GraphQL */ `
    query WpChapters {
      allWpPost(
        filter: {
          categories: { nodes: { elemMatch: { name: { eq: "comic-detail" } } } }
        }
      ) {
        edges {
          previous {
            id
          }
          node {
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
