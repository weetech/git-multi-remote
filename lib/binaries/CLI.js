const pkg = require('../../package.json');
const commander = require('commander');
const GMR = require('../API');

var gmr = new GMR();

commander.name('gmr').description(pkg.description).version(pkg.version);

commander
  .command('list')
  .description('List all cloned repositories with Repository IDs.')
  .action(() => {
    gmr.listRepositories();
  });

commander
  .command('add')
  .description('Cloned a new git repository in the current working directory.')
  .argument('<GIT_PROJECT_URL>', 'GIT PROJECT URL')
  .action((repository) => {
    gmr.addRepository(repository);
  });

commander
  .command('switch')
  .description('Switch to a different remote repository by repository id.')
  .argument('[Repository_ID]', 'Repository ID')
  .action((repositoryId) => {
    gmr.switchRepository(+repositoryId);
  });

commander
  .command('delete')
  .description('Delete a cloned git repository by repository id.')
  .argument('<Repository_ID>', 'Repository ID')
  .action((repositoryId) => {
    gmr.deleteRepository(+repositoryId);
  });

commander.parse();
