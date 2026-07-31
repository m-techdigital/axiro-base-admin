import fs from 'node:fs';
const app=fs.readFileSync(new URL('../src/App.jsx',import.meta.url),'utf8');
const layout=fs.readFileSync(new URL('../src/layouts/AppLayout.jsx',import.meta.url),'utf8');
const page=fs.readFileSync(new URL('../src/modules/marketplace-operations/pages/Index.jsx',import.meta.url),'utf8');
const failures=[];
for(const token of ['marketplace-operations','Vận hành Marketplace','Chính sách phí','Trung tâm yêu cầu','Biên bản hiện trạng']) if(!`${app}\n${layout}\n${page}`.includes(token)) failures.push(`Thiếu ${token}`);
if(failures.length){console.error(failures.join('\n'));process.exit(1)}
console.log('Admin marketplace closure contract OK');
