sem-lib.js
============

This library can be used to:
	- Limit simultaneous access to resources:
		If the semaphore is available, the calling task takes a token, 
		continues excecuting and when finished, gives the token back.
	- synchronize multiple tasks:
		If the semaphore is empty, the task will be "blocked", 
		pending the availability of the semaphore. 
		If a timeout is specified and the timeout expires, 
		the pended task will be removed from the queue of pended tasks 
		and timeout callback will be called. 
		Any number of tasks may be pended simultaneously on the same semaphore.

```javascript
// Create
var semLib = require("sem-lib");
var semID = semLib.semCreate([capacity = 1, full = false]);

// Take will wait for semaphore availability
// semLib.semTake(semID[, num = 1, timeOut = null, priority = 15], successCallback[, timeoutCallback = null])
semID.semTake({
	onTake: successCallback[, num: 1, priority: undefined, timeOut: undefined, onTimeOut: undefined]
});

// Give will add token to semaphore
semLib.semGive(semID[, num = 1)

// Flush will atomically unblock all pended tasks in the semaphore queue, 
// i.e., all tasks will be executed
semLib.semFlush(semID[, num = 1)
```

```javascript
// Exclusive access
var semLib = require("sem-lib");
var semRessource = semLib.semCreate(1, true);

semLib.semTake(semRessource, semRessource.capacity, function(){
	...  // first exclusive access
	semLib.semGive(semRessource, semRessource.capacity);
});

semLib.semTake(semRessource, semRessource.capacity, function(){
	...  // second exclusive access
	semLib.semGive(semRessource, semRessource.capacity);
});
```

```javascript
// Synchronization
var semLib = require("sem-lib");
var semID = semLib.semCreate(3);

function AsyncTask1() {
	console.log("AsyncTask1");
}

function AsyncTask2() {
	console.log("AsyncTask2");
}

function AsyncTask3() {
	console.log("AsyncTask3");
}

setTimeout(function() {
	AsyncTask1();
	semLib.semGive(semID);
}, 200);

setTimeout(function() {
	AsyncTask2();
	semLib.semGive(semID);
}, 100);

setTimeout(function() {
	AsyncTask3();
	semLib.semGive(semID);
}, 300);

semLib.semTake(semID, 3, function(){
	console.log("After all tasks");  //Executed after AsyncTask1, AsyncTask2 and AsyncTask3
});
```

```javascript
// Limit simultaneous access
var semLib = require("sem-lib");
var semID = semLib.semCreate(1, true);
var httpServer = require('http').createServer(function(req, res){
	// Every request will be answered 5 seconds after the last answer
	semLib.semTake(semID, function(){
		setTimeout(function(){
			res.end("Hello");
			semLib.semGive(semID);
		}, 5000);
	});
});

httpServer.listen(8000);
```