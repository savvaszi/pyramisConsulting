const https = require('https');

const API = 'cms.pyramis.com.cy';
const TOKEN = 'RDX_1f69H6phPxbw2BI7zizBmDYJyBf1';

function req(path, method, body) {
  return new Promise((resolve) => {
    const data = body ? JSON.stringify(body) : '';
    const opts = {
      hostname: API, port: 443, path, method,
      rejectUnauthorized: false,
      headers: {
        'Authorization': 'Bearer ' + TOKEN,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
      }
    };
    const r = https.request(opts, (res) => {
      let b = '';
      res.on('data', d => b += d);
      res.on('end', () => {
        console.log('  ' + method + ' ' + path + ' -> ' + res.statusCode);
        try { resolve(JSON.parse(b)); } catch(e) { resolve(null); }
      });
    });
    r.on('error', () => resolve(null));
    if (data) r.write(data);
    r.end();
  });
}

async function run() {
  // Create pages fields
  const pFields = ['slug','hero_title','hero_subtitle','section_1_title','section_1_text','section_2_title','section_2_text'];
  for (const f of pFields) {
    const t = (f === 'hero_subtitle' || f === 'section_1_text' || f === 'section_2_text') ? 'text' : 'string';
    await req('/fields/pages', 'POST', { field: f, type: t });
  }

  // Public read for pages
  await req('/permissions', 'POST', { role: null, collection: 'pages', action: 'read', fields: ['*'] });

  // Seed pages
  const pages = [
    {
      slug: 'about_us',
      hero_title: 'The Silent Authority in Mediterranean Strategy',
      hero_subtitle: 'We don\'t just advise on the future. We architect it.',
      section_1_title: 'Our Heritage',
      section_1_text: 'Founded by former policymakers and tier-one consultants, Pyramis was built on a singular premise: the Eastern Mediterranean needed an advisory firm that combined geopolitical insight with rigorous corporate execution.',
      section_2_title: 'Our Philosophy',
      section_2_text: 'We operate at the intersection of law, finance, and geopolitics, delivering integrated advisory that goes beyond conventional consulting to shape the architecture of your enterprise.'
    },
    {
      slug: 'contact_us',
      hero_title: 'Initiate a Dialogue',
      hero_subtitle: 'Select engagements requiring absolute discretion and comprehensive strategic realignment.',
      section_1_title: 'Global Headquarters',
      section_1_text: 'Pyramis Plaza, Level 4, Makarios Ave, Limassol, Cyprus, CY-3030. Tel: +357 25 100 000'
    },
    {
      slug: 'detailed_services',
      hero_title: 'Architecting Enterprise Dominance',
      hero_subtitle: 'Our methodologies are designed for mid-to-large cap firms seeking aggressive expansion or structural turnarounds in volatile markets.',
      section_1_title: 'Corporate Strategy and M&A',
      section_1_text: 'Full-lifecycle transaction support from target identification to post-merger integration.',
      section_2_title: 'Tax Advisory',
      section_2_text: 'Sophisticated tax optimization leveraging Cyprus\'s favorable regulatory environment for maximum efficiency.'
    },
    {
      slug: 'services_overview',
      hero_title: 'A Full Spectrum of Advisory Services',
      hero_subtitle: 'From strategy conception to operational execution, we provide multi-disciplinary advisory across critical business functions.',
      section_1_title: 'Corporate and Structural Services',
      section_1_text: 'Company formation, corporate governance, board advisory, and organizational design.',
      section_2_title: 'Financial and Tax Services',
      section_2_text: 'International tax planning, IP structuring, transfer pricing, and regulatory compliance.'
    },
    {
      slug: 'insights_blog',
      hero_title: 'Insights and Analysis',
      hero_subtitle: 'Perspectives from the front lines of Mediterranean business strategy.',
      section_1_title: 'Strategy',
      section_1_text: 'Deep-dive analyses of market trends, regulatory shifts, and strategic opportunities across the Eastern Mediterranean.'
    }
  ];

  for (const p of pages) {
    await req('/items/pages', 'POST', p);
  }

  // Create blog_posts fields
  const bFields = ['slug','title','subtitle','content','author','date'];
  for (const f of bFields) {
    const t = (f === 'content' || f === 'subtitle') ? 'text' : 'string';
    await req('/fields/blog_posts', 'POST', { field: f, type: t });
  }

  // Public read for blog_posts
  await req('/permissions', 'POST', { role: null, collection: 'blog_posts', action: 'read', fields: ['*'] });

  // Seed blog post
  await req('/items/blog_posts', 'POST', {
    slug: 'navigating-global-resilience',
    title: 'Navigating Global Resilience: Why Full-Spectrum Advisory is the New Standard',
    subtitle: 'How mid-market enterprises are rethinking growth through integrated strategy and operations.',
    author: 'Marcus Thorne',
    date: 'October 24, 2024',
    content: 'The era of siloed consulting is over. As global markets transition from a period of relative stability into a landscape defined by rapid volatility, the traditional separation between strategy and execution has become a liability for mid-market enterprises.'
  });

  console.log('\nAll Directus content seeded!');
}

run();
