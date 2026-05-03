const https = require('https');

https.get('https://mp3quran.net/api/v3/reciters?language=ar', (res) => {
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    const json = JSON.parse(data);
    const result = json.reciters.filter(r => r.name.includes("ديبرووف") || r.name.includes("ديبروف"));
    console.log(JSON.stringify(result, null, 2));
  });
});
