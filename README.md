# sem-lib

A semaphore library for nodejs
  - Limit simultaneous access to resources
  - Synchronize multiple tasks

```javascript
// Create
var SemLib = require("sem-lib");
var semID = SemLib.semCreate();

// wait for a token
semID.semTake(callback);

// Add a token to semaphore
SemLib.semGive();
```

```javascript
// Exclusive access
var SemLib = require("sem-lib");
var semID = SemLib.semCreate(1, true);

semID.semTake(function() {
  // first exclusive access
  ...
  semID.semGive();
});

semID.semTake(function() {
  // second exclusive access
  ...
  semID.semGive();
});
```

```javascript
// Synchronization
var SemLib = require("sem-lib");
var semID = SemLib.semCreate(3, true);

function AsyncTask1(semID) {
  console.log("AsyncTask1");
  semID.semGive();
}

function AsyncTask2(semID) {
  console.log("AsyncTask2");
  semID.semGive();
}

function AsyncTask3(semID) {
  console.log("AsyncTask3");
  semID.semGive();
}

setTimeout(function() {
  AsyncTask1(semID);
}, 200);

setTimeout(function() {
  AsyncTask2(semID);
}, 100);

setTimeout(function() {
  AsyncTask3(semID);
}, 300);

semID.semTake(3, function(){
  //Executed after AsyncTask1, AsyncTask2 and AsyncTask3
  console.log("After all tasks");
});
```

```javascript
// Limit simultaneous access
// You have multiple downloads to do and you don't want to blow your memory nor cpu

var SemLib = require("sem-lib");

// 8 simultanenous downloads at same time
var semID = SemLib.semCreate(8, true);

require('fs').readFile('links.txt', function (err, data) {
  if (err) throw err;
  var links = data.toString().split(/\n/);
  for (var i = 0, _len = links.length; i < _len; i++) {
    download(links[i]);
  }
});

function download(link) {
  semID.semTake(function() {
    doDownload(link, function() {
      semID.semGive();
    });
  });
}

```

## SemLib

### SemLib.semCreate(capacity, isFull, priority)

Create a semaphore. See Semaphore#constructor() for more detauls

### SemLib.Semaphore

## Semaphore : `Class`

### constructor(capacity, isFull, priority)

| Option      | Type      | Optional  | Default | Description                                                                     |
|-------------|-----------|:---------:|---------|---------------------------------------------------------------------------------|
| `capacity`  | `Integer` | Yes       | `1`     | Number of available tokens. i.e. how much concurrency                           |
| `isFull`    | `Boolean` | Yes       | `false` | Create semaphore with all tokens available                                      |
| `priority`  | `Integer` | Yes       | `15`    | Default take priority. The lower the number is, the more priority the take has  |

### semTake(task : `Function`) : `Inwaiting`

Shortcut to `semTake({onTake: task})`

### semTake(settings : `Object`) : `Inwaiting | false`

Wait for Semaphore availability before calling onTake callback.

Returns `false` if the semaphore has been destroyed.

#### `task`()

Function to call when all tokens have been taken. Optional

#### `shouldTakeToken`(available : `Integer`, required : `Integer`, take : `Integer`, semID : `Semaphore`) : `Boolean`

In case you want to allow the waiting task to take tokens only if certains conditions are met.

#### Other options

| Option            | Type        | Optional  | Default             | Description                                                     |
|-------------------|-------------|:---------:|---------------------|-----------------------------------------------------------------|
| `priority`        | `Integer`   | Yes       | Semaphore priority  | Task priority. Lower values means higher priority               |
| `num`             | `Integer`   | Yes       | `1`                 | Number of tokens to take                                        |
| `timeOut`         | `Integer`   | Yes       | `undefined`         | Time to wait until the task is abandonned                       |
| `onTimeOut`       | `Function`  | Yes       | `undefined`         | Function to call when waiting has reached timeout               |
| `onCancel`        | `Function`  | Yes       | `undefined`         | Function to call when waiting has been canceled                 |
| `unfair`          | `Boolean`   | Yes       | `false`             | Allows to take tokens from waiting tasks with lower priorities  |

### semGive(num : `Integer`)

Give the number of tokens to the semaphore

### semFlush()

Run all waiting tasks

### schedule : `Scheduler`

Run a collection of tasks, take one token for each task.

Usefull to access limited resources in a collection of tasks without locking the resource for tasks with higher priorities.

#### Usage

**schedule(collection : `Iterable`, priority : `Integer`)**
**schedule(collection : `Iterable`, callback : `Function`)**
**schedule(collection : `Iterable`, priority : `Integer`, callback : `Function`)**
**schedule(collection : `Iterable`, iteratee : `Function`, callback : `Function`)**
**schedule(collection : `Iterable`, priority : `Integer`, iteratee : `Function`, callback : `Function`)**

#### Examples

```js
const semID = semLib.semCreate(3, true); // 3 tokens full
semID.schedule([
    next => {
      // task 1
      next()
    },
    next => {
      // task 2
      next()
    }
], () => {
    // All tasks were run;
});
```

```js
const semID = semLib.semCreate(3, true); // 3 tokens full capacity

semID.schedule([
    [/* args 1 */],
    [/* args 2 */],
], (args, i, next) => {
    // process args
    next();
}, () => {
    // All args were processed;
});
```

```js
const semID = semLib.semCreate(3, true); // 3 tokens full
semID.schedule({
    s1: next => { /* task 1 */; next() },
    s2: next => { /* task 2 */; next() },
}, () => {
    // All tasks were run;
});
```

```js
const semID = semLib.semCreate(3, true); // 3 tokens full capacity

semID.schedule({
    s1: [ /* args 1 */ ],
    s2: [ /* args 2 */ ],
}, (args, key, next) => {
    // process args
    next();
}, () => {
    // All args were processed;
});
```

### destroy(safe, onDestroy) 

Destroy all inwaiting tasks

**Parameters**

**safe**: `Boolean`, if true, wait for all inwaiting tasks to be performed, else, cancel inwaiting tasks and destroy

## Inwaiting : `Class`

### addCounter(num : `Integer`)

The task should take more tokens before running

### setPriority(priority : `Integer`)

Change the task priority

### cancel()

Cancel the task

# License

The MIT License (MIT)

Copyright (c) 2014-2018 Stéphane MBAPE (https://smbape.com)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
