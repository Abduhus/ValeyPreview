const ts = require('typescript');
const path = require('path');

// Read the tsconfig.build.json file
const configPath = path.join(__dirname, 'tsconfig.build.json');
const configFile = ts.readConfigFile(configPath, ts.sys.readFile);

if (configFile.error) {
  console.error('Error reading config file:', configFile.error);
  process.exit(1);
}

// Parse the config
const parsedConfig = ts.parseJsonConfigFileContent(
  configFile.config,
  ts.sys,
  path.dirname(configPath)
);

console.log('Parsed config:', JSON.stringify(parsedConfig, null, 2));

// Check what files would be included
console.log('Files to include:', parsedConfig.fileNames);

// Check compiler options
console.log('Compiler options:', parsedConfig.options);