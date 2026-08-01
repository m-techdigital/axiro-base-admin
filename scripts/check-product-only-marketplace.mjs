import fs from 'node:fs'
const mustNot = ['src/modules/listings', '/listings']
if (fs.existsSync('src/modules/listings'))
    throw new Error('listing module remains')
const files = ['src/configs/adminMenu.jsx', 'src/app/router/index.jsx']
for (const f of files) {
    const s = fs.readFileSync(f, 'utf8')
    if (s.includes('/listings'))
        throw new Error(f + ' still references listings')
}
console.log('product-only marketplace gate passed')
