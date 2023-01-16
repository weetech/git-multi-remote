const pkg = require('../../package.json');
const commander = require('commander');
const GMR = require('../API');

var gmr = new GMR();

commander.name('gmr').description(pkg.description).version(pkg.version);

commander
  .command('list')
  .description('List all cloned repositories with Repository IDs.')
  .action((options, command) => {
    gmr.listRepositories();
  });

commander
  .command('add')
  .description('Cloned a new git repository in the current working directory.')
  .arguments('<GIT_PROJECT_URL>')
  .action((repository, options, command) => {
    gmr.addRepository(repository);
  });

commander
  .command('switch')
  .description('Switch to a different remote repository by repository id.')
  .arguments('<Repository_ID>')
  .action((repositoryId, options, command) => {
    gmr.switchRepository(+repositoryId);
  });

commander
  .command('delete')
  .description('Delete a cloned git repository by repository id.')
  .arguments('<Repository_ID>')
  .action((repositoryId, options, command) => {
    gmr.deleteRepository(+repositoryId);
  });

commander.parse();
