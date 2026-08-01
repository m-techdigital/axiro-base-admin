export const ACTIONS = {
    // Toàn quyền trên module
    // -> bỏ qua toàn bộ record permission
    ALL: 'all',

    // crud cơ bản
    READ: 'read',
    CREATE: 'create',
    UPDATE: 'update',
    DELETE: 'delete',
    CHANGE_PASSWORD: 'change_password',

    // Vòng đời tài khoản người dùng
    MANAGE_USER_STATUS: 'manage_user_status',

    // Phân quyền record cho user khác
    // Chỉ dùng để assign:
    // - read
    // - update
    // - delete
    // Không được assign tiếp quyền assign
    ADD: 'add',
    ASSIGN: 'assign',
    ASSIGN_ROLE: 'assign_role',

    // duyệt record
    APPROVE: 'approve',

    // chuyển đổi deal thành giao dịch
    CONVERT: 'convert',

    // organization chart
    MOVE: 'move',
    CHANGE_MANAGER: 'change_manager',
    CHANGE_DEPARTMENT: 'change_department',
    MANAGE_ORGANIZATION: 'manage_organization',

    // Xuất dữ liệu
    EXPORT: 'export',

    // Nhập dữ liệu
    IMPORT: 'import',

    // Dữ liệu nhạy cảm
    VIEW_SENSITIVE: 'view_sensitive',
    EXPORT_SENSITIVE: 'export_sensitive',
    UPDATE_SENSITIVE: 'update_sensitive',

    // Nghiệp vụ bảng lương chi tiết
    CALCULATE: 'calculate',
    REVIEW: 'review',
    PAY: 'pay',
    SYNC: 'sync',
    CLOSE: 'close',

    ACCESS_HEALTH: 'access_health',
    ACCESS_INCIDENTS: 'access_incidents',
    ACCESS_INTEGRATIONS: 'access_integrations',
    ACCESS_BACKUPS: 'access_backups',
    ACCESS_RELEASES: 'access_releases',
    ACCESS_RETENTION: 'access_retention',
    MANAGE_HEALTH: 'manage_health',
    MANAGE_INCIDENTS: 'manage_incidents',
    MANAGE_INTEGRATIONS: 'manage_integrations',
    MANAGE_BACKUPS: 'manage_backups',
    MANAGE_RELEASES: 'manage_releases',
    MANAGE_RETENTION: 'manage_retention',
    RESTORE_BACKUPS: 'restore_backups',
    MANAGE_MAINTENANCE: 'manage_maintenance',
    RETRY_FAILED_JOBS: 'retry_failed_jobs',
    ACCESS_SETTINGS: 'access_settings',
    ACCESS_DICTIONARIES: 'access_dictionaries',
    ACCESS_WORKFLOWS: 'access_workflows',
    ACCESS_BUSINESS_RULES: 'access_business_rules',
    ACCESS_TEMPLATES: 'access_templates',
    EXECUTE_WORKFLOWS: 'execute_workflows',
    USE_TEMPLATES: 'use_templates',
    ISSUE_DOCUMENTS: 'issue_documents',
    PUBLISH: 'publish',
    MANAGE_WORKFLOWS: 'manage_workflows',
    MANAGE_BUSINESS_RULES: 'manage_business_rules',
    MANAGE_TEMPLATES: 'manage_templates',
    MANAGE_SEQUENCES: 'manage_sequences',
    MANAGE_CUSTOM_FIELDS: 'manage_custom_fields',
}
