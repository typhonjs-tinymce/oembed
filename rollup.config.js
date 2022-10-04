import path          from 'path';

import resolve       from '@rollup/plugin-node-resolve';
import { terser }    from 'rollup-plugin-terser';        // Terser is used for minification / mangling

// Import config files for Terser and Postcss; refer to respective documentation for more information.
import terserConfig  from './terser.config';

// The deploy path for the distribution for browser & Node.
const s_DIST_V5 = './dist/v5';
const s_DIST_V6 = './dist/v6';

const s_PUBLIC_V5 = './public/v5';
const s_PUBLIC_V6 = './public/v6';

// Produce sourcemaps or not.
const s_SOURCEMAP = true;

// Adds Terser to the output plugins for server bundle if true.
const s_MINIFY = typeof process.env.ROLLUP_MINIFY === 'string' ? process.env.ROLLUP_MINIFY === 'true' : true;

export default () =>
{
   // Defines potential output plugins to use conditionally if the .env file indicates the bundles should be
   // minified / mangled.
   const outputPlugins = [];
   if (s_MINIFY)
   {
      outputPlugins.push(terser(terserConfig));
   }

   return [
      // TinyMCE v5 version ------------------------------------------------------------------------------------------

      {     // This bundle is for the browser distribution.
         input: ['src/v5/Main.js'],
         treeshake: {
            preset: 'smallest'   // This will reduce @ephox/katamari import.
         },
         output: [{
            file: `${s_DIST_V5}${path.sep}esm${path.sep}typhonjs-oembed.js`,
            format: 'es',
            plugins: outputPlugins,
            preferConst: true,
            sourcemap: s_SOURCEMAP
         },
            {
               file: `${s_PUBLIC_V5}${path.sep}typhonjs-oembed.js`,
               format: 'es',
               preferConst: true,
               sourcemap: s_SOURCEMAP
            }],
         plugins: [
            resolve({ browser: true }),
         ]
      },
      {     // This bundle is for the browser distribution.
         input: ['src/v5/Main.js'],
         treeshake: {
            preset: 'smallest'   // This will reduce @ephox/katamari import.
         },
         output: [{
            file: `${s_DIST_V5}${path.sep}umd${path.sep}typhonjs-oembed.js`,
            format: 'umd',
            plugins: outputPlugins,
            preferConst: true,
            sourcemap: s_SOURCEMAP,
         }],
         plugins: [
            resolve({ browser: true }),
         ]
      },

      // TinyMCE v6 version ------------------------------------------------------------------------------------------

      {     // This bundle is for the browser distribution.
         input: ['src/v6/Main.js'],
         treeshake: {
            preset: 'smallest'   // This will reduce @ephox/katamari import.
         },
         output: [{
            file: `${s_DIST_V6}${path.sep}esm${path.sep}typhonjs-oembed.js`,
            format: 'es',
            plugins: outputPlugins,
            preferConst: true,
            sourcemap: s_SOURCEMAP
         },
         {
            file: `${s_PUBLIC_V6}${path.sep}typhonjs-oembed.js`,
            format: 'es',
            preferConst: true,
            sourcemap: s_SOURCEMAP
         }],
         plugins: [
            resolve({ browser: true }),
         ]
      },
      {     // This bundle is for the browser distribution.
         input: ['src/v6/Main.js'],
         treeshake: {
            preset: 'smallest'   // This will reduce @ephox/katamari import.
         },
         output: [{
            file: `${s_DIST_V6}${path.sep}umd${path.sep}typhonjs-oembed.js`,
            format: 'umd',
            plugins: outputPlugins,
            preferConst: true,
            sourcemap: s_SOURCEMAP,
         }],
         plugins: [
            resolve({ browser: true }),
         ]
      }
   ];
};
