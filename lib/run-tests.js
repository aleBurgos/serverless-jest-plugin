'use strict';

const runCLI = require('jest').runCLI;
const BbPromise = require('bluebird');
const { setEnv } = require('./utils');

const runTests = (serverless, options, conf) => new BbPromise((resolve, reject) => {
  const functionName = options.function;
  const allFunctions = serverless.service.getAllFunctions();
  const config = Object.assign({ testEnvironment: 'node' }, conf);

  const vars = new serverless.classes.Variables(serverless);
  vars.populateService(options);
  allFunctions.forEach(name => setEnv(serverless, name));

  if (functionName) {
    if (allFunctions.indexOf(functionName) >= 0) {
      setEnv(serverless, functionName);
     
    } else {
      return reject(`Function "${functionName}" not found`);
    }
  }

  return runCLI({ config },
    serverless.config.servicePath,
    success => resolve(success));
});

module.exports = runTests;
