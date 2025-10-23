import {Reporter} from '@parcel/plugin';
import shell from 'shelljs';

export default new Reporter({
  report({event}) {
      // process.stdout.write('\n'+event.type);
    let d = new Date();
    if (event.type === 'buildStart') {
      // let bundles = event.bundleGraph.getBundles();
      // process.stdout.write(`✨ Built ${bundles.length} bundles in ${event.buildTime}ms!\n`);
      process.stdout.write('BUILD STARTED - '+d.toLocaleString()+'\n');
      shell.exec('npm run framway onBuildStart')
    } 
    if (event.type === 'buildSuccess' || event.type === 'buildFailure') {
      process.stdout.write('BUILD ENDED '+d.toLocaleString()+'\n');
      shell.exec('npm run framway onBuildEnd')
    }
  }
});