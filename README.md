# sem-lib

A semaphore library for nodejs
  - Limit simultaneous access to resources
  - Synchronize multiple tasks

```javascript
// Create
const SemLib = require("sem-lib");
const semID = SemLib.semCreate();

// wait for a token
semID.semTake(callback);

// Add a token to the semaphore
SemLib.semGive();
```

```javascript
// Exclusive access
const SemLib = require("sem-lib");
const semID = SemLib.semCreate(1, true);

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
const SemLib = require("sem-lib");
const semID = SemLib.semCreate(3, true);

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
// You have multiple downloads to do and you don't want to blow up your memory nor your cpu

const SemLib = require("sem-lib");

// At most 8 simultanenous downloads
const semID = SemLib.semCreate(8, true);

require('fs').readFile('links', function(err, data) {
    if (err) {
        throw err;
    }
    const links = data.toString().trim().split(/\r?\n/);
    semID.schedule(links, (link, i, next) => {
        console.log(`downloading ${ link }`);
        download(link, next);
    }, () => {
        console.log(`downloaded ${ links.length } links`);
    });
});

```

## SemLib

### SemLib.semCreate(capacity, isFull, priority, sync = false)

Create a semaphore. See Semaphore#constructor() for more detauls

### SemLib.Semaphore

See the Semaphore Class

## Semaphore : `Class`

### constructor(capacity, isFull, priority, sync = false)

| Option      | Type      | Optional  | Default | Description                                                     |
|-------------|-----------|:---------:|---------|-----------------------------------------------------------------|
| `capacity`  | `Integer` | Yes       | `1`     | Number of available tokens. i.e. how much concurrency           |
| `isFull`    | `Boolean` | Yes       | `false` | Create semaphore with all tokens available                      |
| `priority`  | `Integer` | Yes       | `15`    | Default take priority. Lower values means higher priority       |
| `sync`      | `Boolean` | Yes       | `false` | Run tasks synchronously instead of waiting for the next tick    |

### semTake(task : `Function`) : `Inwaiting`

Shortcut to `semTake({onTake: task})`

### semTake(settings : `Object`) : `Inwaiting | false`

Wait for the Semaphore availability before calling onTake callback.

Returns `false` if the semaphore has been destroyed.

#### `task`()

Function to call when all the tokens have been taken.

#### `shouldTakeToken`(availableTokens : `Integer`, missingTokens : `Integer`, alreadyTakenTokens : `Integer`, semID : `Semaphore`) : `Boolean`

In case you want to allow the waiting task to take tokens only if certains conditions are met.

#### `hasMissingToken`(semID : `Semaphore`)

Called when there are not enough token for the task.

#### Other options

| Option            | Type        | Optional  | Default             | Description                                                                     |
|-------------------|-------------|:---------:|---------------------|---------------------------------------------------------------------------------|
| `priority`        | `Integer`   | Yes       | Semaphore priority  | Task priority. Lower values means higher priority                               |
| `num`             | `Integer`   | Yes       | `1`                 | Number of tokens to take                                                        |
| `timeOut`         | `Integer`   | Yes       | `undefined`         | Time to wait until the task is abandoned                                        |
| `onTimeOut`       | `Function`  | Yes       | `undefined`         | Function to call when waiting has reached timeout                               |
| `onCancel`        | `Function`  | Yes       | `undefined`         | Function to call when waiting has been canceled                                 |
| `unfair`          | `Boolean`   | Yes       | `false`             | Allows to take tokens from waiting tasks with lower priorities                  |
| `sync`            | `Boolean`   | Yes       | `undefined`         | Run this task synchronously. If not defined, honor the semaphore sync option    |

### semGive(num : `Integer`, overflow: `Boolean`)

Give the number of tokens to the semaphore.

By default, a semaphore cannot receive more tokens than its capacity.  
`overflow` allows temporary capacity overflow.  
During the semGive process, getNumTokens() + num will the number of available tokens.  
At the end of the semGive process, then number of available tokens will not exceed the semaphore capacity.

### semFlush()

Run all waiting tasks

### getNumTokens() : `Integer`

Return the number of available tokens

### getCapacity() : `Integer`

Return the maximum of available tokens

### setCapacity(capacity: `Integer`)

Set the maximum of available tokens

### schedule : `Inwaiting`

Run a collection of tasks, take one token for each task.

Queuing millions of tasks in the semaphore will use a lot of memory.  
For that reason, when you have a collection of tasks, prefer using schedule.  
It is faster and uses less memory. See benchmark/memory-profile.js for an example.

#### Usage

**schedule(collection : `Array | Iterable | Object`, priority : `Integer`)**  
**schedule(collection : `Array | Iterable | Object`, callback : `Function`)**  
**schedule(collection : `Array | Iterable | Object`, priority : `Integer`, callback : `Function`)**  
**schedule(collection : `Array | Iterable | Object`, iteratee : `Function`, callback : `Function`)**  
**schedule(collection : `Array | Iterable | Object`, priority : `Integer`, iteratee : `Function`, callback : `Function`)**

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
const semID = semLib.semCreate(3, true); // 3 tokens ful

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
const semID = semLib.semCreate(3, true); // 3 tokens full

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

**safe**: `Boolean`, optional, default: `undefined`, if not false, wait for all inwaiting tasks to be performed, else, cancel inwaiting tasks and destroy
**onDestroy**: `Function` optional, Called after semaphore destruction

## Inwaiting : `Class`

### addCounter(num : `Integer`)

The task should take more tokens before running

### setPriority(priority : `Integer`)

Change the task priority

### cancel()

Cancel the task

# License

The MIT License (MIT)

Copyright (c) 2014-2019 Stéphane MBAPE (https://smbape.com)

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
