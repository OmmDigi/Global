// send_punch.js
import https from "https";

const data = '1 2025-09-15 10:30:15 1 0 0\n1 2025-09-15 10:31:05 1 0 0';

const options = {
  hostname: 'punch.globaltechnicalinstitute.com', // change to IP if needed
  port: 443, // or 7443 for your stream listener
  path: '/iclock/cdata?table=ATTLOG',
  method: 'POST',
  headers: {
    'Content-Type': 'text/plain',
    'Content-Length': Buffer.byteLength(data),
  },
  rejectUnauthorized: false // set true if cert is trusted
};

const req = https.request(options, (res) => {
  console.log('statusCode:', res.statusCode);
  res.on('data', (d) => process.stdout.write(d));
});

req.on('error', (e) => console.error(e));
req.write(data);
req.end();
