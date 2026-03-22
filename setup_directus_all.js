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
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(responseBody ? JSON.parse(responseBody) : null);
        } else {
          console.log(`Failed Request: ${method} ${path} -> ${responseBody}`);
          resolve(null); // Ignore errors so loop continues
        }
      });
    });

    req.on('error', e => resolve(null));
    if (body) req.write(data);
    req.end();
  });
}

async function run() {
  console.log('Creating "pages" collection');
  await request('/collections', 'POST', {
    collection: 'pages',
    schema: {},
    meta: { hidden: false }
  });

  const pageFields = [
    { field: 'slug', type: 'string' },
    { field: 'hero_title', type: 'string' },
    { field: 'hero_subtitle', type: 'text' },
    { field: 'section_1_title', type: 'string' },
    { field: 'section_1_text', type: 'text' },
    { field: 'section_2_title', type: 'string' },
    { field: 'section_2_text', type: 'text' }
  ];
  for (let f of pageFields) {
    await request('/fields/pages', 'POST', f);
  }

  // Permissions for pages (Public read)
  await request('/permissions', 'POST', {
    role: null, collection: 'pages', action: 'read', fields: ['*']
  });

  const initialPages = [
    {
      slug: 'about_us',
      hero_title: 'The Silent Authority in Mediterranean Strategy',
      hero_subtitle: 'We don’t just advise on the future. We architect it.',
      section_1_title: 'Our Heritage',
      section_1_text: 'Founded by former policymakers and tier-one consultants, Pyramis was built on a singular premise: the Eastern Mediterranean needed an advisory firm that combined geopolitical insight with rigorous corporate execution.'
    },
    {
      slug: 'contact_us',
      hero_title: 'Initiate a Dialogue',
      hero_subtitle: 'Select engagements requiring absolute discretion and comprehensive strategic realignment.',
      section_1_title: 'Global Headquarters',
      section_1_text: 'Pyramis Plaza, Level 4, Makarios Ave, Limassol, Cyprus, CY-3030'
    },
    {
      slug: 'detailed_services',
      hero_title: 'Architecting Enterprise Dominance',
      hero_subtitle: 'Our methodologies are designed for mid-to-large cap firms seeking aggressive expansion or structural turnarounds in volatile markets.',
      section_1_title: 'Corporate Strategy & M&A',
      section_1_text: 'Full-lifecycle transaction support from target identification to post-merger integration.'
    }
  ];

  for (let p of initialPages) {
    await request('/items/pages', 'POST', p);
  }

  console.log('Creating "blog_posts" collection');
  await request('/collections', 'POST', {
    collection: 'blog_posts',
    schema: {},
    meta: { hidden: false }
  });

  const blogFields = [
    { field: 'slug', type: 'string' },
    { field: 'title', type: 'string' },
    { field: 'subtitle', type: 'text' },
    { field: 'content', type: 'text' },
    { field: 'author', type: 'string' },
    { field: 'date', type: 'string' } // simple string for date format
  ];
  for (let f of blogFields) {
    await request('/fields/blog_posts', 'POST', f);
  }

  // Permissions for blog_posts (Public read)
  await request('/permissions', 'POST', {
    role: null, collection: 'blog_posts', action: 'read', fields: ['*']
  });

  await request('/items/blog_posts', 'POST', {
    slug: 'navigating-global-resilience',
    title: 'Navigating Global Resilience: Why Full-Spectrum Advisory is the New Standard',
    subtitle: 'How mid-market enterprises are rethinking growth through integrated strategy and operations.',
    author: 'Marcus Thorne',
    date: 'October 24, 2024',
    content: 'The era of siloed consulting is over. As global markets transition from a period of relative stability into a landscape defined by rapid volatility, the traditional separation between strategy and execution has become a liability for mid-market enterprises.'
  });

  console.log('Finished setup_all_pages.js');
}

run();
