const fs = require('fs');
const path = require('path');
const { get_repo_url, get_repo_hash, list_repos } = require('../utils');
// const root = process.cwd();
// const git_dirs = get_git_dirs(root);
// const switch_to_id = +process.argv[2];

function switchRepositoryAPI(root, git_dirs, switch_to_dir_name) {
  // ~ Rename Current git folder
  fs.renameSync(path.join(root, '.git'), path.join(root, '.git.' + get_repo_hash(get_repo_url(root), '')));

  // ~ Rename new git folder
  fs.renameSync(path.join(root, switch_to_dir_name), path.join(root, '.git'));

  list_repos(root);
}
module.exports = switchRepositoryAPI;
