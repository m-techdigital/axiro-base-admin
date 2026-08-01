import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const optionsPath = path.join(root, 'src/constants/options.js')
const formPath = path.join(root, 'src/modules/products/pages/Form.jsx')
const optionsSource = fs.readFileSync(optionsPath, 'utf8')
const formSource = fs.readFileSync(formPath, 'utf8')

for (const name of [
    'GAME_OPTIONS',
    'PRODUCT_TYPE_OPTIONS',
    'PRODUCT_STATUS_OPTIONS',
]) {
    if (!optionsSource.includes(`export const ${name}`)) {
        throw new Error(
            `Missing named export ${name} in src/constants/options.js`,
        )
    }
    if (!formSource.includes(name)) {
        throw new Error(`Product form no longer consumes ${name}`)
    }
}

console.log('Product option exports are closed.')
