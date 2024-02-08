// import { ApolloClient, InMemoryCache, gql } from '@apollo/client';

// export const client = new ApolloClient({
//   // uri: `http://localhost:${process.env.PORT}/graphql`,
//   uri: `${import.meta.env.VITE_BACKEND_URL}/graphql`,
//   cache: new InMemoryCache(),
// });

import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';

const httpLink = createHttpLink({
  uri: `${import.meta.env.VITE_BACKEND_URL}/graphql`,
  fetchOptions: {
    mode: 'no-cors',
  },
});

export const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});
