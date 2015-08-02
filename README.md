sem-lib
=======

  - Limit simultaneous access to resources
  - Synchronize multiple tasks

```javascript
// Create
var semLib = require("sem-lib");
var semID = semLib.semCreate();

// wait for a token
semID.semTake(callback);

// Add a token to semaphore
semLib.semGive();
```

```javascript
// Exclusive access
var semLib = require("sem-lib");
var semRessource = semLib.semCreate(1, true);

semRessource.semTake(function() {
  // first exclusive access
  ...
  semLib.semGive();
});

semLib.semTake(function() {
  // second exclusive access
  ...
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
  //Executed after AsyncTask1, AsyncTask2 and AsyncTask3
  console.log("After all tasks");
});
```

```javascript
// Limit simultaneous access
// You have multiple downloads to do and you don't want to blow your memory nor cpu

var semLib = require("sem-lib");

// 8 simultanenous downloads at same time
var semID = semLib.semCreate(8, true);

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

## Class: Semaphore


### Semaphore.getId() 

Return semaphore id. Usefull for debugging

**Returns**: `Interger`, Semaphore id

### Semaphore.getNumTokens() 

Return number of available tokens

**Returns**: `Interger`, number of available tokens

### Semaphore.getCapacity() 

Return maximum of available tokens

**Returns**: `Integer`, maximum of available tokens

### Semaphore.semGive(num) 

Add tokens to the Semaphore

**Parameters**

**num**: `Interger`, Number of tokens to add


### Semaphore.semFlush() 

Give tokens to every inwaiting tasks


### Semaphore.semTake(settings) 

Wait for Semaphore availability before calling onTake callback

**Parameters**

**settings**: `Object`, settings with the following properties:
<ul>
<li>{Function} <b><em>onTake</em></b></li>: called on successful take
<li>{Integer} <b><em>num</em></b></li>(optional, default = 1): Number of tokens to take before calling onTake callback
<li>{Integer} <b><em>priority</em></b></li>(optional): task priority, smaller is higher priority
<li>{Number} <b><em>timeOut</em></b></li>(optional): milliseconds to wait before timeOut. If !(settings['timeOut'] > 0), waiting will last forever
<li>{Function} <b><em>onTimeOut</em></b></li>(optional): called if timeOut occurs
</ul>

**Returns**: `Object | false`, item item.addCounter(n = 1) => wait for n more tokens

**Example**:
```js
semTake(Function[, takeInstance]);
semTake(Settings[, takeInstance]);
```

### Semaphore.destroy(safe) 

Destroy all inwaiting tasks

**Parameters**

**safe**: `Boolean`, if true, wait for all inwaiting tasks to be performed, else, destroy with no warn




* * *

License
-------
`MIT`