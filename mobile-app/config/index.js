import { ApolloClient, InMemoryCache } from '@apollo/client';

const client = new ApolloClient({
  // Apollo Server Location
  uri: 'https://news-api.sutarlan.site/',
  // Auto caching from Apollo
  cache: new InMemoryCache(),
});

// export it
export default client;
