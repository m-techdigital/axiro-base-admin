import api from '../../services/axios'
export default {
    list: (params = {}) => api.get('/document-templates', { params }),
    create: (data) => api.post('/document-templates', data),
    update: (id, data) => api.put(`/document-templates/${id}`, data),
    remove: (id) => api.delete(`/document-templates/${id}`),
}
export const documentTypes = [
    ['sale_contract', 'Hợp đồng mua bán'],
    ['rental_contract', 'Hợp đồng thuê'],
    ['installment_appendix', 'Phụ lục trả góp'],
    ['deposit_confirmation', 'Thỏa thuận đặt cọc'],
    ['payment_confirmation', 'Xác nhận thanh toán'],
    ['handover_minutes', 'Biên bản bàn giao'],
    ['return_minutes', 'Biên bản hoàn trả'],
    ['dispute_minutes', 'Tiếp nhận tranh chấp'],
    ['dispute_resolution', 'Xử lý tranh chấp'],
    ['refund_settlement', 'Hoàn tiền và đối soát'],
    ['completion_minutes', 'Hoàn tất giao dịch'],
    ['security_checklist', 'Kiểm tra bảo mật'],
    ['platform_transaction_record', 'Phiếu ghi nhận giao dịch'],
]
