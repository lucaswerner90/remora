
export const resolvers = {
  Query: {
    info: () => 'This is the GraphQL API of REMORA',
    feed: (root, args, context, info) => {
      return context.prisma.users();
    },
  },
  Mutation: {
    post: (root, { name, email, password }, context) => {
      return context.prisma.createUser({
        name,
        email,
        password,
      });
    },
  },
};
