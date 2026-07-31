import fs from 'node:fs';
const app=fs.readFileSync(new URL('../src/App.jsx',import.meta.url),'utf8');
const layout=fs.readFileSync(new URL('../src/layouts/AppLayout.jsx',import.meta.url),'utf8');
const page=fs.readFileSync(new URL('../src/modules/marketplace-trust/pages/Index.jsx',import.meta.url),'utf8');
const failures=[];for(const token of ['marketplace-trust','Niềm tin và nội dung','Đánh giá','Nội dung','Rủi ro'])if(!`${app}\n${layout}\n${page}`.includes(token))failures.push(`Thiếu ${token}`);if(failures.length){console.error(failures.join('\n'));process.exit(1)}console.log('Admin marketplace trust contract OK');
