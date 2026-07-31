import fs from 'node:fs';
const files=['src/modules/payouts/pages/Index.jsx','src/modules/payouts/service.js','src/App.jsx','src/layouts/AppLayout.jsx'];
const text=files.map(f=>fs.readFileSync(new URL(`../${f}`,import.meta.url),'utf8')).join('\n');
const required=['/seller-verifications','/payout-accounts','/withdrawals','Xác minh và chi trả'];
const missing=required.filter(x=>!text.includes(x));
if(missing.length){console.error(`Thiếu Admin payout flow: ${missing.join(', ')}`);process.exit(1);} console.log('Admin payout flow contract OK');
