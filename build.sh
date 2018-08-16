#!/bin/sh
cd /src
npm install
npm install sass-loader node-sass webpack --save-dev
npm install style-loader css-loader --save-dev
npm install -D postacss-loader
npm install highlight.js --save
npm run build
cp -r dist/* /usr/share/nginx/html/
rm -rf node_modules dist/*