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
          console.error(`Request failed: ${method} ${path}`, responseBody);
          reject(new Error(`Status ${res.statusCode}`));
        }
      });
    });

    req.on('error', e => reject(e));
    if (body) req.write(data);
    req.end();
  });
}

async function run() {
  try {
    console.log('1. Creating collection: home_page (Skipped as it was manually run)');
    // await request('/collections', 'POST', { collection: 'home_page', meta: { singleton: true }, schema: {} }).catch(() => {});

    console.log('2. Creating fields for home_page');
    const fields = [
      { field: 'hero_title', type: 'string' },
      { field: 'hero_subtitle', type: 'text' },
      { field: 'service_1_title', type: 'string' },
      { field: 'service_1_description', type: 'text' },
      { field: 'service_2_title', type: 'string' },
      { field: 'service_2_description', type: 'text' },
      { field: 'service_3_title', type: 'string' },
      { field: 'service_3_description', type: 'text' }
    ];
    for (const f of fields) {
      await request('/fields/home_page', 'POST', f).catch(e => console.log('Field might already exist ' + f.field));
    }

    console.log('3. Giving Public Read Permissions to home_page (role null)');
    await request('/permissions', 'POST', {
      role: null,
      collection: 'home_page',
      action: 'read',
      fields: ['*']
    }).catch(() => console.log('Permissions rule might exist already'));

    console.log('4. Initializing data...');
    try {
      await request('/items/home_page', 'POST', {
        hero_title: 'Navigating Growth in the East Med.',
        hero_subtitle: 'Pyramis provides bespoke corporate strategy and tax advisory services for visionary firms establishing their presence in the Mediterranean’s most strategic hub.',
        service_1_title: 'Corporate Strategy',
        service_1_description: 'Comprehensive structural frameworks designed to align your Mediterranean operations with global growth trajectories.',
        service_2_title: 'Tax Advisory',
        service_2_description: 'Sophisticated tax optimization strategies leveraging Cyprus’s favorable regulatory environment for maximum efficiency.',
        service_3_title: 'Market Entry',
        service_3_description: 'Seamless integration into the Cyprus business landscape through localized intelligence and institutional networking.'
      });
    } catch (e) {
      console.log('POST failed, maybe singleton item exists. Trying PATCH...');
      await request('/items/home_page', 'PATCH', {
        hero_title: 'Navigating Growth in the East Med.',
        hero_subtitle: 'Pyramis provides bespoke corporate strategy and tax advisory services for visionary firms establishing their presence in the Mediterranean’s most strategic hub.',
        service_1_title: 'Corporate Strategy',
        service_1_description: 'Comprehensive structural frameworks designed to align your Mediterranean operations with global growth trajectories.',
        service_2_title: 'Tax Advisory',
        service_2_description: 'Sophisticated tax optimization strategies leveraging Cyprus’s favorable regulatory environment for maximum efficiency.',
        service_3_title: 'Market Entry',
        service_3_description: 'Seamless integration into the Cyprus business landscape through localized intelligence and institutional networking.'
      });
    }

    console.log('SUCCESS!');
  } catch(e) {
    console.error('Failure:', e);
  }
}

run();
