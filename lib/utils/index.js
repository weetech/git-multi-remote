const fs = require('fs');
const path = require('path');
const md5 = require('md5');
const Table = require('cli-tableau');

const CONFIG_FILE_NAME = '.gmr';

function get_current_head(root, remote) {
  let head = fs.readFileSync(path.join(root, remote ? remote : '.git', 'HEAD'), 'utf-8').trim();

  if (head.startsWith('ref:')) {
    return head.split('/').pop();
  }
  return head.slice(0, 8);
}

function get_repo_url(root, remote) {
  var urls = '';
  for (const line of fs.readFileSync(path.join(root, remote ?? '.git', 'config'), 'utf-8').split('\n')) {
    if (line.includes('url')) {
      urls += `${line.split('=')[1].trim()}\n`;
    }
  }
  return urls ? urls.trim() : `local@local:${require('os').userInfo().username}/${path.basename(root)}.git`;
}

function get_repo_host(url) {
  if (url.includes('\n')) {
    return url
      .split('\n')
      .map((u) => get_repo_host(u))
      .join('\n');
  }

  if (url.startsWith('git@')) {
    return url.split(':')[0].replace('git@', '');
  } else if (url.startsWith('local@')) {
    return url.split(':')[0].replace('local@', '');
  } else {
    return url.split('//')[1].split('/')[0];
  }
}

const get_repo_name = (url, replaceWith) =>
  url.includes('\n')
    ? url
        .split('\n')
        .map((u) => get_repo_name(u))
        .join('\n')
    : url
        .split('/')
        .pop()
        .replace(replaceWith == undefined ? '.git' : replaceWith, '');

const get_repo_hash = (url) => (url.includes('\n') ? get_repo_hash(url.split('\n')[0]) : md5(get_repo_host(url) + get_repo_name(url)).slice(0, 8));

const read_config = (root, remote) => {
  try {
    return JSON.parse(fs.readFileSync(path.join(root, remote ?? '.git', CONFIG_FILE_NAME)));
  } catch (error) {
    return { id: '-' };
  }
};

const remove_dir = (dir) =>
  fs.rmSync(dir, { recursive: true }, (err) => {
    if (err) {
      throw err;
    }
    console.log(`${dir} is deleted!`);
  });

const get_git_dirs = (root) =>
  fs
    .readdirSync(root, { withFileTypes: true })
    .filter((file) => file.isDirectory() && (file.name.startsWith('.git.') || file.name.startsWith('.git')))
    .map((dir) => dir.name);

function console_current_repo() {
  console.info('\nCurrent remote repo is ' + get_repo_url(process.cwd()));
}

// ~ List Repositories
const trim = (text, length) =>
  !text.includes('\n')
    ? text.length + 1 >= length
      ? `${text}`.slice(0, length - 3) + '…'
      : text
    : text
        .split('\n')
        .map((t) => trim(t, length))
        .join('\n');

function list_repos(root, git_dirs = get_git_dirs(root), highlight_url, color) {
  // ~ To get width of console.
  // const CONDENSED_MODE = (process.stdout.columns || 300) < 120;
  // name_col_size = list.reduce((p, c) => (p.name.length > c.name.length ? p : c)).name.length +5;
  // var name_col_size = 11;
  var compact = true;
  const app_head = {
    id: 5,
    'Remote Repos': 50,
    Host: 15,
    Name: 20,
    Head: 15,
  };

  const rawData = git_dirs
    .map((dir) => {
      let url = get_repo_url(root, dir);
      if (url.includes('\n')) compact = false;
      let id = read_config(root, dir).id;
      let host = get_repo_host(url);
      let name = get_repo_name(url);
      let head = get_current_head(root, dir);

      return {
        id,
        url,
        dir,
        data: [id, trim(url.startsWith('local@') ? '-' : url, app_head['Remote Repos']), trim(host, app_head['Host']), trim(name, app_head['Name']), trim(head, app_head['Head'])],
      };
    })
    .sort((a, b) => a.id - b.id);

  const app_table = new Table({
    head: Object.keys(app_head),
    colWidths: Object.keys(app_head).map((k) => app_head[k]),
    colAligns: ['left'],
    style: { 'padding-left': 1, head: ['cyan', 'bold'], compact: compact },
  });

  if (git_dirs.length == 0) {
    console.log(`Unable to found another repo at ${root}`);
    return;
  }

  rawData.forEach((row) => {
    let format = row.dir == '.git' ? `\x1b[32m%s\x1b[0m` : '%s';
    if (highlight_url && get_repo_hash(highlight_url) == get_repo_hash(row.url)) {
      format = `\x1b[${color}m%s\x1b[0m`;
    }
    app_table.push(
      row.data.map((col) =>
        !`${col}`.includes('\n')
          ? format.replace('%s', col)
          : col
              .split('\n')
              .map((c) => format.replace('%s', c))
              .join('\n'),
      ),
    );
  });

  console.log(app_table.toString());
  console.log('\n');
}

module.exports = {
  CONFIG_FILE_NAME,
  get_repo_url,
  remove_dir,
  get_git_dirs,
  console_current_repo,
  get_repo_host,
  get_repo_name,
  get_current_head,
  get_repo_hash,
  read_config,
  list_repos,
};
