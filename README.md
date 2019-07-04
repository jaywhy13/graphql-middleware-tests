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

# Test Results

## Using Shield

I tried running `vegeta attack -duration=1m -rate=350/s -targets=targets.txt`. 2 out of the 3 times, it ended up running out of memory.

The resolver uses a promise that delays `5s` and returns `100` movies. It reports on GC stats every `100` collections.

### 1 / 3

```bash
Using Shield
Garbage Collection No. | Collection Time Min Avg Max | Heap Size Diff Min Avg Max
Collections: 100 0ms 4ms 11ms -56MB 2MB 11MB
Collections: 200 0ms 4ms 12ms -56MB 1MB 11MB
Collections: 300 0ms 4ms 12ms -56MB 1MB 11MB
Collections: 400 0ms 4ms 12ms -56MB 1MB 11MB
Collections: 500 0ms 4ms 13ms -140MB 1MB 12MB
Collections: 600 0ms 5ms 13ms -140MB 1MB 12MB
Collections: 700 0ms 5ms 13ms -252MB 0MB 12MB
Collections: 800 0ms 5ms 13ms -252MB 0MB 12MB
Collections: 900 0ms 5ms 14ms -317MB 0MB 12MB
Collections: 1000 0ms 5ms 14ms -317MB 1MB 12MB
Collections: 1100 0ms 5ms 14ms -346MB 0MB 12MB
Collections: 1200 0ms 5ms 14ms -462MB 0MB 12MB
Collections: 1300 0ms 5ms 14ms -462MB 0MB 12MB
Collections: 1400 0ms 6ms 14ms -462MB 0MB 12MB
Collections: 1500 0ms 6ms 14ms -462MB 0MB 15MB
Collections: 1600 0ms 6ms 23ms -462MB 0MB 15MB
Collections: 1700 0ms 6ms 23ms -465MB 0MB 15MB
Collections: 1800 0ms 6ms 668ms -465MB 1MB 15MB
Collections: 1900 0ms 6ms 668ms -465MB 1MB 15MB
Collections: 2000 0ms 7ms 668ms -782MB 0MB 15MB
Collections: 2100 0ms 7ms 668ms -782MB 0MB 20MB
Collections: 2200 0ms 7ms 668ms -1068MB 0MB 20MB
Collections: 2300 0ms 7ms 668ms -1068MB 0MB 20MB
```

### 2 / 3

