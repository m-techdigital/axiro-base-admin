import snapshot from './marketplace-contract.json'
import api from '../services/axios'

export const marketplaceContract = snapshot
export const EXPECTED_CONTRACT_VERSION = snapshot.contract_version

export async function fetchMarketplaceContract() {
    const response = await api.get('/marketplace-contract')
    return response?.data ?? response
}

const major = (version) => String(version ?? '').split('.')[0]
const endpointSet = (items = []) => new Set(items)

export function inspectContractCompatibility(remote) {
    const issues = []

    if (!remote || typeof remote !== 'object') {
        return {
            compatible: false,
            issues: ['Không nhận được hợp đồng tích hợp từ máy chủ.'],
        }
    }

    if (major(remote.contract_version) !== major(EXPECTED_CONTRACT_VERSION)) {
        issues.push(
            `Phiên bản chính không tương thích: cần ${EXPECTED_CONTRACT_VERSION}, nhận ${remote.contract_version || 'không xác định'}.`,
        )
    }

    for (const [capability, enabled] of Object.entries(
        snapshot.capabilities || {},
    )) {
        if (enabled === true && remote.capabilities?.[capability] !== true) {
            issues.push(`Máy chủ thiếu khả năng bắt buộc: ${capability}.`)
        }
    }

    for (const group of ['public_endpoints', 'admin_endpoints']) {
        const available = endpointSet(remote[group])
        for (const endpoint of snapshot[group] || []) {
            if (!available.has(endpoint))
                issues.push(`Máy chủ thiếu endpoint: ${endpoint}.`)
        }
    }

    for (const [group, values] of Object.entries(snapshot.statuses || {})) {
        const remoteValues = new Set(remote.statuses?.[group] || [])
        for (const value of values) {
            if (!remoteValues.has(value))
                issues.push(`Máy chủ thiếu trạng thái ${group}.${value}.`)
        }
    }

    return { compatible: issues.length === 0, issues }
}

export function isCompatibleContract(remote) {
    return inspectContractCompatibility(remote).compatible
}
