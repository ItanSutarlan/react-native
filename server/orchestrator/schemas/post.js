const axios = require('axios');
const { GraphQLError } = require('graphql');

const CacheService = require('../services/redis/cacheService');
const userBaseUrl = process.env.USER_BASE_URL;

const typeDefs = `#graphql
  type Tag {
    id: ID!
    name: String
    postId: ID!
  }

  type Author {
   id: ID!
   username: String
   email: String
   role: String
   phoneNumber: String
   address: String
  }

  type Category {
    id: ID!
    name: String!
  }

  type Post {
    id: ID!
    title: String
    slug: String
    content: String
    imgUrl: String
    categoryId: Int
    authorId: String
    createdAt: String
    updatedAt: String
    category: Category
    tags: [Tag]
    author: Author
  }

  type FindAllPosts {
    statusCode: Int
    data: [Post]
  }

  type FindPost {
    statusCode: Int
    data: Post
  }

  type Success {
    statusCode: Int
    message: String
  }

  type Query {  
    findAllPosts(category: Int): FindAllPosts
    findPostBySlug(slug: String!): FindPost
  }

  type Mutation {
    createPost(title: String!, content: String!, imgUrl: String!, categoryId: Int!, authorId: String!, tags: [String]): Success
    updatePost(id: ID!, title: String!, content: String!, imgUrl: String!, categoryId: Int!, authorId: String!, tags: [String]): Success
    deletePost(id: Int!): Success
  }
`;

const cacheService = new CacheService();

const appBaseUrl = process.env.APP_BASE_URL;

// Define Resolver
const resolvers = {
  Query: {
    findAllPosts: async (_, { category }) => {
      try {
        let cachedPosts = await cacheService.get('postResponse');

        if (cachedPosts) {
          cachedPosts = JSON.parse(cachedPosts);
        }

        if (!cachedPosts || category) {
          const url = `${appBaseUrl}/public/posts${
            category ? `?category=${category}` : ''
          }`;

          const { data } = await axios.get(url);

          const { data: posts } = data;

          const {
            data: { data: users },
          } = await axios.get(`${userBaseUrl}/users`);

          const mappedPosts = posts.map((post) => mapToModel(post, users));

          const cachePosts = { statusCode: data.statusCode, data: mappedPosts };
          if (!category) {
            await cacheService.set('postResponse', JSON.stringify(cachePosts));
          }
          cachedPosts = cachePosts;
        }

        return cachedPosts;
      } catch ({ response: { data } }) {
        throw new GraphQLError(data.message, {
          extensions: {
            code: 'INVARIANT_ERROR',
            http: {
              status: data.statusCode,
            },
          },
        });
      }
    },
    findPostBySlug: async (_, { slug }) => {
      try {
        const { data } = await axios.get(`${appBaseUrl}/public/posts/${slug}`);

        const { data: post } = data;

        const {
          data: { data: author },
        } = await axios.get(`${userBaseUrl}/users/${post.authorId}`);

        post.author = author;

        const response = { statusCode: data.statusCode, data: post };
        return response;
      } catch ({ response: { data } }) {
        throw new GraphQLError(data.message, {
          extensions: {
            code: 'INVARIANT_ERROR',
            http: {
              status: data.statusCode,
            },
          },
        });
      }
    },
  },
  Mutation: {
    createPost: async (
      _,
      { title, content, imgUrl, categoryId, authorId, tags },
    ) => {
      try {
        const { data } = await axios.post(`${appBaseUrl}/posts`, {
          title,
          content,
          imgUrl,
          categoryId,
          authorId,
          tags,
        });

        await cacheService.delete('postResponse');

        return data;
      } catch ({ response }) {
        const { data } = response;
        throw new GraphQLError(data.message, {
          extensions: {
            code: 'INVARIANT_ERROR',
            http: {
              status: response.status,
            },
          },
        });
      }
    },
    updatePost: async (
      _,
      { id, title, content, imgUrl, categoryId, authorId, tags },
    ) => {
      try {
        const { data } = await axios.put(`${appBaseUrl}/posts/${id}`, {
          title,
          content,
          imgUrl,
          categoryId,
          authorId,
          tags,
        });

        await cacheService.delete('postResponse');

        return data;
      } catch ({ response }) {
        const { data } = response;
        throw new GraphQLError(data.message, {
          extensions: {
            code: 'INVARIANT_ERROR',
            http: {
              status: response.status,
            },
          },
        });
      }
    },
    deletePost: async (_, { id }) => {
      try {
        const { data } = await axios.delete(`${appBaseUrl}/posts/${id}`);

        await cacheService.delete('postResponse');
        return data;
      } catch ({ response }) {
        const { data } = response;
        throw new GraphQLError(data.message, {
          extensions: {
            code: 'INVARIANT_ERROR',
            http: {
              status: response.status,
            },
          },
        });
      }
    },
  },
};

function mapToModel(post, users) {
  return {
    ...post,
    author: users.find((user) => user.id === post.authorId),
  };
}

module.exports = {
  typeDefs,
  resolvers,
};
