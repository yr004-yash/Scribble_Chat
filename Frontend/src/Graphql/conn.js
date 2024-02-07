import { ApolloClient, InMemoryCache, gql } from '@apollo/client';

export const client = new ApolloClient({
  // uri: `http://localhost:${process.env.PORT}/graphql`,
  uri: `http://localhost:3000/graphql`,
  cache: new InMemoryCache(),
});

