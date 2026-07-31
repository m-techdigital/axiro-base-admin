import fs from 'node:fs';

const required = [
  'src/modules/marketplace-operations/pages/Index.jsx',
  'src/modules/marketplace-trust/pages/Index.jsx',
  'src/modules/payouts/pages/Index.jsx',
  'src/components/system/ContractCompatibilityBanner.jsx',
  'src/contracts/marketplace-contract.json',
  'src/services/axios.js',
];
const missing = required.filter((file) => !fs.existsSync(file));
const api = fs.readFileSync('src/services/axios.js', 'utf8');
const failures = [];
if (missing.length) failures.push(`Thiếu owner Admin: ${missing.join(', ')}`);
for (const token of ['X-Client-App', 'X-Marketplace-Contract-Version']) {
  if (!api.includes(token)) failures.push(`HTTP client thiếu header ${token}`);
}
if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}
console.log('Admin system v66 contract OK.');