```bash
Using Shield
Garbage Collection No. | Collection Time Min Avg Max | Heap Size Diff Min Avg Max
Collections: 100 0ms 3ms 8ms -10MB 2MB 9MB
Collections: 200 0ms 3ms 8ms -10MB 1MB 9MB
Collections: 300 0ms 2ms 8ms -10MB 1MB 9MB
Collections: 400 0ms 3ms 12ms -10MB 1MB 12MB
Collections: 500 0ms 3ms 12ms -44MB 1MB 12MB
Collections: 600 0ms 3ms 12ms -44MB 0MB 12MB
Collections: 700 0ms 3ms 12ms -44MB 0MB 12MB
Collections: 800 0ms 3ms 12ms -139MB 0MB 12MB
Collections: 900 0ms 3ms 12ms -139MB 0MB 12MB
Collections: 1000 0ms 3ms 12ms -139MB 0MB 12MB
Collections: 1100 0ms 4ms 12ms -139MB 0MB 12MB
Collections: 1200 0ms 4ms 12ms -165MB 0MB 12MB
Collections: 1300 0ms 4ms 12ms -229MB 0MB 12MB
Collections: 1400 0ms 4ms 16ms -375MB 0MB 12MB
Collections: 1500 0ms 4ms 16ms -375MB 0MB 14MB
Collections: 1600 0ms 5ms 16ms -579MB 0MB 14MB
Collections: 1700 0ms 5ms 16ms -579MB 0MB 14MB

<--- Last few GCs --->

[96170:0x102654000]    86785 ms: Mark-sweep 1388.7 (1428.0) -> 1388.7 (1431.0) MB, 812.3 / 0.9 ms  (average mu = 0.080, current mu = 0.006) allocation failure scavenge might not succeed
[96170:0x102654000]    87944 ms: Mark-sweep 1391.5 (1431.0) -> 1391.6 (1433.5) MB, 1154.4 / 1.0 ms  (average mu = 0.037, current mu = 0.004) allocation failure scavenge might not succeed


<--- JS stacktrace --->

==== JS stack trace =========================================

    0: ExitFrame [pc: 0x3b95b19dbe3d]
    1: StubFrame [pc: 0x3b95b199f3c7]
    2: StubFrame [pc: 0x3b95b19c0355]
    3: StubFrame [pc: 0x3b95b199f8ec]
    4: EntryFrame [pc: 0x3b95b1984ba1]

==== Details ================================================
[0]: ExitFrame [pc: 0x3b95b19dbe3d]
[1]: StubFrame [pc: 0x3b95b199f3c7]
[2]: StubFrame [pc: 0x3b95b19c0355]
[3]: StubFrame [pc: 0x3b95b199f8ec]
[4]: EntryFrame [pc: 0x3b95b1984ba1]
======...

FATAL ERROR: Ineffective mark-compacts near heap limit Allocation failed - JavaScript heap out of memory
 1: 0x10003c597 node::Abort() [/Users/jmwright/.nvm/versions/node/v10.15.3/bin/node]
 2: 0x10003c7a1 node::OnFatalError(char const*, char const*) [/Users/jmwright/.nvm/versions/node/v10.15.3/bin/node]
 3: 0x1001ad575 v8::internal::V8::FatalProcessOutOfMemory(v8::internal::Isolate*, char const*, bool) [/Users/jmwright/.nvm/versions/node/v10.15.3/bin/node]
 4: 0x100579242 v8::internal::Heap::FatalProcessOutOfMemory(char const*) [/Users/jmwright/.nvm/versions/node/v10.15.3/bin/node]
 5: 0x10057bd15 v8::internal::Heap::CheckIneffectiveMarkCompact(unsigned long, double) [/Users/jmwright/.nvm/versions/node/v10.15.3/bin/node]
 6: 0x100577bbf v8::internal::Heap::PerformGarbageCollection(v8::internal::GarbageCollector, v8::GCCallbackFlags) [/Users/jmwright/.nvm/versions/node/v10.15.3/bin/node]
 7: 0x100575d94 v8::internal::Heap::CollectGarbage(v8::internal::AllocationSpace, v8::internal::GarbageCollectionReason, v8::GCCallbackFlags) [/Users/jmwright/.nvm/versions/node/v10.15.3/bin/node]
 8: 0x10058262c v8::internal::Heap::AllocateRawWithLigthRetry(int, v8::internal::AllocationSpace, v8::internal::AllocationAlignment) [/Users/jmwright/.nvm/versions/node/v10.15.3/bin/node]
 9: 0x1005826af v8::internal::Heap::AllocateRawWithRetryOrFail(int, v8::internal::AllocationSpace, v8::internal::AllocationAlignment) [/Users/jmwright/.nvm/versions/node/v10.15.3/bin/node]
10: 0x100551ff4 v8::internal::Factory::NewFillerObject(int, bool, v8::internal::AllocationSpace) [/Users/jmwright/.nvm/versions/node/v10.15.3/bin/node]
11: 0x1007da449 v8::internal::Runtime_AllocateInTargetSpace(int, v8::internal::Object**, v8::internal::Isolate*) [/Users/jmwright/.nvm/versions/node/v10.15.3/bin/node]
12: 0x3b95b19dbe3d
/var/folders/ns/9yzjnpt94pg13sr5z_3pcp3m0000gq/T/yarn--1562254851338-0.5776542539289684/node: line 3: 96170 Abort trap: 6           "/Users/jmwright/.nvm/versions/node/v10.15.3/bin/node" "$@"
[nodemon] app crashed - waiting for file changes before starting...
```

### 3 / 3

