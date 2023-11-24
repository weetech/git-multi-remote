const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const { get_repo_url, remove_dir, console_current_repo, get_repo_name, get_repo_hash, CONFIG_FILE_NAME, read_config, list_repos } = require('../utils');
// const root = process.cwd();
// const git_dirs = get_git_dirs(root);

function addRepositoryAPI(root, git_dirs, repo) {
  // ~ Setup config file on existed repo if clone second repo.
  if (git_dirs.length == 1) {
    fs.writeFileSync(path.join(root, '.git', CONFIG_FILE_NAME), JSON.stringify({ id: 0, version: 'V1' }));    
  }

  const temp_dir = path.join(root, '.git.temp');
  // ~ Checking if the current directory is a Git repository. If it is not, then return.
  if (!fs.existsSync(path.join(root, '.git'))) {
    console.log(`fatal: not a git repository: .git at ${root}`);
    return;
  }

  // ~ Check local existence of repo
  if (git_dirs.includes(`.git.${get_repo_hash(repo)}`) || get_repo_hash(get_repo_url(root)) == get_repo_hash(repo)) {
    console.log('Repository already cloned');
    list_repos(root, git_dirs, repo, 33);
    return;
  }

  let new_repo_id = 0;
  git_dirs.forEach((dir) => {
    let id = read_config(root, dir).id;
    if (id + 1 > new_repo_id) {
      new_repo_id = id + 1;
    }
  });

  const current_repo = get_repo_hash(get_repo_url(root), '');

  // ~ Update current git folder name
  fs.renameSync(path.join(root, '.git'), path.join(root, '.git.' + get_repo_hash(get_repo_url(root), '')));

  // ~ Create temp folder
  if (!fs.existsSync(temp_dir)) {
    fs.mkdirSync(temp_dir);
  } else {
    remove_dir(temp_dir);
    fs.mkdirSync(temp_dir);
  }

  // ~ clone new git repo to temp folder.
  try {
    execSync(`cd .git.temp && git clone ${repo}`);
  } catch (error) {
    if (error) {
      remove_dir(temp_dir);
      fs.renameSync(path.join(root, '.git.' + current_repo), path.join(root, '.git'));
      console_current_repo();
      console.error('\n\n', error.message);
      return;
    }
  }

  // ~ Setup config file on new repo
  fs.writeFileSync(path.join(temp_dir, get_repo_name(repo), '.git', CONFIG_FILE_NAME), JSON.stringify({ id: new_repo_id, version: 'V1' }));

  // ~ Move new repo to current folder.
  fs.renameSync(path.join(temp_dir, get_repo_name(repo), '.git'), path.join(root, '.git'));

  // ~ Delete temp folder
  remove_dir(temp_dir);

  list_repos(root);
}

module.exports = addRepositoryAPI;
