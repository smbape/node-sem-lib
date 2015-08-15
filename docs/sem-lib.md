# Global





* * *

### positiveIntegerValueOf(num, _default) 

Value of parsed interger or default value if not a number or < 0

**Parameters**

**num**: `Any`, value to parse

**_default**: `Interger`, default value

**Returns**: `Interger`, parsing result


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










