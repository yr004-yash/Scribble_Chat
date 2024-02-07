import { ApolloClient, InMemoryCache, gql } from '@apollo/client';

export const client = new ApolloClient({
  // uri: `http://localhost:${process.env.PORT}/graphql`,
  uri: `${import.meta.env.VITE_BACKEND_URL}/graphql`,
  cache: new InMemoryCache(),
});

