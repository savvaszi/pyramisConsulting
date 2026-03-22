const fs = require('fs');

// Map each file to its CMS configuration
const pageConfig = [
  {
    file: 'index.html',
    type: 'singleton',
    collection: 'home_page',
    mapping: `
      if (d.hero_title) setEl('h1', d.hero_title);
      if (d.hero_subtitle) setEl('header p', d.hero_subtitle);
      const h3s = document.querySelectorAll('section h3');
      const descs = document.querySelectorAll('section p');
      if (d.service_1_title && h3s[0]) h3s[0].innerText = d.service_1_title;
      if (d.service_1_description && descs[0]) descs[0].innerText = d.service_1_description;
      if (d.service_2_title && h3s[1]) h3s[1].innerText = d.service_2_title;
      if (d.service_2_description && descs[1]) descs[1].innerText = d.service_2_description;
      if (d.service_3_title && h3s[2]) h3s[2].innerText = d.service_3_title;
      if (d.service_3_description && descs[2]) descs[2].innerText = d.service_3_description;
    `
  },
  {
    file: 'about_us.html',
    type: 'pages',
    slug: 'about_us',
    mapping: `
      if (d.hero_title) setEl('h1', d.hero_title);
      if (d.hero_subtitle) setEl('header p', d.hero_subtitle);
      const h2s = document.querySelectorAll('main h2');
      const ps = document.querySelectorAll('main p');
      if (d.section_1_title && h2s[0]) h2s[0].innerText = d.section_1_title;
      if (d.section_1_text && ps[0]) ps[0].innerText = d.section_1_text;
      if (d.section_2_title && h2s[1]) h2s[1].innerText = d.section_2_title;
      if (d.section_2_text && ps[1]) ps[1].innerText = d.section_2_text;
    `
  },
  {
    file: 'contact_us.html',
    type: 'pages',
    slug: 'contact_us',
    mapping: `
      if (d.hero_title) setEl('h1', d.hero_title);
      if (d.hero_subtitle) setEl('header p', d.hero_subtitle);
      const h2s = document.querySelectorAll('main h2');
      const ps = document.querySelectorAll('main p');
      if (d.section_1_title && h2s[0]) h2s[0].innerText = d.section_1_title;
      if (d.section_1_text && ps[0]) ps[0].innerText = d.section_1_text;
    `
  },
  {
    file: 'detailed_services.html',
    type: 'pages',
    slug: 'detailed_services',
    mapping: `
      if (d.hero_title) setEl('h1', d.hero_title);
      if (d.hero_subtitle) setEl('header p', d.hero_subtitle);
      const h2s = document.querySelectorAll('main h2');
      const ps = document.querySelectorAll('main p');
      if (d.section_1_title && h2s[0]) h2s[0].innerText = d.section_1_title;
      if (d.section_1_text && ps[0]) ps[0].innerText = d.section_1_text;
      if (d.section_2_title && h2s[1]) h2s[1].innerText = d.section_2_title;
      if (d.section_2_text && ps[1]) ps[1].innerText = d.section_2_text;
    `
  },
  {
    file: 'services_overview.html',
    type: 'pages',
    slug: 'services_overview',
    mapping: `
      if (d.hero_title) setEl('h1', d.hero_title);
      if (d.hero_subtitle) setEl('header p', d.hero_subtitle);
      const h2s = document.querySelectorAll('main h2');
      const ps = document.querySelectorAll('main p');
      if (d.section_1_title && h2s[0]) h2s[0].innerText = d.section_1_title;
      if (d.section_1_text && ps[0]) ps[0].innerText = d.section_1_text;
      if (d.section_2_title && h2s[1]) h2s[1].innerText = d.section_2_title;
      if (d.section_2_text && ps[1]) ps[1].innerText = d.section_2_text;
    `
  },
  {
    file: 'insights_&_blog.html',
    type: 'pages',
    slug: 'insights_blog',
    mapping: `
      if (d.hero_title) setEl('h1', d.hero_title);
      if (d.hero_subtitle) setEl('header p', d.hero_subtitle);
      const h2s = document.querySelectorAll('main h2');
      const ps = document.querySelectorAll('main p');
      if (d.section_1_title && h2s[0]) h2s[0].innerText = d.section_1_title;
      if (d.section_1_text && ps[0]) ps[0].innerText = d.section_1_text;
    `
  },
  {
    file: 'single_blog_post.html',
    type: 'blog_posts',
    slug: 'navigating-global-resilience',
    mapping: `
      if (d.title) setEl('h1', d.title);
      if (d.subtitle) setEl('header p', d.subtitle);
      if (d.author) {
        const authorEl = document.querySelector('header .font-bold');
        if (authorEl) authorEl.innerText = d.author;
      }
      if (d.content) {
        const articlePs = document.querySelectorAll('article p');
        if (articlePs[0]) articlePs[0].innerText = d.content;
      }
    `
  }
];

for (const page of pageConfig) {
  if (!fs.existsSync(page.file)) {
    console.log('Skipping (not found):', page.file);
    continue;
  }

  let content = fs.readFileSync(page.file, 'utf8');

  // Remove any previously injected script to avoid duplicates
  content = content.replace(/<script>\s*\/\/ Directus CMS[\s\S]*?<\/script>/g, '');

  let apiUrl, fetchBlock;

  if (page.type === 'singleton') {
    apiUrl = `https://cms.pyramis.com.cy/items/${page.collection}`;
    fetchBlock = `
    const res = await fetch('${apiUrl}');
    if (!res.ok) return;
    const d = (await res.json()).data;
    ${page.mapping}`;
  } else if (page.type === 'blog_posts') {
    apiUrl = `https://cms.pyramis.com.cy/items/blog_posts?filter[slug][_eq]=${page.slug}`;
    fetchBlock = `
    const res = await fetch('${apiUrl}');
    if (!res.ok) return;
    const arr = (await res.json()).data;
    const d = arr[0];
    if (!d) return;
    ${page.mapping}`;
  } else {
    apiUrl = `https://cms.pyramis.com.cy/items/pages?filter[slug][_eq]=${page.slug}`;
    fetchBlock = `
    const res = await fetch('${apiUrl}');
    if (!res.ok) return;
    const arr = (await res.json()).data;
    const d = arr[0];
    if (!d) return;
    ${page.mapping}`;
  }

  const script = `
<script>
  // Directus CMS Integration
  function setEl(selector, value) {
    const el = document.querySelector(selector);
    if (el) el.innerText = value;
  }
  async function fetchCMSContent() {
    try {${fetchBlock}
    } catch(e) {
      console.warn('Directus CMS fetch error:', e);
    }
  }
  document.addEventListener('DOMContentLoaded', fetchCMSContent);
</script>`;

  // Inject before </body>
  if (content.includes('</body>')) {
    content = content.replace('</body>', script + '\n</body>');
  } else {
    content += script;
  }

  fs.writeFileSync(page.file, content, 'utf8');
  console.log('Injected Directus script into:', page.file);
}

console.log('Done!');
