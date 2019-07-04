import { gql, makeExecutableSchema } from "apollo-server";
import { ApolloServer } from "apollo-server-express";
import { shield } from "graphql-shield";
import { applyMiddleware } from "graphql-middleware";
import gc from "gc-stats";
import express from "express";
import { MOVIES, getRandomString } from "./data";

const app = express();
let collectionStats: Array<any> = [];

const REPORT_EVERY = 20;
const USING_SHIELD = true;

const getMinMaxAndAvg = (
  stats: Array<any>,
  func: (stat: any) => number
): any => {
  const numCollections = stats.length;
  const min = Math.min(...stats.map(func));
  const max = Math.max(...stats.map(func));
  const avg = Math.round(
    stats.map(func).reduce((a, b) => a + b, 0) / numCollections
  );
  return {
    min,
    max,
    avg
  };
};

const reportStats = (stats: Array<any>) => {
  const numCollections = stats.length;
  const pauseTime = getMinMaxAndAvg(stats, stat => stat.pauseMS);
  const heapDiff = getMinMaxAndAvg(stats, stat =>
    Math.round(stat.diff.totalHeapSize / 1000000)
  );
  console.log(
    `Collections: ${numCollections} ${pauseTime.min}ms ${pauseTime.avg}ms ${
      pauseTime.max
    }ms ${heapDiff.min}MB ${heapDiff.avg}MB ${heapDiff.max}MB`
  );
};

gc().on("stats", function(stats: any) {
  collectionStats.push(stats);
  const numCollections = collectionStats.length;
  if (numCollections % REPORT_EVERY === 0) {
    reportStats(collectionStats);
  }
});

const delayAndReturn = async (
  value: any,
  seconds: number = 5
): Promise<any> => {
  //   console.log("🕓 Delaying request for ", seconds, "s");
  return new Promise<any>(resolve => {
    const milliseconds = seconds * 1000;
    setTimeout(() => {
      //   console.log("✅  Resolved\n");
      resolve(value);
    }, milliseconds);
  });
};

const typeDefs = gql`
  type Movie {
    title: String
    year: Int
    rating: Int
    producer: String
    star: String
    city: String
    country: String
    media_house: String
  }

  type Query {
    movies: [Movie]
  }
`;

const resolvers = {
  Query: {
    movies: async () => {
      const result = await delayAndReturn(MOVIES, 10);
      return result;
    }
  }
};

const RULES = {};

const schema = makeExecutableSchema({ typeDefs, resolvers });
const shieldMiddleware = shield(RULES);
const middlewares = [shieldMiddleware];
const schemaWithMiddleware = USING_SHIELD
  ? applyMiddleware(schema, ...middlewares)
  : applyMiddleware(schema);
const server = new ApolloServer({ schema: schemaWithMiddleware });
server.applyMiddleware({ app });

console.log("movies = ", MOVIES);
console.log(typeof getRandomString);

app.listen({ port: 4000 }, () => {
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
  console.log((USING_SHIELD ? "Using" : "WITHOUT") + " Shield");
});
