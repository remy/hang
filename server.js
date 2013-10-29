var url = require('url'),
    querystring = require('querystring'),
    fill = '@rem',
    api = [
      ' http://hang.leftlogic.com/file.type?[time in ms]&content=[optional content]&bytes=[optional bytes]&redirect=[optional 302 redirect]'
    ].join('\n'),
    commentTypes = {
      'js': ['/*\n ', '\n*/'],
      // no comments in JSON :(
      'css': ['/*\n ', '\n*/'],
      'html': ['<pre>\n ', '\n<pre>']
    };

require('http').createServer(function (req, res) {
  var parsedURL = url.parse(req.url),
      pathname = parsedURL.pathname,
      query = querystring.parse(parsedURL.query),
      time = query.time || parsedURL.query,
      redirect = query.redirect,
      type = pathname.indexOf('.') !== -1 ? pathname.replace(/^.*\.(.*?$)/, '$1') : 'html',
      commentTags = commentTypes[type] || null,
      comment = time ? time + 'ms\n' + api : 'zero hang time\n' + api,
      content = query.content || '',
      bytes = query.bytes || '';

  if (!redirect) {
    if (content === '' && commentTags !== null) {
      if (bytes === '') {
        content = commentTags[0] + comment + commentTags[1];
      } else {
        bytes = (query.bytes < 100000) ? parseInt(query.bytes, 10) : 100000;
        var fillString = Array(Math.floor(bytes/fill.length)+1).join(fill) + fill.substring(0, (bytes % fill.length));
        content = commentTags[0] + fillString + commentTags[1];
      }
    }

    res.writeHead(200, { 'content-type' : types[type] || 'text/html', 'Access-Control-Allow-Origin' : '*' });
  }

  if (time) {
    setTimeout(function () {
      if (redirect) {
        res.writeHead(302, { 'Location' : redirect });
        res.end();
      } else {
        res.end(content);
      }
    }, parseInt(time, 10));
  } else {
    res.end(content);
  }
}).listen(process.env.app_port || process.env.PORT || 8080);

var types = {
  'aiff': 'audio/x-aiff',
  'appcache': 'text/cache-manifest',
  'atom': 'application/atom+xml',
  'bmp': 'image/bmp',
  'crx': 'application/x-chrome-extension',
  'css': 'text/css',
  'eot': 'application/vnd.ms-fontobject',
  'gif': 'image/gif',
  'htc': 'text/x-component',
  'html': 'text/html',
  'ico': 'image/vnd.microsoft.icon',
  'ics': 'text/calendar',
  'jpeg': 'image/jpeg',
  'js': 'text/javascript',
  'json': 'application/json',
  'mathml': 'application/mathml+xml',
  'midi': 'audio/midi',
  'mov': 'video/quicktime',
  'mp3': 'audio/mpeg',
  'mp4': 'video/mp4',
  'mpeg': 'video/mpeg',
  'ogg': 'video/ogg',
  'otf': 'font/opentype',
  'pdf': 'application/pdf',
  'png': 'image/png',
  'rtf': 'application/rtf',
  'sh': 'application/x-sh',
  'svg': 'image/svg+xml',
  'swf': 'application/x-shockwave-flash',
  'tar': 'application/x-tar',
  'tiff': 'image/tiff',
  'ttf': 'font/truetype',
  'txt': 'text/plain',
  'wav': 'audio/x-wav',
  'webm': 'video/webm',
  'webp': 'image/webp',
  'woff': 'font/woff',
  'xhtml': 'application/xhtml+xml',
  'xml': 'text/xml',
  'xsl': 'application/xml',
  'xslt': 'application/xslt+xml',
  'zip': 'application/zip'
};

// 
