# GraphQL Middleware Load Tests

This project was created to do some debugging on some issues we saw with GraphQL Shield under load in prod.

This is a NodeJS project, so to setup.

```bash
$ yarn install

# or
$ npm install
```

I used `vegeta` for load testing. To install it, do:

```bash
$ brew update && brew install vegeta
```

Run the GraphQL server using:

```
yarn run dev
```

Then run the load testing using `vegeta`.

```
$ vegeta attack -duration=1m -rate=350/s -targets=targets.txt
```
