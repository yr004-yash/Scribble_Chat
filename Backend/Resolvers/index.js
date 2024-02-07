import usersResolver from "./usersResolver.js";

const resolvers = {
    Query: {
        ...usersResolver.Query,
    },
    Mutation: {
        ...usersResolver.Mutation,
    },
}

export default resolvers;
