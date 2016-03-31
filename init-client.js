#!/usr/bin/env node

'use strict';

let huejay = require('Huejay');
let credentials = require('./credentials.json');

let client = new huejay.Client(credentials);

client.users.get()
  .then(user => {
    console.log('Username:', user.username);
    console.log('Device type:', user.deviceType);
    console.log('Create date:', user.created);
    console.log('Last use date:', user.lastUsed);
  });

module.exports = client;