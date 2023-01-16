// const fs = require('fs');
const path = require('path');
const { get_repo_url,  get_repo_name, remove_dir, list_repos } = require('../utils');
// const root = process.cwd();
// const git_dirs = get_git_dirs(root);
// const delete_repo_id = +process.argv[2];

function deleteRepositoryAPI(root, git_dirs, delete_repo_dir_name) {
  list_repos(root, git_dirs, get_repo_url(root, delete_repo_dir_name), 31);

  const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  readline.question(`Are you sure you want to delete Repository '\x1b[31m${get_repo_name(get_repo_url(root, delete_repo_dir_name))}\x1b[0m' [y/n]: `, (decision) => {
    if (decision.toLocaleLowerCase() == 'y' || decision.toLocaleLowerCase() == 'yes') {
      remove_dir(path.join(root, delete_repo_dir_name));
      list_repos(root);
    } else {
      console.log(`\x1b[33mDeletion of Repository '${get_repo_name(get_repo_url(root, delete_repo_dir_name))}' Aborted!!\x1b[0m`);
    }

    readline.close();
  });
}

module.exports = deleteRepositoryAPI;
