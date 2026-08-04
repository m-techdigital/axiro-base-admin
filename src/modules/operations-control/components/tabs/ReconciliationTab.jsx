import { Tabs } from 'antd'
import { lazy, Suspense, useState } from 'react'

const ReconciliationSummary = lazy(() => import('./ReconciliationSummary'))
const ReconciliationExportWorkspace = lazy(
    () => import('./ReconciliationExportWorkspace'),
)

export default function ReconciliationTab(props) {
    const [workspace, setWorkspace] = useState('summary')

    return (
        <Tabs
            activeKey={workspace}
            destroyOnHidden
            items={[
                {
                    key: 'summary',
                    label: 'Tổng hợp',
                    children: (
                        <Suspense fallback={null}>
                            <ReconciliationSummary
                                reconciliation={props.reconciliation}
                            />
                        </Suspense>
                    ),
                },
                {
                    key: 'export',
                    label: 'Bộ lọc và xuất dữ liệu',
                    children: (
                        <Suspense fallback={null}>
                            <ReconciliationExportWorkspace {...props} />
                        </Suspense>
                    ),
                },
            ]}
            onChange={setWorkspace}
        />
    )
}
