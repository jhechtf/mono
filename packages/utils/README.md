# `utils`

## Batch

Given a function and timeout window, calls made within the batch window are conglomerated together and passed as a single set of arguments.

The must return a Promise that takes a single argument and maps it to a result to
return the value.

i.e. 

```ts
async function addTodo(todos: [AddTodo][]): BatchReturn<[AddTodo], Todo> {
  const values = await db.transaction(async tx => {...});
  const lookup = new Map<AddTodo, Todo>(
    values.map()
  )
  return (todo) => 
}
```

## Throttle

Given a function, ensures that it only runs once per timeout window. It runs with the latest args to the timeout window.

```ts
const throttledWip = throttle((e: Event) => {
  // write to local storage
}, 500);

document.querySelector('input[name="title"]')
  .addEventListener('input', throttledWip);

  // A user typing 'updated title' would only trigger ~2 calls of this function as opposed to one per letter.
```

### (async) Throttle

This version is ***non***idempotent. All calls to `returnThrottle` will resolve
to the argument call that is called by the throttle mechanism. e.g.

```ts
function someValue(n: number): number {
  return n * 2;
}

const throttledSomeValue = throttleReturn(someValue, 500);

// All of these will return the value for the last called item.
const allValues = await Promise.all([
  throttledSomeValue(1),
  throttledSomeValue(2),
  throttledSomeValue(3),
]);

// [6, 6, 6];
console.info(allValues);
```