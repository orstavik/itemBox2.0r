const http = require('http');
const https = require('https');
const fs = require('fs');
const url = require('url');
const storage = require('@google-cloud/storage')();
const UglifyES = require('uglify-es');

// ----------STREAMS----------

// myReadStream.on('data', (chunk) => {
//     console.log('new chunk received');
//     myWriteStream.write(chunk);
// });

// myReadStream.pipe(myWriteStream);

// ----------SERVER----------

const server = http.createServer((request, response) => {
  const parsedUrl = parseUrl(request.url);
  if (parsedUrl) {
    const bucket = storage.bucket("robotpad-762de.appspot.com");
    const bucketFile = bucket.file(parsedUrl.bucketPath);
    bucketFile.exists().then((exists) => {
      if (exists[0]) {
        response.writeHead(301, { Location: parsedUrl.bucketUrl });
        response.end();
      } else {
        const contentType = checkType(parsedUrl.file);
        response.writeHead(308, { 'Content-Type': contentType });
        https.get(parsedUrl.rawUrl, (res) => {
          res.pipe(bucketFile.createWriteStream({
              public: true,
              metadata: {
                contentType: contentType,
                contentDisposition: 'inline'
              }
            }))
            .on("error", (err) => {
              response.end(err);
            })
            .on("finish", () => {
              response.writeHead(301, { Location: parsedUrl.bucketUrl });
              response.end();
            });
        });
      }
    });
  } else {
    response.end('Wrong Url!');
  }
}).listen(3000);

const parseUrl = (link) => {
  // https://gitlab.com/enlightenmentor/justDiary/raw/master/manifest.json
  // https://raw.githubusercontent.com/enlightenmentor/ultimate-shell/master/manifest.json
  // https://codepen.io/enlightenmentor/pen/prGRgd.js

  // /$service/$user/$project/$branch/$path
  const p = {};
  const parts = link.split('/').filter(part => !!part.length);
  if (parts.length < 3)
    return null;

  p.user = parts[1];
  p.file = parts[parts.length - 1];
  const fileParts = p.file.split('.');
  const minified = fileParts[fileParts.length - 2];
  const ext = fileParts[fileParts.length-1];
  if (minified === 'min' && ext === 'js') {
    p.minified = true;
    p.minFile = p.file;
    p.file = p.file.replace('.min','');
  } else {
    p.minified = false;
  }
  if (parts[0] === 'codepen') {
    p.base = 'https://codepen.io';
    p.project = parts[parts.length - 1].split('.')[0];
    p.rawUrl = `${p.base}/${p.user}/pen/${p.file}`;
    if (p.minified) {
      p.bucketPath = `${parts[0]}/${p.user}/${p.minFile}`;
    } else {
      p.bucketPath = `${parts[0]}/${p.user}/${p.file}`;
    }
  } else {
    p.project = parts[2];
    p.branch = parts[3];
    p.path = parts.slice(4, -1).join('/');
    if (p.minified) {
      p.bucketPath = `${parts[0]}/${p.user}/${p.project}/${p.branch}/${p.path}/${p.minFile}`;
    } else {
      p.bucketPath = `${parts[0]}/${p.user}/${p.project}/${p.branch}/${p.path}/${p.file}`;
    }
    if (parts[0] === 'github') {
      p.base = 'https://raw.githubusercontent.com';
      p.rawUrl = `${p.base}/${p.user}/${p.project}/${p.branch}/${p.path}/${p.file}`;
    } else if (parts[0] === 'gitlab') {
      p.base = 'https://gitlab.com';
      p.rawUrl = `${p.base}/${p.user}/${p.project}/raw/${p.branch}/${p.path}/${p.file}`;
    }
  }
  p.bucketUrl = `https://storage.googleapis.com/robotpad-762de.appspot.com/${p.bucketPath}`;
  return p;
}

const checkType = (name) => {
  const ext = name.split('.').pop();
  switch (ext) {
    case 'css':
      return 'text/css';
    case 'html':
      return 'text/html';
    case 'js':
      return 'application/javascript';
    case 'json':
      return 'application/json';
  }
}