// hello_algolia.js
const algoliasearch = require('algoliasearch')

// Connect and authenticate with your Algolia app
const client = algoliasearch('RI8SSP5F2Z', 'c9a27987e6d30a19d9dddfc6a22fbaba')

// Create a new index and add a record
export const searchIndex = client.initIndex('hodo-users-index')

// Search the index and print the results