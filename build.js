const fs = require('fs');
const path = require('path');

let env = process.env.REACT_APP_ENVIRONMENT;
console.log(`Environment: ${env}`);
//if env is undefined, set it to dev
if (!env) {
    console.log('Environment not defined, setting it to DEV');
    process.env.REACT_APP_ENVIRONMENT = 'DEV';
    env = 'DEV';
}
const homepage = env === 'DEV' ? 'http://localhost:3000' : 'https://angeld.xyz/babytracker/';

const packageJsonPath = path.resolve(__dirname, 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

packageJson.homepage = homepage;

fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
console.log(`Updated package.json homepage to ${homepage}`)