---
'@jhecht/arktype-utils': patch
---

Fixes type for validateFormData function.

Previously the type was set incorrectly to use `Type['infer']` and not 
`T['infer']`, as it should have been. The dangers of writing and reviewing your own code!