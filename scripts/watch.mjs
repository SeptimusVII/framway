import {Parcel} from '@parcel/core';

let bundler = new Parcel({
  entries: ['src/fwl.html'],
  defaultConfig: '@parcel/config-default',
  mode: 'production',
  needsStableName: true,
  targets: {
    'default': {
      'sourceMap': false,
      'publicUrl': '.',
      'distDir': './dev',
    },
  },
  additionalReporters:[
    {
      packageName: '../scripts/reporter.mjs',
      resolveFrom: 'scripts/reporter.mjs'
    }
  ],
  serveOptions: {
    port: 1234,
    distDir: './dev',
  },
  hmrOptions: {
    port: 1234
  },
});

let subscription = await bundler.watch((err, event) => {
  if (err) {
    // fatal error
    throw err;
  }
  
  if (event.type === 'buildSuccess') {
    let bundles = event.bundleGraph.getBundles();
    console.log(`✨ Built ${bundles.length} bundles in ${event.buildTime}ms!`);
  } else if (event.type === 'buildFailure') {
    console.log(event.diagnostics);
  }
});


// some time later...
// await subscription.unsubscribe();