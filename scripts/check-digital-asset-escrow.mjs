import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const read = (relative) => fs.readFileSync(path.join(root, relative), 'utf8')
const required = [
    'src/modules/escrow-boxes/service.js',
    'src/modules/escrow-boxes/pages/List.jsx',
    'src/modules/escrow-boxes/pages/Detail.jsx',
    'src/modules/escrow-boxes/pages/FeeRules.jsx',
]
for (const relative of required) {
    if (!fs.existsSync(path.join(root, relative))) throw new Error(`Missing escrow box Admin owner: ${relative}`)
}
const routes = read('src/routes/adminRoutes.jsx')
for (const token of ['escrow-boxes', 'EscrowBoxList', 'EscrowBoxDetail', 'EscrowFeeRules']) {
    if (!routes.includes(token)) throw new Error(`Admin escrow route missing ${token}`)
}
const detail = read('src/modules/escrow-boxes/pages/Detail.jsx')
for (const token of ['BaseFormModal', 'reviewHandover', 'handover_sequence', 'fee_override_reason']) {
    if (!detail.includes(token)) throw new Error(`Admin escrow review owner missing ${token}`)
}
const contract = JSON.parse(read('src/contracts/marketplace-contract.json'))
if (contract.contract_version !== '2026-08-05.3' || !contract.capabilities?.private_escrow_box || !contract.capabilities?.escrow_box_fee_rules) {
    throw new Error('Admin marketplace contract is stale')
}
if (fs.existsSync(path.join(root, 'src/pages/DirectEscrowCreatePage.jsx'))) throw new Error('Legacy direct escrow UI must not coexist')
console.log('Admin escrow box guard passed.')
