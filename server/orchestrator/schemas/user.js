const axios = require('axios');
const { GraphQLError } = require('graphql');

const CacheService = require('../services/redis/cacheService');
const userBaseUrl = process.env.USER_BASE_URL;

const typeDefs = `#graphql
  type User {
    id: ID!
    username: String!
    email: String!
    role: String
    phoneNumber: String
    address: String
  }

  type FindAllUsers {
    statusCode: Int
    data: [User]
  }

  type FindUser {
    statusCode: Int
    data: User
  }

  type Success {
    statusCode: Int
    message: String
  }

  type Query {  
    findAllUsers: FindAllUsers
    findUserById(id: String!): FindUser
  }

  type Mutation {
    createUser(username: String!, email: String!, password: String!, phoneNumber: String, address: String): Success
    deleteUser(id: String!): Success
  }
`;

const cacheService = new CacheService();

// Define Resolver
const resolvers = {
  Query: {
    findAllUsers: async () => {
      try {
        let response = JSON.parse(await cacheService.get('userResponse'));

        if (!response) {
          const { data } = await axios.get(`${userBaseUrl}/users`);
          await cacheService.set('userResponse', JSON.stringify(data));
          response = data;
        }
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
    findUserById: async (_, { id }) => {
      try {
        const { data } = await axios.get(`${userBaseUrl}/users/${id}`);
        return data;
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
    createUser: async (
      _,
      { username, email, password, phoneNumber, address },
    ) => {
      try {
        const { data } = await axios.post(`${userBaseUrl}/users`, {
          username,
          email,
          password,
          phoneNumber,
          address,
        });

        await cacheService.delete('userResponse');

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
    deleteUser: async (_, { id }) => {
      try {
        const { data } = await axios.delete(`${userBaseUrl}/users/${id}`);

        await cacheService.delete('userResponse');

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

module.exports = {
  typeDefs,
  resolvers,
};
