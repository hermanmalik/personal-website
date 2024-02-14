
logistics:
- set up ssg
  - options: eleventy, pug, hugo, next.js 
  - musa uses gulp with pug, has bin/build_and_publish and gulpfile.js
  - we want to avoid lots of js, large npm dependency tree, etc, something simple instead
  - set up build environment
  - node stuff (need to figure out). musa has small package.json with large package_lock (npm) / yarn_lock (yarn)
- apache stuff needs to be figured out in the cloudflare setting?
  - htaccess or httpf file, which allows 404.html and nice redirects
  - in cloudflare there are limited redirect rules
- LICENSE.txt, README.md, robots.txt,  
- musa also has site.webmanifest, favicon.ico, browserconfig.xml, .editorconfig, .gitattributes (in public_html) and musa-website.iml outside
- write up setup details

actual content:
  - some pages
  - css: normalize.css + main stylesheet
  - js: darkmode, menu?, jquery?, modernizr?, 
