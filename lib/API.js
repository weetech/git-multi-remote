const fs = require('fs');
const path = require('path');
const addRepositoryAPI = require('./API/add');
const deleteRepositoryAPI = require('./API/delete');
const switchRepositoryAPI = require('./API/switch');
const { list_repos, get_git_dirs, read_config } = require('./utils');

class GMR {
  root = process.cwd();
  git_dirs = get_git_dirs(this.root);

  listRepositories() {
    list_repos(this.root, this.git_dirs);
  }

  addRepository(repository) {
    addRepositoryAPI(this.root, this.git_dirs, repository);
  }

  switchRepository(repositoryId) {
    const id_repo_dir_name = this.validateRepositoryId(repositoryId);
    if (id_repo_dir_name) {
      switchRepositoryAPI(this.root, this.git_dirs, id_repo_dir_name ? id_repo_dir_name : this.git_dirs[0] == '.git' ? this.git_dirs[1] : this.git_dirs[0]);
    }
  }

  deleteRepository(repositoryId) {
    const id_repo_dir_name = this.validateRepositoryId(repositoryId, true);
    if (id_repo_dir_name) {
      deleteRepositoryAPI(this.root, this.git_dirs, id_repo_dir_name);
    }
  }

  validateRepositoryId(id, required = false) {
    // ~ Checking if the current directory is a Git repository. If it is not, then return.
    if (!fs.existsSync(path.join(this.root, '.git'))) {
      console.log(`fatal: not a git repository: .git at ${this.root}`);
      return false;
    }

    // ~ Checking multiple repo is cloned
    if (this.git_dirs.length == 1) {
      console.log(`Unable to found another repo at ${this.root}`);
      list_repos(this.root, this.git_dirs);
      return false;
    }

    // ~ Checking is Repository provided
    if (required && id == undefined) {
      console.log(`Please specify Repository id`);
      return false;
    }

    // ~ Find repo with specified id
    let id_repo_dir_name = this.git_dirs.find((dir) => read_config(this.root, dir).id == id);
    if (id_repo_dir_name == undefined && id != undefined) {
      console.log(`Not found a repo with id '${id}'`);
      list_repos(this.root, this.git_dirs);
      return false;
    }

    // ~ check is Switch to id is current repo
    if (id_repo_dir_name == '.git') {
      console.log('You are already at', id);
      list_repos(this.root, this.git_dirs);
      return false;
    }
    return id_repo_dir_name;
  }
}

module.exports = GMR;
