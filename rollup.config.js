import path          from 'path';

import resolve       from '@rollup/plugin-node-resolve';
import { terser }    from 'rollup-plugin-terser';        // Terser is used for minification / mangling

// Import config files for Terser and Postcss; refer to respective documentation for more information.
import terserConfig  from './terser.config';

// The deploy path for the distribution for browser & Node.
const s_DIST_BROWSER = './dist';

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

   return [{     // This bundle is for the browser distribution.
         input: ['src/Main.js'],
         treeshake: {
            preset: 'smallest'   // This will reduce @ephox/katamari import.
         },
         output: [{
            file: `${s_DIST_BROWSER}${path.sep}esm${path.sep}typhonjs-oembed.js`,
            format: 'es',
            plugins: outputPlugins,
            preferConst: true,
            sourcemap: s_SOURCEMAP,
            // sourcemapPathTransform: (sourcePath) => sourcePath.replace(relativeDistBrowserPath, `.`)
         }],
         plugins: [
            resolve({ browser: true }),
         ]
      },
      {     // This bundle is for the browser distribution.
         input: ['src/Main.js'],
         treeshake: {
            preset: 'smallest'   // This will reduce @ephox/katamari import.
         },
         output: [{
            file: `${s_DIST_BROWSER}${path.sep}umd${path.sep}typhonjs-oembed.js`,
            format: 'umd',
            plugins: outputPlugins,
            preferConst: true,
            sourcemap: s_SOURCEMAP,
            // sourcemapPathTransform: (sourcePath) => sourcePath.replace(relativeDistBrowserPath, `.`)
         }],
         plugins: [
            resolve({ browser: true }),
         ]
      }
   ];
};
