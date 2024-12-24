import esbuildPluginTsc from 'esbuild-plugin-tsc';
import esbuild from 'esbuild';

function createBuildSettings(options) {
  return {
    entryPoints: ['src/index.ts'],
    outfile: 'dist/index.js',
    bundle: true,
    platform: 'node',
    format: 'esm',
    plugins: [
      esbuildPluginTsc({
        force: true
      }),
    ],
    ...options
  };
}

const settings = createBuildSettings({minify: true});
await esbuild.build(settings);