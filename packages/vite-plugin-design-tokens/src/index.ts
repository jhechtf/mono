import type { Plugin } from 'vite';

const virtualModuleJs = 'virtual:tokens/js';
const virtualModuleCss = 'virtual:tokens/css';

export default function designTokenPlugin(): Plugin {
  return {
    name: 'vite-plugin-design-tokens',
    resolveId(id) {
      console.info(id, virtualModuleCss);
      if ([virtualModuleCss, virtualModuleJs].includes(id)) return '\0' + id;
    },
    load(id) {
      if ([virtualModuleCss, virtualModuleJs].map(v => '\0' + v).includes(id))
        return 'export const msg = "hello, from the virtual module!"; ';
    },
    transform(code, id) {
      console.info(id);
    },
  };
}
