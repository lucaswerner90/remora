const express = require('express');
const app = express();

const expressGraphQL = require('express-graphql');
const { buildSchema } = require('graphql');

const PORT: number = parseInt(process.env.PORT) || 7000;

// GrapqhQL Schema
const schema = buildSchema(`
  type Query {
    welcomeMessage: String
    course(id:Int!): Course
    courses: [Course]
  }

  type Course {
    id: Int
    title: String
    author: String
    description: String
    topic: String
    url: String
  }

`);

const coursesData = [
  {
    id: 1,
    title: 'Some title...',
    author: 'Lucas Werner',
    topic: 'graphql',
    url: 'http://www.google.com',
  },
];

const getCourse = (args) => {
  const id = args.id;
  return coursesData.filter(course => course.id === id)[0];
};

const getAllCourses = () => {
  return coursesData;
};

const root = {
  welcomeMessage: () => 'Hello World from GraphQL server!',
  course: getCourse,
  courses: getAllCourses,
};

// GraphQL endpoint
app.use('/', expressGraphQL({
  schema,
  rootValue: root,
  graphiql: true,
}));

app.listen(PORT, () => {
  console.log('GraphQL is listening...open the GraphIQL tool by opening your browser at localhost:7000/');
});
