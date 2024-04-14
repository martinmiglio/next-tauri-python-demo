const fs = require('fs');
const path = require('path');

const version = process.env.VERSION ?? 'v0.0.0';
const tauriConfPath = path.join(__dirname, './src-tauri/tauri.conf.json');

const tauriConf = require(tauriConfPath);

tauriConf.version = version.replace('v', '');

fs.writeFileSync(tauriConfPath, JSON.stringify(tauriConf, null, 2));

console.log(`Updated tauri.conf.json with version ${version}`);
