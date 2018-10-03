/**
 * Passbolt Search Command
 *
 * @copyright (c) 2018 Passbolt SARL
 * @licence AGPL-3.0 http://www.gnu.org/licenses/agpl-3.0.en.html
 */
"use strict";

var program = require('commander');
var ResourceController = require('./app/controllers/resourceController.js');
var ResourceIndexView = require('./app/views/resources/index.js');

/**
 * Index.js
 */
program
  .usage('[options]', 'Search and list resources')
  .option('-u, --fingerprint <fingerprint>', 'The user key fingerprint to authenticate with')
  .option('-p, --passphrase <passphrase>', 'The key passphrase')
  .option('-v, --verbose', 'Display additional debug information')
  .option('-f, --filter [search]', 'Filter resource by search term', function(filter) {
    return filter.toLowerCase();
  })
  .option('-i, --uuid', 'Display only UUID')
  .parse(process.argv);


const filter = typeof program.filter === 'string' ? program.filter : '';
const resourceController = new ResourceController(program, process.argv);

resourceController
  .login()
  .then(function(){
    return resourceController.index();
  })
  .then(function(data) {
    var view = new ResourceIndexView(data, filter, program.uuid);
    view.render();
    process.exit(0);
  })
  .catch(function(err) {
    resourceController.error(err);
  });
