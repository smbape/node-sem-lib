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

semRessource.semTake(function(){
	...  // first exclusive access
	semLib.semGive();
});

semLib.semTake(function(){
	...  // second exclusive access
	semLib.semGive();
});
```

```javascript
// Synchronization
var semLib = require("sem-lib");
var semID = semLib.semCreate(3);

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
	console.log("After all tasks");  //Executed after AsyncTask1, AsyncTask2 and AsyncTask3
});
```

```javascript
// Limit simultaneous access
var semLib = require("sem-lib");
var semID = semLib.semCreate(1, true);
var httpServer = require('http').createServer(function(req, res){
	// 5 Seconds minimum between reply of each request
	semID.semTake(function(){
		res.end("Hello");
		setTimeout(function(){
			semID.semGive();
		}, 5000);
	});
});

httpServer.listen(8000);
```