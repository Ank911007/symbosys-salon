const https = require('https');

const query = `
[out:json][timeout:25];
(
  node["shop"="beauty"](around:50000,23.3441,85.3096);
  node["shop"="hairdresser"](around:50000,23.3441,85.3096);
  node["amenity"="beauty_salon"](around:50000,23.3441,85.3096);
  node["leisure"="spa"](around:50000,23.3441,85.3096);
  node["shop"="cosmetics"](around:50000,23.3441,85.3096);
);
out center body;
>;
out skel qt;
`.trim();

const postData = `data=${encodeURIComponent(query)}`;

const options = {
  hostname: 'overpass-api.de',
  port: 443,
  path: '/api/interpreter',
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Content-Length': Buffer.byteLength(postData),
    'User-Agent': 'MintaSalonApp/1.0 (test script)'
  }
};

const req = https.request(options, (res) => {
  console.log(`STATUS: ${res.statusCode}`);
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    try {
      const json = JSON.parse(data);
      console.log(`Elements found: ${json.elements ? json.elements.length : 0}`);
      if (json.elements && json.elements.length > 0) {
        console.log(json.elements.slice(0, 3).map(e => e.tags && e.tags.name));
      }
    } catch(e) {
      console.log('Error parsing JSON:', data.substring(0, 100));
    }
  });
});

req.on('error', (e) => {
  console.error(`problem with request: ${e.message}`);
});

req.write(postData);
req.end();
