export * from './formData.js';

import { build } from "tsup";

const bob = build({
  entry: ['./formData.js']
});