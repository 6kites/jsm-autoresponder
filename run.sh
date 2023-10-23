#!/bin/sh

export NVM_DIR=$HOME/.nvm;

if [ -d "${NVM_DIR}" ]; then
  echo "Using nvm in your system"
  source $NVM_DIR/nvm.sh;
else
  echo "Using system's default node.js"
fi

echo "Building React apps...\n"
npm install 
npm install --prefix static/issue-panel
npm run --prefix static/issue-panel build
npm install --prefix static/admin-page
npm run --prefix static/admin-page build
npm install --prefix static/project-settings-page
npm run --prefix static/project-settings-page build

exit 1
