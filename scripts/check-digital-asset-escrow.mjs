import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const read = (relative) => fs.readFileSync(path.join(root, relative), 'utf8')
const required = [
    'src/modules/escrow-boxes/service.js',
    'src/modules/escrow-boxes/pages/List.jsx',
    'src/modules/escrow-boxes/pages/Detail.jsx',
    'src/modules/escrow-boxes/pages/FeeRules.jsx',
    'src/modules/escrow-boxes/pages/Create.jsx',
    'src/modules/escrow-boxes/components/EscrowBoxHistoryTimeline.jsx',
]
for (const relative of required) {
    if (!fs.existsSync(path.join(root, relative)))
        throw new Error(`Missing escrow box Admin owner: ${relative}`)
}
const routes = read('src/routes/adminRoutes.jsx')
for (const token of [
    'escrow-boxes',
    'EscrowBoxList',
    'EscrowBoxDetail',
    'EscrowFeeRules',
    'EscrowBoxCreate',
]) {
    if (!routes.includes(token))
        throw new Error(`Admin escrow route missing ${token}`)
}
const createPage = read('src/modules/escrow-boxes/pages/Create.jsx')
for (const token of [
    'party_a_customer_id',
    'party_b_customer_id',
    'BaseForm',
    'createByAdmin',
]) {
    if (!createPage.includes(token))
        throw new Error(`Admin escrow create owner missing ${token}`)
}
if (!createPage.includes("values.deal_type === 'exchange_with_topup'")) {
    throw new Error(
        'Admin Escrow Box payload must exclude top-up fields for horizontal exchange',
    )
}
const service = read('src/modules/escrow-boxes/service.js')
for (const token of [
    "api.post('/escrow-boxes'",
    'invites/rotate',
    'api.post(`/escrow-boxes/${id}/cancel`',
]) {
    if (!service.includes(token))
        throw new Error(`Admin escrow service missing ${token}`)
}
const detail = read('src/modules/escrow-boxes/pages/Detail.jsx')
for (const token of [
    'BaseFormModal',
    'reviewHandover',
    'handover_sequence',
    'fee_override_reason',
    'Hủy box',
    'EscrowBoxHistoryTimeline',
    'Tải lại',
]) {
    if (!detail.includes(token))
        throw new Error(`Admin escrow review owner missing ${token}`)
}

const historyTimeline = read(
    'src/modules/escrow-boxes/components/EscrowBoxHistoryTimeline.jsx',
)
for (const token of [
    'BaseTimeline',
    'timelineSchema={escrowBoxTimelineSchema}',
    'method="getTimeline"',
]) {
    if (!historyTimeline.includes(token))
        throw new Error(`Admin Escrow Box timeline missing ${token}`)
}
if (detail.includes("title={() => 'Lịch sử cập nhật điều khoản'}")) {
    throw new Error(
        'Admin Escrow Box history must use timeline owner, not legacy table history',
    )
}
const contract = JSON.parse(read('src/contracts/marketplace-contract.json'))
if (
    contract.contract_version !== '2026-08-06.6' ||
    !contract.capabilities?.private_escrow_box ||
    !contract.capabilities?.escrow_box_fee_rules ||
    !contract.capabilities?.escrow_box_admin_assigned_parties ||
    !contract.capabilities?.escrow_box_creator_only_cancel ||
    !contract.capabilities?.escrow_box_invite_rotation ||
    !contract.capabilities?.escrow_box_clone_after_cancel ||
    !contract.capabilities?.escrow_box_update_history_detail ||
    !contract.capabilities?.escrow_box_parent_activity_timeline
) {
    throw new Error('Admin marketplace contract is stale')
}
if (fs.existsSync(path.join(root, 'src/pages/DirectEscrowCreatePage.jsx')))
    throw new Error('Legacy direct escrow UI must not coexist')
console.log('Admin escrow box guard passed.')