```bash
Using Shield
Garbage Collection No. | Collection Time Min Avg Max | Heap Size Diff Min Avg Max
Collections: 100 0ms 3ms 9ms -4MB 2MB 6MB
Collections: 200 0ms 3ms 9ms -4MB 1MB 6MB
Collections: 300 0ms 3ms 9ms -4MB 1MB 6MB
Collections: 400 0ms 3ms 9ms -4MB 1MB 6MB
Collections: 500 0ms 3ms 10ms -4MB 1MB 10MB
Collections: 600 0ms 3ms 11ms -53MB 1MB 12MB
Collections: 700 0ms 3ms 11ms -53MB 1MB 12MB
Collections: 800 0ms 3ms 11ms -53MB 0MB 12MB
Collections: 900 0ms 3ms 15ms -113MB 0MB 12MB
Collections: 1000 0ms 4ms 15ms -113MB 1MB 12MB
Collections: 1100 0ms 4ms 15ms -305MB 0MB 12MB
Collections: 1200 0ms 4ms 15ms -305MB 0MB 12MB
Collections: 1300 0ms 4ms 15ms -305MB 0MB 12MB
Collections: 1400 0ms 4ms 15ms -305MB 0MB 13MB
Collections: 1500 0ms 4ms 15ms -524MB 0MB 13MB
Collections: 1600 0ms 5ms 27ms -524MB 0MB 13MB
Collections: 1700 0ms 5ms 27ms -524MB 0MB 13MB
Collections: 1800 0ms 5ms 27ms -748MB 0MB 13MB
Collections: 1900 0ms 5ms 27ms -748MB 0MB 13MB

<--- Last few GCs --->

[96541:0x102654000]    99180 ms: Mark-sweep 1390.4 (1430.5) -> 1389.4 (1433.0) MB, 719.9 / 0.9 ms  (average mu = 0.062, current mu = 0.006) allocation failure scavenge might not succeed


<--- JS stacktrace --->

==== JS stack trace =========================================

    0: ExitFrame [pc: 0x325b355dbe3d]
    1: StubFrame [pc: 0x325b355c16d5]
Security context: 0x2eb9e689e6e9 <JSObject>
    2: completeObjectValue(aka completeObjectValue) [0x2eb9bcf63e01] [/Users/jmwright/code/sandbox/graphql-middleware-tests/node_modules/graphql/execution/execute.js:~715] [pc=0x325b35d171ae](this=0x2eb924c826
f1 <undefined>,exeContext=0x2eb920730e19 <Object map = 0x2eb977de9039>,returnType=0x2eb9b562a999 <GraphQLObjectTy...

FATAL ERROR: Ineffective mark-compacts near heap limit Allocation failed - JavaScript heap out of memory
 1: 0x10003c597 node::Abort() [/Users/jmwright/.nvm/versions/node/v10.15.3/bin/node]
 2: 0x10003c7a1 node::OnFatalError(char const*, char const*) [/Users/jmwright/.nvm/versions/node/v10.15.3/bin/node]
 3: 0x1001ad575 v8::internal::V8::FatalProcessOutOfMemory(v8::internal::Isolate*, char const*, bool) [/Users/jmwright/.nvm/versions/node/v10.15.3/bin/node]
 4: 0x100579242 v8::internal::Heap::FatalProcessOutOfMemory(char const*) [/Users/jmwright/.nvm/versions/node/v10.15.3/bin/node]
 5: 0x10057bd15 v8::internal::Heap::CheckIneffectiveMarkCompact(unsigned long, double) [/Users/jmwright/.nvm/versions/node/v10.15.3/bin/node]
 6: 0x100577bbf v8::internal::Heap::PerformGarbageCollection(v8::internal::GarbageCollector, v8::GCCallbackFlags) [/Users/jmwright/.nvm/versions/node/v10.15.3/bin/node]
 7: 0x100575d94 v8::internal::Heap::CollectGarbage(v8::internal::AllocationSpace, v8::internal::GarbageCollectionReason, v8::GCCallbackFlags) [/Users/jmwright/.nvm/versions/node/v10.15.3/bin/node]
 8: 0x10058262c v8::internal::Heap::AllocateRawWithLigthRetry(int, v8::internal::AllocationSpace, v8::internal::AllocationAlignment) [/Users/jmwright/.nvm/versions/node/v10.15.3/bin/node]
 9: 0x1005826af v8::internal::Heap::AllocateRawWithRetryOrFail(int, v8::internal::AllocationSpace, v8::internal::AllocationAlignment) [/Users/jmwright/.nvm/versions/node/v10.15.3/bin/node]
10: 0x100551ff4 v8::internal::Factory::NewFillerObject(int, bool, v8::internal::AllocationSpace) [/Users/jmwright/.nvm/versions/node/v10.15.3/bin/node]
11: 0x1007da044 v8::internal::Runtime_AllocateInNewSpace(int, v8::internal::Object**, v8::internal::Isolate*) [/Users/jmwright/.nvm/versions/node/v10.15.3/bin/node]
12: 0x325b355dbe3d
13: 0x325b355c16d5
14: 0x325b35d171ae
15: 0x325b35d11290
16: 0x325b35d49f32
/var/folders/ns/9yzjnpt94pg13sr5z_3pcp3m0000gq/T/yarn--1562254979732-0.015291591156733064/node: line 3: 96541 Abort trap: 6           "/Users/jmwright/.nvm/versions/node/v10.15.3/bin/node" "$@"


```

