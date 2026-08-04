import fs from 'node:fs'
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'))
const lock = JSON.parse(fs.readFileSync('package-lock.json', 'utf8'))
const axios = lock.packages?.['node_modules/axios']?.version || ''
const formData = lock.packages?.['node_modules/form-data']?.version || ''
const tuple = (v) => v.split('.').map(Number)
const gte = (a, b) => {
    const x = tuple(a),
        y = tuple(b)
    for (let i = 0; i < 3; i++) {
        if ((x[i] || 0) !== (y[i] || 0)) return (x[i] || 0) > (y[i] || 0)
    }
    return true
}
if (!gte(axios, '1.19.0'))
    throw new Error(
        `Axios ${axios} còn nằm trong phạm vi advisory; yêu cầu >= 1.19.0.`,
    )
if (!gte(formData, '4.0.6'))
    throw new Error(`form-data ${formData} chưa đạt security floor 4.0.6.`)
if (JSON.stringify(lock).includes('plain-crypto-js'))
    throw new Error('Lockfile chứa IOC plain-crypto-js.')
if (!String(pkg.scripts?.['audit:security'] || '').includes('npm audit'))
    throw new Error('Thiếu npm audit release gate.')
console.log(
    `Dependency security floor PASS: axios ${axios}, form-data ${formData}.`,
)
