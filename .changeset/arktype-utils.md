---
"@jhecht/arktype-utils": minor
---

## Summary

Updated utilities to allow for building nested files

### Detailed Changes

```ts
// Test nested objects with dot notation
const fd = new FormData();
fd.append('payments.id1.location', 'England');
fd.append('payments.id1.age', '37');
fd.append('payments.id2.location', 'New York');
const obj = formDataToObject(fd);

// Test nested arrays with bracket notation
const fd2 = new FormData();
fd2.append('locations[].name', 'England');
fd2.append('locations[].members[]', 'John');
fd2.append('locations[].members[]', 'Joe');
fd2.append('locations[].name', 'France');
const obj2 = formDataToObject(fd2);
```
