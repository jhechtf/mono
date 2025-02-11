---
'@jhecht/arktype-utils': patch
---

Fixes bug in key detection algorithm for formDataToObject

Previously the keys were limited to only alpha-based characters, which does not follow JavaScript's own
way of dealing with keys in objects. This was opened up, allowing for any string value to be used as the key.
