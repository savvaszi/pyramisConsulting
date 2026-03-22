const https = require('https');

const API_URL = 'cms.pyramis.com.cy';
const TOKEN = 'RDX_1f69H6phPxbw2BI7zizBmDYJyBf1';

function request(path, method, body = null) {
  return new Promise((resolve, reject) => {
    const data = body ? JSON.stringify(body) : '';
    const options = {
      hostname: API_URL,
      port: 443,
      path: path,
      method: method,
      rejectUnauthorized: false,
      headers: {
        'Authorization': `Bearer ${TOKEN}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
      }
    };
    const req = https.request(options, (res) => {
      let responseBody = '';
      res.on('data', d => responseBody += d);
      res.on('end', () => {
        try { resolve({ status: res.statusCode, body: responseBody ? JSON.parse(responseBody) : null }); }
        catch(e) { resolve({ status: res.statusCode, body: responseBody }); }
      });
    });
    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });
}

async function main() {
  // 1. Add 'category' field to blog_posts
  console.log('Creating category field...');
  let r = await request('/fields/blog_posts', 'POST', {
    field: 'category',
    type: 'string',
    schema: { data_type: 'character varying', max_length: 255, is_nullable: true },
    meta: { interface: 'input', width: 'half' }
  });
  console.log('category:', r.status, JSON.stringify(r.body).substring(0, 120));

  // 2. Add 'excerpt' field to blog_posts (may already exist)
  console.log('Creating excerpt field...');
  r = await request('/fields/blog_posts', 'POST', {
    field: 'excerpt',
    type: 'text',
    schema: { data_type: 'text', is_nullable: true },
    meta: { interface: 'input-multiline', width: 'full' }
  });
  console.log('excerpt:', r.status, JSON.stringify(r.body).substring(0, 120));

  // 3. Update each post with category + excerpt
  const updates = [
    {
      id: 3,
      category: 'Strategy',
      excerpt: 'Traditional long-horizon planning has collapsed under the weight of volatility. How leading organisations are adopting adaptive strategy frameworks.'
    },
    {
      id: 4,
      category: 'Operations',
      excerpt: 'Supply chain disruptions, geopolitical shifts, and inflationary pressure have redefined operational excellence. The key levers organisations must activate.'
    },
    {
      id: 5,
      category: 'Digital',
      excerpt: 'Most digital transformation programmes fail not because of technology, but because of misaligned incentives. What separates genuine transformation from costly theatre.'
    },
    {
      id: 6,
      category: 'Finance',
      excerpt: 'Cyprus has quietly become one of the most compelling jurisdictions for international holding structures. The structural drivers behind this strategic shift.'
    }
  ];

  for (const u of updates) {
    r = await request(`/items/blog_posts/${u.id}`, 'PATCH', { category: u.category, excerpt: u.excerpt });
    console.log(`Post ${u.id} updated: ${r.status}`);
  }

  console.log('Done.');
}

main().catch(console.error);
