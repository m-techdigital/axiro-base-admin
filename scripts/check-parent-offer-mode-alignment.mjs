import fs from 'node:fs'

const required = [
    'src/modules/shared/enums/offer_modes.enum.js',
    'src/modules/products/formConfig.jsx',
    'src/modules/products/pages/Form.jsx',
    'src/modules/products/pages/List.jsx',
]
for (const file of required) {
    if (!fs.existsSync(file)) throw new Error(`Thiếu file offer-mode: ${file}`)
}
const formConfig = fs.readFileSync(
    'src/modules/products/formConfig.jsx',
    'utf8',
)
const list = fs.readFileSync('src/modules/products/pages/List.jsx', 'utf8')
if (
    !formConfig.includes("name: 'offer_modes'") ||
    !formConfig.includes('OFFER_MODE_OPTIONS')
)
    throw new Error('Product form chưa dùng offer_modes canonical')
if (!formConfig.includes("name: 'installment_enabled'"))
    throw new Error('Trả góp chưa tách thành capability riêng')
if (!formConfig.includes('values.offer_modes?.includes'))
    throw new Error('Product form chưa dùng hidden condition theo offer_modes')
if (formConfig.includes('transaction_types'))
    throw new Error('Product form còn dùng transaction_types legacy')
if (!list.includes("dataIndex: 'offer_modes'"))
    throw new Error('Product list chưa render offer_modes')
if (!list.includes('approval_status'))
    throw new Error('Product list chưa tách approval khỏi trạng thái tài sản')
console.log('Parent offer-mode alignment passed.')
