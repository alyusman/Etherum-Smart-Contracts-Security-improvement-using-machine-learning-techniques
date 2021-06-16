const smart = require('./smart-runner');

const run = async function (filePath) {
  let output = await smart.getResult(filePath);
  const solidityVars = [
    'SOLIDITY_VISIBILITY',
    'SOLIDITY_PRAGMAS_VERSION',
    'SOLIDITY_UPGRADE_TO_050',
    'SOLIDITY_CALL_WITHOUT_DATA',
    'SOLIDITY_REVERT_REQUIRE',
    'SOLIDITY_DEPRECATED_CONSTRUCTIONS',
    'SOLIDITY_UNCHECKED_CALL',
    'SOLIDITY_PRIVATE_MODIFIER_DONT_HIDE_DATA',
    'SOLIDITY_TX_ORIGIN',
    'SOLIDITY_OVERPOWERED_ROLE',
    'SOLIDITY_EXTRA_GAS_IN_LOOPS',
    'SOLIDITY_GAS_LIMIT_IN_LOOPS',
    'SOLIDITY_ADDRESS_HARDCODED',
    'SOLIDITY_ERC20_APPROVE',
    'SOLIDITY_SHOULD_NOT_BE_PURE',
    'SOLIDITY_USING_INLINE_ASSEMBLY',
    'SOLIDITY_ARRAY_LENGTH_MANIPULATION',
    'SOLIDITY_FUNCTIONS_RETURNS_TYPE_AND_NO_RETURN',
    'SOLIDITY_DIV_MUL',
    'SOLIDITY_LOCKED_MONEY',
  ];
  const filters = [
    'ruleId',
    'patternId',
    'severity',
    'line',
    'column',
    'content',
  ];
  const index = output.indexOf('ruleId');

  output = output.substring(index);
  const lines = output.split('\n');
  const lineObjects = [];
  let lineObj = {};
  let lastFilter = false;

  const varsObj = {};

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    for (let j = 0; j < filters.length; j++) {
      const filter = filters[j];
      if (line.includes(filter)) {
        lineObj[filter] = line.substring(line.indexOf(':') + 2);
        if (j == filters.length - 1) {
          lastFilter = true;
        }
      }
    }
    if (lastFilter) {
      lineObjects.push(lineObj);
      lineObj = {};
      lastFilter = false;
    }

    // ========== FOR EXTRACTING SUMMARY VALUES ==========
    for (let j = 0; j < solidityVars.length; j++) {
      const solidityVar = solidityVars[j];
      if (line.includes(`${solidityVar} :`)) {
        varsObj[solidityVar] = line.substring(line.indexOf(':') + 1);
      }
    }
  }
  // console.log(lineObjects);
  // console.log(varsObj);
  const solidityVarsObj = {};
  for (let i = 0; i < solidityVars.length; i++) {
    const solidityVar = solidityVars[i];
    solidityVarsObj[solidityVar] = 0;
  }

  // eslint-disable-next-line no-restricted-syntax
  for (const [key, value] of Object.entries(varsObj)) {
    solidityVarsObj[key] = (+value);
  }

  let csvString = '';
  // eslint-disable-next-line no-restricted-syntax
  for (const [key, value] of Object.entries(solidityVarsObj)) {
    csvString += `${value},`;
  }
  csvString = csvString.replace(/(^,)|(,$)/g, '');
  // console.log(solidityVarsObj);
  // console.log(csvString);
  return { csvString, lineObjects };
};

module.exports = {
  run,
};
