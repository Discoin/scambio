const base = require('@jonahsnider/xo-config');

const config = {...base};

config.rules['unicorn/prefer-node-protocol'] = 'off';
config.rules['import/extensions'] = 'off';

module.exports = config;
