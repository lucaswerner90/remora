const { GraphQLServer } = require('graphql-yoga');
const { typeDefs } = require('./schema/schema.graphql');
const { resolvers } = require('./resolvers/resolvers.graphql');
const { prisma } = require('../config/generated/prisma');

// 3
const server = new GraphQLServer({
  resolvers,
  typeDefs,
  context: { prisma },
});
server.start(() => console.log('Server is running on http://localhost:4000'));
