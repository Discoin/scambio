const base = require('@jonahsnider/xo-config');

const config = {...base};

config['unicorn/prefer-node-protocol'] = 'off';

module.exports = config;
