import { gql, makeExecutableSchema } from "apollo-server";
import { ApolloServer } from "apollo-server-express";
import { shield } from "graphql-shield";
import { applyMiddleware } from "graphql-middleware";
import gc from "gc-stats";
import express from "express";
import { generateMovies } from "./data";

// Configure how stuff runs
/**
 * How often we should report garbage collection stats
 */
const REPORT_EVERY = 20;
/**
 * Apply the Shield middleware
 */
const USING_SHIELD = true;
/**
 * Number of movies to generate
 */
const NUM_MOVIES = 100;
/**
 * How long to delay before returning a response
 */
const DEFAULT_DELAY = 5;

const MOVIES = generateMovies(NUM_MOVIES);

const app = express();
let collectionStats: Array<any> = [];

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
  return new Promise<any>(resolve => {
    const milliseconds = seconds * 1000;
    setTimeout(() => {
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

app.listen({ port: 4000 }, () => {
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
  console.log((USING_SHIELD ? "Using" : "WITHOUT") + " Shield");
});

var stopProfiling = (profileId: String) => {
  let profile = v8Profiler.stopProfiling(profileId);
  let filename = __dirname + "/../profiles/" + profileId + ".cpuprofile";
  console.log("Writing profile file to ", filename);
  fs.writeFile(filename, JSON.stringify(profile), () =>
    console.log("Profiler data written")
  );
};

app.get("/start-profiling/id/:profileId/duration/:durationInSec", function(
  req,
  res
) {
  let profileId = req.params["profileId"];
  let durationInMilliSec = req.params["durationInSec"] * 1000;
  // Start profiling
  console.log("Starting profiler");
  v8Profiler.startProfiling(profileId);
  setTimeout(function() {
    stopProfiling(profileId);
  }, durationInMilliSec);
  res.json({});
});
