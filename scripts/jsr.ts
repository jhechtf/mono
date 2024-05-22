/**
 * 0. Figure out where work spaces are
 * 1. Run the changeset status command
 * 2. Figure out where the damn packages are.
 * 3. If a deno.json[c] or jsr.json[c] file is found, bump it.
 */

import { parse } from 'jsr:@std/yaml';
import { expandGlob, type WalkEntry } from 'jsr:@std/fs';
import { join } from 'jsr:@std/path';

const workspaceFile = await Deno.readTextFile('./pnpm-workspace.yaml');

const yamlContents = parse(workspaceFile) as { packages: string[] };

const paths: Record<string, WalkEntry> = {};

// Gather the names + paths of the packages in the repo
for (const location of yamlContents.packages) {
  for await (const f of expandGlob(location)) {
    if (!f.isDirectory) continue;
    const packageJsonPath = join(f.path, 'package.json');

    if (await fileExists(packageJsonPath)) {
      const packageJsonFile = await Deno.readTextFile(packageJsonPath);

      const packageJson = JSON.parse(packageJsonFile) as {
        name: string;
        version: string;
      };

      if (!paths[packageJson.name]) paths[packageJson.name] = f;
    }
  }
}

type Release = {
  name: string;
  type: string;
  oldVersion: string;
  newVersion: string;
  changesets: string[];
};

//
const command = new Deno.Command('pnpm', {
  args: ['changeset', 'status', '--output', 'changes.json'],
});

const pnpm = await command.output();

if (pnpm.code === 0) {
  const changes = JSON.parse(await Deno.readTextFile('./changes.json')) as {
    releases: Release[];
  };
  for (const release of changes.releases) {
    if (
      paths[release.name] &&
      (await fileExists(join(paths[release.name].path, 'jsr.json')))
    ) {
      console.info('Found a package with a jsr.json file', release.name);
      const jsrContents = await Deno.readTextFile(
        join(paths[release.name].path, 'jsr.json'),
      );
      const jsr = JSON.parse(jsrContents) as { name: string; version: string };
      jsr.version = release.newVersion;
      console.info('JSR file', jsr);
      await Deno.writeTextFile(
        join(paths[release.name].path, 'jsr.json'),
        JSON.stringify(jsr, null, 2),
      );
    }
  }
}

async function fileExists(filename: string): Promise<boolean> {
  try {
    await Deno.stat(filename);
    // successful, file or directory must exist
    return true;
  } catch (error) {
    if (error instanceof Deno.errors.NotFound) {
      // file or directory does not exist
      return false;
    } else {
      // unexpected error, maybe permissions, pass it along
      throw error;
    }
  }
}
