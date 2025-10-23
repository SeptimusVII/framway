import {Parcel} from '@parcel/core';

let bundler = new Parcel({
  entries: ['src/framway.html'],
  defaultConfig: '@parcel/config-default',
  mode: 'production',
  needsStableName: true,
  targets: {
    "default": {
      "sourceMap": false,
      "publicUrl": ".",
      "distDir": "./build"
    },
  },
  additionalReporters:[
    {
      packageName: '../scripts/reporter.mjs',
      resolveFrom: 'scripts/reporter.mjs'
    }
  ]
});

try {
  let {bundleGraph, buildTime} = await bundler.run();
  let bundles = bundleGraph.getBundles();
  console.log(`✨ Built ${bundles.length} bundles in ${buildTime}ms!`);
} catch (err) {
  console.log(err.diagnostics);
}