## Without Shield

The stack seemed to change much less wildly without Shield applied. The minimum change in the Heap size never went above -30MB there about. There was also considerably less garbage collection runs.

### 1 / 3

```bash
WITHOUT Shield
Garbage Collection No. | Collection Time Min Avg Max | Heap Size Diff Min Avg Max
Collections: 100 0ms 5ms 10ms -9MB 2MB 6MB
Collections: 200 0ms 4ms 10ms -22MB 1MB 6MB
Collections: 300 0ms 4ms 10ms -22MB 1MB 6MB
Collections: 400 0ms 4ms 14ms -22MB 1MB 6MB
Collections: 500 0ms 4ms 14ms -22MB 0MB 6MB
Collections: 600 0ms 4ms 14ms -22MB 0MB 6MB
Collections: 700 0ms 4ms 14ms -22MB 0MB 6MB
Collections: 800 0ms 4ms 14ms -22MB 0MB 6MB
```

### 2 / 3

```bash
WITHOUT Shield
Garbage Collection No. | Collection Time Min Avg Max | Heap Size Diff Min Avg Max
Collections: 100 0ms 4ms 8ms -4MB 2MB 6MB
Collections: 200 0ms 4ms 8ms -14MB 1MB 6MB
Collections: 300 0ms 4ms 8ms -14MB 1MB 6MB
Collections: 400 0ms 4ms 8ms -14MB 1MB 6MB
Collections: 500 0ms 4ms 8ms -15MB 0MB 6MB
Collections: 600 0ms 4ms 8ms -15MB 0MB 6MB
Collections: 700 0ms 4ms 8ms -15MB 0MB 6MB
Collections: 800 0ms 4ms 8ms -15MB 0MB 6MB
```

### 3 / 3

```bash
WITHOUT Shield
Garbage Collection No. | Collection Time Min Avg Max | Heap Size Diff Min Avg Max
Collections: 100 0ms 4ms 10ms -3MB 2MB 6MB
Collections: 200 0ms 4ms 10ms -15MB 1MB 6MB
Collections: 300 0ms 4ms 10ms -15MB 1MB 6MB
Collections: 400 0ms 4ms 10ms -16MB 1MB 6MB
Collections: 500 0ms 4ms 10ms -16MB 0MB 6MB
Collections: 600 0ms 4ms 10ms -16MB 0MB 6MB
Collections: 700 0ms 4ms 10ms -16MB 0MB 6MB
Collections: 800 0ms 4ms 10ms -19MB 0MB 6MB
```
