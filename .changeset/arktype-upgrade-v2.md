---
'@jhecht/arktype-utils': patch
---

Upgrading arktype utils to work better with ArkType 2.

This also removes all the `validateObject` helper method, as ArkType 2 has the [`type.assert`](https://arktype.io/docs/type-api) method which handles the same use cases.
