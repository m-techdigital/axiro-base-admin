import { ReloadOutlined } from '@ant-design/icons'
import { Space, Typography } from 'antd'

import {
    resolvePageHeaderConfig,
    usePageHeaderActions,
} from '@/hooks/usePageHeaderActions'

import BaseBreadcrumb from './BaseBreadcrumb'
import BaseButton from './BaseButton'
import BaseFormModal from './BaseFormModal'

export default function BasePageHeader({
    actions = [],
    className = '',
    context = {},
    description,
    extra,
    items = [],
    onReload,
    reloadButtonProps = {},
    reloadIcon = <ReloadOutlined />,
    reloadLoading = false,
    reloadText = 'Tải lại',
    showReload = false,
    title,
}) {
    const actionConfigs = Array.isArray(actions) ? actions : []
    const actionNode = Array.isArray(actions) ? null : actions
    const {
        activeAction,
        activeForm,
        closeAction,
        formContext,
        loading,
        openAction,
        submitForm,
        visibleActions,
    } = usePageHeaderActions({ actions: actionConfigs, context })

    const renderedActions =
        extra || actionNode || showReload || visibleActions.length ? (
            <Space className="base-page-header__actions" wrap>
                {showReload ? (
                    <BaseButton
                        icon={reloadIcon}
                        loading={reloadLoading}
                        onClick={onReload}
                        {...reloadButtonProps}
                    >
                        {reloadText}
                    </BaseButton>
                ) : null}
                {visibleActions.map((action) => (
                    <BaseButton
                        action={action.permissionAction || action.action}
                        danger={action.danger}
                        disabled={resolvePageHeaderConfig(
                            action.disabled,
                            context,
                        )}
                        icon={action.icon}
                        key={action.key}
                        loading={action.loading}
                        module={action.module}
                        onClick={() => openAction(action)}
                        tooltip={action.tooltip}
                        type={action.buttonType || action.type}
                        {...action.buttonProps}
                    >
                        {resolvePageHeaderConfig(action.label, context)}
                    </BaseButton>
                ))}
                {actionNode || extra}
            </Space>
        ) : null

    return (
        <>
            <header className={`base-page-header ${className}`.trim()}>
                <div className="base-page-header__copy">
                    <BaseBreadcrumb items={items} />
                    <Typography.Title level={2}>{title}</Typography.Title>
                    {description ? (
                        <Typography.Paragraph>
                            {description}
                        </Typography.Paragraph>
                    ) : null}
                </div>
                {renderedActions}
            </header>
            {activeForm ? (
                <BaseFormModal
                    description={resolvePageHeaderConfig(
                        activeForm.description,
                        formContext,
                    )}
                    fields={
                        resolvePageHeaderConfig(
                            activeForm.fields,
                            formContext,
                        ) || []
                    }
                    loading={loading}
                    onCancel={closeAction}
                    onFinish={submitForm}
                    open
                    record={
                        resolvePageHeaderConfig(
                            activeForm.record,
                            formContext,
                        ) || {}
                    }
                    submitText={
                        resolvePageHeaderConfig(
                            activeForm.submitText,
                            formContext,
                        ) || 'Lưu'
                    }
                    tabs={resolvePageHeaderConfig(activeForm.tabs, formContext)}
                    title={
                        resolvePageHeaderConfig(
                            activeForm.title,
                            formContext,
                        ) || activeAction?.label
                    }
                    width={activeForm.width || 800}
                />
            ) : null}
        </>
    )
}
