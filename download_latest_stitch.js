const https = require('https');
const fs = require('fs');

// Fresh URLs from Stitch (fetched 2026-03-22)
const screens = [
  {
    filename: 'index.html',
    url: 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzAzOGY3MGRmYzYyYzRlZTZiODExMmViNTZhNmNjOTMwEgsSBxDplfj2iA0YAZIBJAoKcHJvamVjdF9pZBIWQhQxMjUzODU2MzI2MTA1NTU1MjA0Nw&filename=&opi=89354086'
  },
  {
    filename: 'detailed_services.html',
    url: 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sX2NlODViM2YxYzcyZjRhNWM5NDI0MDhhMDhiY2Y0OGQxEgsSBxDplfj2iA0YAZIBJAoKcHJvamVjdF9pZBIWQhQxMjUzODU2MzI2MTA1NTU1MjA0Nw&filename=&opi=89354086'
  },
  {
    filename: 'about_us.html',
    url: 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzFmZDcyZGJlYTVlZjRjMDZiNzkwMzc2NjQ4ODhhMjhiEgsSBxDplfj2iA0YAZIBJAoKcHJvamVjdF9pZBIWQhQxMjUzODU2MzI2MTA1NTU1MjA0Nw&filename=&opi=89354086'
  },
  {
    filename: 'contact_us.html',
    url: 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzY1N2ViZjIyOTk3MjQxNzk4ZGZkY2I4YTAxNjczY2MyEgsSBxDplfj2iA0YAZIBJAoKcHJvamVjdF9pZBIWQhQxMjUzODU2MzI2MTA1NTU1MjA0Nw&filename=&opi=89354086'
  },
  {
    filename: 'insights_blog.html',
    url: 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sX2I3YTRkZDllNDZkYzRmMDFiYTQyZDk1NWE5MWQ3MjdkEgsSBxDplfj2iA0YAZIBJAoKcHJvamVjdF9pZBIWQhQxMjUzODU2MzI2MTA1NTU1MjA0Nw&filename=&opi=89354086'
  },
  {
    filename: 'single_blog_post.html',
    url: 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzExNjc1Y2Y1MGM0YTQ1NDE5YjI0NDNhMzNiYTY3MDlmEgsSBxDplfj2iA0YAZIBJAoKcHJvamVjdF9pZBIWQhQxMjUzODU2MzI2MTA1NTU1MjA0Nw&filename=&opi=89354086'
  }
];

function download(url, filename) {
  return new Promise((resolve) => {
    const u = new URL(url);
    const opts = { hostname: u.hostname, path: u.pathname + u.search, method: 'GET', headers: { 'User-Agent': 'Mozilla/5.0' } };
    https.get(opts, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        return download(res.headers.location, filename).then(resolve);
      }
      let body = '';
      res.on('data', d => body += d);
      res.on('end', () => {
        fs.writeFileSync(filename, body, 'utf8');
        console.log('OK ' + filename + ' (' + (body.length / 1024).toFixed(1) + ' KB)');
        resolve();
      });
    }).on('error', e => { console.error('FAIL ' + filename + ' - ' + e.message); resolve(); });
  });
}

(async () => {
  for (const s of screens) { await download(s.url, s.filename); }
  console.log('Done!');
})();
