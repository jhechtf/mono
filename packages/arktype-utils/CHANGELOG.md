# @jhecht/arktype-utils

## 1.0.1

### Patch Changes

- c3ec8f7: Fixes bug in key detection algorithm for formDataToObject

  Previously the keys were limited to only alpha-based characters, which does not follow JavaScript's own
  way of dealing with keys in objects. This was opened up, allowing for any string value to be used as the key.

## 1.0.0

### Major Changes

- c2196c0: Updated to ArkType 2.0.4

  This moves off of the old 1.x beta and into 2, which marks a major update to ArkType and
  is therefore a major move for the utils.

### Minor Changes

- 1d9a099: Updates formDataToObject to include nested objects

### Patch Changes

- b439139: please hold
- 2c162ce: Initial release of all scoped packages
