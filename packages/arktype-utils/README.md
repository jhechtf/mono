# Arktype Utils

[ArkType](https://www.npmjs.com/package/arktype) is a TypeScript validator that delivers highly optimized validators.

I created some wrappers around ArkType's validators. 

***This is still an early version, the shape might change. I will attempt to keep a nice deprecation path.***

## Turning FormData into an object

This is a helper method, primarily for Node-based backends that need to turn `FormData` values into a JS object.

**NOTE**: This does _no_ validation, it just turns the values into an object

```ts
import { formDataToObject } from '@jhecht/arktype-utils'

const fd = new FormData();
fd.append('name', 'Bob');
fd.append('surname', 'Surbob');
fd.append('age', '31');

const obj = formDataToObject(fd);
```

For repeated entries, if there is more than 1 value found, it will be turned into an array

```ts
import { formDataToObject } from '@jhecht/arktype-utils';
const fd = new FormData();
fd.append('name', 'Bob');
fd.append('name', 'John');

const obj = formDataToObject(fd);

// { name: ['Bob', 'John']}
console.info(obj);

```

This method all does it's best guess for JSON-parsible values, including BigInt

```ts
import { formDataToObject } from '@jhecht/arktype-utils';

const fd = new FormData();
fd.append('number', '13');
fd.append('otherNumber', '3.1415');
fd.append('bigNumber', '300n');

const obj = formDataToObject(fd);

// { number: 13, otherNumber: 3.1415, bigNumber: 300n } -- no strings!
console.info(obj);
```

You can also for an element to _always_ be an array by ending it with `[]`:

```ts
import { formDataToObject } from '@jhecht/arktype-utils';

const fd = new FormData();
fd.append('email[]', 'bob@bob.bob');

const obj = formDataToObject(fd);

// { email: ['bob@bob.bob'] }
console.info(obj);
```

## Validating Data with ArkType

I created this wrapper, which `throws` if there are any `error` values. It takes two arguments, one being a `FormData` object, and the other a `type` or `scope` call from ArkType, which serves as the validator for the object-ified `FormData`.

```ts
import { validateFormData } from '@jhecht/arktype-utils';
import { type } from 'arktype';

const fd = new FormData();
// Assume `fd` is gotten from the request body here

try {
  const obj = validateFormData(fd, type({
    name: 'string>=2',
    age: '13<=number',
    favoriteMovies: 'string[]',
  }));
  // If this code is ran we know that the value of the `fd` variables passes the above validations when turned into an object
  console.info(obj);
} catch(e) {
  // If we end up here, `e` will be the `Problems` object returned by ArkType's validator
  console.error(e);
}
```
