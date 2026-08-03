import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const optionsPath = path.join(root, 'src/constants/options.js')
const formConfigPath = path.join(root, 'src/modules/products/formConfig.jsx')
const optionsSource = fs.readFileSync(optionsPath, 'utf8')
const formConfigSource = fs.readFileSync(formConfigPath, 'utf8')

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
    if (!formConfigSource.includes(name)) {
        throw new Error(`Product form config no longer consumes ${name}`)
    }
}

console.log('Product option exports are closed.')
