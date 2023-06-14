require('dotenv').config();

const { ApolloServer } = require('@apollo/server');
const { startStandaloneServer } = require('@apollo/server/standalone');
const { ApolloServerErrorCode } = '@apollo/server/errors';

const {
  typeDefs: userTypeDefs,
  resolvers: userResolvers,
} = require('./schemas/user');

const {
  typeDefs: postTypeDefs,
  resolvers: postResolvers,
} = require('./schemas/post');

(async () => {
  const server = new ApolloServer({
    typeDefs: [userTypeDefs, postTypeDefs],
    // sama seperti typeDefs, resolvers juga bisa menerima array
    resolvers: [userResolvers, postResolvers],
    // Ini supaya kita tetap bisa membuka explorer sekalipun di production
    introspection: true,
    formatError: (formattedError, error) => {
      // Return a different error message
      if (
        formattedError.extensions.code === 'INVARIANT_ERROR' ||
        formattedError.extensions.code ===
          ApolloServerErrorCode.BAD_USER_INPUT ||
        formattedError.extensions.code ===
          ApolloServerErrorCode.GRAPHQL_VALIDATION_FAILED
      ) {
        return {
          message: formattedError.message,
        };
      }
      console.error(formattedError);
    },
  });

  const { url } = await startStandaloneServer(server, {
    listen: { port: process.env.PORT || 4000 },
  });

  console.log(`🚀  Server ready at: ${url}`);
})();
