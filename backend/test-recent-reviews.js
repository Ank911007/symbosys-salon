const fetch = require('node-fetch'); // actually, just use native fetch in node > 18
async function test() {
  const res = await fetch('http://localhost:5000/api/salons/reviews/recent');
  console.log('Status:', res.status);
  const text = await res.text();
  console.log('Body:', text);
}
test();
