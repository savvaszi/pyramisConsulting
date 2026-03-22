const https = require('https');
const fs = require('fs');

const screens = [
  {
    title: 'Pyramis - Landing Page',
    filename: 'index.html',
    url: 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzAzOGY3MGRmYzYyYzRlZTZiODExMmViNTZhNmNjOTMwEgsSBxDplfj2iA0YAZIBJAoKcHJvamVjdF9pZBIWQhQxMjUzODU2MzI2MTA1NTU1MjA0Nw&filename=&opi=89354086'
  },
  {
    title: 'Pyramis - Single Blog Post',
    filename: 'single_blog_post.html',
    url: 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzExNjc1Y2Y1MGM0YTQ1NDE5YjI0NDNhMzNiYTY3MDlmEgsSBxDplfj2iA0YAZIBJAoKcHJvamVjdF9pZBIWQhQxMjUzODU2MzI2MTA1NTU1MjA0Nw&filename=&opi=89354086'
  },
  {
    title: 'Pyramis - Services Overview',
    filename: 'services_overview.html',
    url: 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sX2MxMmMzZmM4Mjc2ZTQxMmY5Y2UzNDczYWU5NGYxNmQxEgsSBxDplfj2iA0YAZIBJAoKcHJvamVjdF9pZBIWQhQxMjUzODU2MzI2MTA1NTU1MjA0Nw&filename=&opi=89354086'
  },
  {
    title: 'Pyramis - Detailed Services',
    filename: 'detailed_services.html',
    url: 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sX2NlODViM2YxYzcyZjRhNWM5NDI0MDhhMDhiY2Y0OGQxEgsSBxDplfj2iA0YAZIBJAoKcHJvamVjdF9pZBIWQhQxMjUzODU2MzI2MTA1NTU1MjA0Nw&filename=&opi=89354086'
  },
  {
    title: 'Pyramis - Insights & Blog',
    filename: 'insights_&_blog.html',
    url: 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sX2I3YTRkZDllNDZkYzRmMDFiYTQyZDk1NWE5MWQ3MjdkEgsSBxDplfj2iA0YAZIBJAoKcHJvamVjdF9pZBIWQhQxMjUzODU2MzI2MTA1NTU1MjA0Nw&filename=&opi=89354086'
  },
  {
    title: 'Pyramis - About Us',
    filename: 'about_us.html',
    url: 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzFmZDcyZGJlYTVlZjRjMDZiNzkwMzc2NjQ4ODhhMjhiEgsSBxDplfj2iA0YAZIBJAoKcHJvamVjdF9pZBIWQhQxMjUzODU2MzI2MTA1NTU1MjA0Nw&filename=&opi=89354086'
  },
  {
    title: 'Pyramis - Contact Us',
    filename: 'contact_us.html',
    url: 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzY1N2ViZjIyOTk3MjQxNzk4ZGZkY2I4YTAxNjczY2MyEgsSBxDplfj2iA0YAZIBJAoKcHJvamVjdF9pZBIWQhQxMjUzODU2MzI2MTA1NTU1MjA0Nw&filename=&opi=89354086'
  },
  {
    title: 'Pyramis - Modern Landing Page',
    filename: 'modern_landing_page.html',
    url: 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzc2YTY2MGQ1YzUzZTRkYTY4MTdhNzZiZTZmZGVjYjM2EgsSBxDplfj2iA0YAZIBJAoKcHJvamVjdF9pZBIWQhQxMjUzODU2MzI2MTA1NTU1MjA0Nw&filename=&opi=89354086'
  }
];

function download(url, filename) {
  return new Promise((resolve) => {
    const urlObj = new URL(url);
    const options = {
      hostname: urlObj.hostname,
      path: urlObj.pathname + urlObj.search,
      method: 'GET',
      headers: { 'User-Agent': 'Mozilla/5.0' }
    };
    https.get(options, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        return download(res.headers.location, filename).then(resolve);
      }
      let body = '';
      res.on('data', d => body += d);
      res.on('end', () => {
        fs.writeFileSync(filename, body, 'utf8');
        console.log('Saved', filename, '(' + body.length + ' bytes)');
        resolve();
      });
    }).on('error', e => {
      console.error('Failed', filename, e.message);
      resolve();
    });
  });
}

(async () => {
  for (const s of screens) {
    await download(s.url, s.filename);
  }
  console.log('All downloads complete!');
})();
