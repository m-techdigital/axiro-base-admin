import { useEffect, useMemo, useRef, useState } from 'react'
import { Button, Space, message } from 'antd'
import { ReloadOutlined, SettingOutlined } from '@ant-design/icons'
import { useIsMobile } from '@/hooks/useIsMobile'

const DEFAULT_SIZE = { colSpan: 6, rowSpan: 8 }
const DEFAULT_ROW_HEIGHT = 30
const DEFAULT_GAP = 8

function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value))
}

function normalizeSize(size = {}, columns = 12) {
    return {
        colSpan: clamp(
            Number(size.colSpan || DEFAULT_SIZE.colSpan),
            1,
            columns,
        ),
        rowSpan: clamp(Number(size.rowSpan || DEFAULT_SIZE.rowSpan), 2, 24),
    }
}

function readStoredLayout(storageKey) {
    if (!storageKey) return { order: [], sizes: {}, positions: {} }

    try {
        const value = window.localStorage.getItem(storageKey)
        const parsed = value ? JSON.parse(value) : null

        if (Array.isArray(parsed)) {
            return { order: parsed, sizes: {}, positions: {} }
        }

        return {
            order: Array.isArray(parsed?.order) ? parsed.order : [],
            sizes: parsed?.sizes || {},
            positions: parsed?.positions || {},
        }
    } catch {
        return { order: [], sizes: {}, positions: {} }
    }
}

function normalizeLayout(layout) {
    if (Array.isArray(layout)) {
        return { order: layout, sizes: {}, positions: {} }
    }

    return {
        order: Array.isArray(layout?.order) ? layout.order : [],
        sizes:
            layout?.sizes && typeof layout.sizes === 'object'
                ? layout.sizes
                : {},
        positions:
            layout?.positions && typeof layout.positions === 'object'
                ? layout.positions
                : {},
    }
}

function extractLayoutPayload(response) {
    const payload = response?.data ?? response
    return payload?.layout ?? payload
}

function hasLayoutValue(layout) {
    return !!(
        layout &&
        ((Array.isArray(layout.order) && layout.order.length) ||
            (layout.sizes && Object.keys(layout.sizes).length) ||
            (layout.positions && Object.keys(layout.positions).length))
    )
}

function packDefaultLayout(widgets, columns, sizes) {
    let cursorX = 0
    let cursorY = 0
    let currentRowSpan = 0
    const positions = {}

    widgets.forEach((widget) => {
        const size =
            sizes[widget.key] ||
            normalizeSize(widget.size || DEFAULT_SIZE, columns)

        if (cursorX + size.colSpan > columns) {
            cursorX = 0
            cursorY += currentRowSpan
            currentRowSpan = 0
        }

        positions[widget.key] = { x: cursorX, y: cursorY }
        cursorX += size.colSpan
        currentRowSpan = Math.max(currentRowSpan, size.rowSpan)
    })

    return positions
}

function intersects(aPosition, aSize, bPosition, bSize) {
    return (
        aPosition.x < bPosition.x + bSize.colSpan &&
        aPosition.x + aSize.colSpan > bPosition.x &&
        aPosition.y < bPosition.y + bSize.rowSpan &&
        aPosition.y + aSize.rowSpan > bPosition.y
    )
}

export default function BaseWidgetGrid({
    widgets = [],
    storageKey,
    preferenceKey,
    layoutService,
    className = '',
    columns = 12,
    editable = true,
    defaultEditMode = false,
    rowHeight = DEFAULT_ROW_HEIGHT,
    gap = DEFAULT_GAP,
    initialLayout,
    onLayoutChange,
}) {
    const isMobile = useIsMobile()
    const gridRef = useRef(null)
    const [gridWidth, setGridWidth] = useState(0)
    const [editMode, setEditMode] = useState(defaultEditMode)
    const [layout, setLayout] = useState(() => readStoredLayout(storageKey))
    const [draftLayout, setDraftLayout] = useState(null)
    const [activeKey, setActiveKey] = useState(null)
    const keys = useMemo(() => widgets.map((widget) => widget.key), [widgets])
    const displayLayout = draftLayout || layout
    const remoteLayoutApi = useMemo(
        () => ({
            get:
                layoutService?.getLayout ||
                layoutService?.get ||
                layoutService?.load,
            save:
                layoutService?.saveLayout ||
                layoutService?.save ||
                layoutService?.update,
            reset:
                layoutService?.resetLayout ||
                layoutService?.reset ||
                layoutService?.delete,
        }),
        [layoutService],
    )

    useEffect(() => {
        if (!hasLayoutValue(initialLayout)) return

        setLayout((current) => ({
            ...current,
            ...normalizeLayout(initialLayout),
        }))
    }, [initialLayout])

    useEffect(() => {
        if (!gridRef.current) return

        const observer = new ResizeObserver(([entry]) => {
            setGridWidth(entry.contentRect.width)
        })

        observer.observe(gridRef.current)

        return () => observer.disconnect()
    }, [])

    useEffect(() => {
        if (!preferenceKey || !remoteLayoutApi.get) return undefined

        let active = true

        remoteLayoutApi
            .get(preferenceKey)
            .then((response) => {
                if (!active) return

                const remoteLayout = extractLayoutPayload(response)
                if (!remoteLayout) return

                setLayout((current) => ({
                    ...current,
                    ...normalizeLayout(remoteLayout),
                }))
            })
            .catch(() => {
                // Local layout remains available as a non-blocking fallback.
            })

        return () => {
            active = false
        }
    }, [preferenceKey, remoteLayoutApi])

    const sizes = useMemo(() => {
        return Object.fromEntries(
            widgets.map((widget) => [
                widget.key,
                normalizeSize(
                    displayLayout.sizes?.[widget.key] ||
                        widget.size ||
                        DEFAULT_SIZE,
                    columns,
                ),
            ]),
        )
    }, [columns, displayLayout.sizes, widgets])

    const committedSizes = useMemo(() => {
        return Object.fromEntries(
            widgets.map((widget) => [
                widget.key,
                normalizeSize(
                    layout.sizes?.[widget.key] || widget.size || DEFAULT_SIZE,
                    columns,
                ),
            ]),
        )
    }, [columns, layout.sizes, widgets])

    const defaultPositions = useMemo(
        () => packDefaultLayout(widgets, columns, committedSizes),
        [columns, committedSizes, widgets],
    )

    useEffect(() => {
        setLayout((current) => ({
            order: [
                ...current.order.filter((key) => keys.includes(key)),
                ...keys.filter((key) => !current.order.includes(key)),
            ],
            sizes: current.sizes || {},
            positions: Object.fromEntries(
                keys.map((key) => [
                    key,
                    current.positions?.[key] ||
                        defaultPositions[key] || { x: 0, y: 0 },
                ]),
            ),
        }))
    }, [defaultPositions, keys])

    const orderedWidgets = useMemo(() => {
        const widgetMap = new Map(widgets.map((widget) => [widget.key, widget]))
        const order = displayLayout.order.length ? displayLayout.order : keys
        return order.map((key) => widgetMap.get(key)).filter(Boolean)
    }, [displayLayout.order, keys, widgets])

    const colWidth = useMemo(() => {
        if (!gridWidth) return 0
        return (gridWidth - gap * (columns - 1)) / columns
    }, [columns, gap, gridWidth])

    const containerRows = useMemo(() => {
        return Math.max(
            1,
            ...keys.map((key) => {
                const position = displayLayout.positions?.[key] ||
                    defaultPositions[key] || { y: 0 }
                return (
                    position.y + (sizes[key]?.rowSpan || DEFAULT_SIZE.rowSpan)
                )
            }),
        )
    }, [defaultPositions, displayLayout.positions, keys, sizes])

    const persistLayout = (nextLayout) => {
        setLayout(nextLayout)
        setDraftLayout(null)
        setActiveKey(null)
        onLayoutChange?.(nextLayout)

        if (storageKey) {
            window.localStorage.setItem(storageKey, JSON.stringify(nextLayout))
        }

        if (preferenceKey && remoteLayoutApi.save) {
            remoteLayoutApi.save(preferenceKey, nextLayout).catch(() => {
                message.error('Không thể lưu bố cục, vui lòng thử lại.')
            })
        }
    }

    const buildLayout = (baseLayout, key, patch) => ({
        ...baseLayout,
        sizes: {
            ...baseLayout.sizes,
            ...(patch.size
                ? {
                      [key]: normalizeSize(
                          {
                              ...(sizes[key] || DEFAULT_SIZE),
                              ...patch.size,
                          },
                          columns,
                      ),
                  }
                : {}),
        },
        positions: {
            ...baseLayout.positions,
            ...(patch.position ? { [key]: patch.position } : {}),
        },
    })

    const resolveCollisions = (nextLayout, activeKey) => {
        const nextSizes = Object.fromEntries(
            widgets.map((widget) => [
                widget.key,
                normalizeSize(
                    nextLayout.sizes?.[widget.key] ||
                        widget.size ||
                        DEFAULT_SIZE,
                    columns,
                ),
            ]),
        )
        const nextPositions = {
            ...nextLayout.positions,
        }
        const queue = [activeKey]
        const touched = new Set()

        while (queue.length) {
            const sourceKey = queue.shift()
            const sourcePosition = nextPositions[sourceKey]
            const sourceSize = nextSizes[sourceKey]

            if (!sourcePosition || !sourceSize) continue

            keys.forEach((targetKey) => {
                if (targetKey === sourceKey) return

                const targetPosition = nextPositions[targetKey]
                const targetSize = nextSizes[targetKey]

                if (!targetPosition || !targetSize) return

                if (
                    !intersects(
                        sourcePosition,
                        sourceSize,
                        targetPosition,
                        targetSize,
                    )
                ) {
                    return
                }

                const nextY = sourcePosition.y + sourceSize.rowSpan
                const signature = `${targetKey}:${nextY}`

                if (targetPosition.y >= nextY || touched.has(signature)) {
                    return
                }

                nextPositions[targetKey] = {
                    ...targetPosition,
                    y: nextY,
                }
                touched.add(signature)
                queue.push(targetKey)
            })
        }

        return {
            ...nextLayout,
            positions: nextPositions,
        }
    }

    const startMove = (event, key) => {
        if (!editMode) return
        if (event.target.closest?.('.base-widget-grid__resize')) return

        event.preventDefault()
        event.stopPropagation()

        const startX = event.clientX
        const startY = event.clientY
        const startLayout = layout
        const startPosition = startLayout.positions?.[key] ||
            defaultPositions[key] || { x: 0, y: 0 }
        const size = sizes[key] || DEFAULT_SIZE
        let nextLayout = startLayout

        setActiveKey(key)
        setDraftLayout(startLayout)

        const onMove = (moveEvent) => {
            const nextX =
                startPosition.x +
                Math.round((moveEvent.clientX - startX) / (colWidth + gap))
            const nextY =
                startPosition.y +
                Math.round((moveEvent.clientY - startY) / (rowHeight + gap))

            nextLayout = resolveCollisions(
                buildLayout(startLayout, key, {
                    position: {
                        x: clamp(nextX, 0, columns - size.colSpan),
                        y: Math.max(0, nextY),
                    },
                }),
                key,
            )
            setDraftLayout(nextLayout)
        }

        const onEnd = () => {
            persistLayout(nextLayout)
            window.removeEventListener('pointermove', onMove)
            window.removeEventListener('pointerup', onEnd)
        }

        window.addEventListener('pointermove', onMove)
        window.addEventListener('pointerup', onEnd)
    }

    const startResize = (event, key) => {
        event.preventDefault()
        event.stopPropagation()

        const startX = event.clientX
        const startY = event.clientY
        const startLayout = layout
        const startSize = sizes[key] || DEFAULT_SIZE
        const position = startLayout.positions?.[key] ||
            defaultPositions[key] || { x: 0, y: 0 }
        let nextLayout = startLayout

        setActiveKey(key)
        setDraftLayout(startLayout)

        const onMove = (moveEvent) => {
            const nextColSpan =
                startSize.colSpan +
                Math.round((moveEvent.clientX - startX) / (colWidth + gap))
            const nextRowSpan =
                startSize.rowSpan +
                Math.round((moveEvent.clientY - startY) / (rowHeight + gap))

            nextLayout = resolveCollisions(
                buildLayout(startLayout, key, {
                    size: {
                        colSpan: clamp(nextColSpan, 1, columns - position.x),
                        rowSpan: Math.max(2, nextRowSpan),
                    },
                }),
                key,
            )
            setDraftLayout(nextLayout)
        }

        const onEnd = () => {
            persistLayout(nextLayout)
            window.removeEventListener('pointermove', onMove)
            window.removeEventListener('pointerup', onEnd)
        }

        window.addEventListener('pointermove', onMove)
        window.addEventListener('pointerup', onEnd)
    }

    const handleReset = () => {
        if (storageKey) {
            window.localStorage.removeItem(storageKey)
        }

        const nextLayout = {
            order: keys,
            sizes: {},
            positions: defaultPositions,
        }

        setLayout(nextLayout)
        setDraftLayout(null)
        setActiveKey(null)
        onLayoutChange?.(nextLayout)

        if (preferenceKey && remoteLayoutApi.reset) {
            remoteLayoutApi.reset(preferenceKey).catch(() => {
                message.error('Không thể đặt lại bố cục, vui lòng thử lại.')
            })
        }
    }

    return (
        <div
            className={`base-widget-grid-shell ${editMode ? 'is-editing' : ''}`}
        >
            {editable && !isMobile && (
                <div className="base-widget-grid-toolbar">
                    <Space size={8} wrap>
                        <Button
                            size="small"
                            type={editMode ? 'primary' : 'default'}
                            icon={<SettingOutlined />}
                            onClick={() => setEditMode((value) => !value)}
                        >
                            {editMode ? 'Xong' : 'Chỉnh bố cục'}
                        </Button>
                        <Button
                            size="small"
                            icon={<ReloadOutlined />}
                            onClick={handleReset}
                        >
                            Đặt lại mẫu
                        </Button>
                    </Space>
                </div>
            )}

            <div
                ref={gridRef}
                className={`base-widget-grid ${className}`}
                style={{
                    height:
                        containerRows * rowHeight +
                        Math.max(containerRows - 1, 0) * gap,
                    '--widget-row-height': `${rowHeight}px`,
                    '--widget-gap': `${gap}px`,
                }}
            >
                {orderedWidgets.map((widget) => {
                    const size = sizes[widget.key] || DEFAULT_SIZE
                    const position = displayLayout.positions?.[widget.key] ||
                        defaultPositions[widget.key] || { x: 0, y: 0 }
                    const width =
                        size.colSpan * colWidth + (size.colSpan - 1) * gap
                    const height =
                        size.rowSpan * rowHeight + (size.rowSpan - 1) * gap

                    return (
                        <div
                            key={widget.key}
                            className={`base-widget-grid__item ${editMode ? 'is-editing' : ''} ${
                                activeKey === widget.key ? 'is-active' : ''
                            }`}
                            onPointerDown={(event) =>
                                startMove(event, widget.key)
                            }
                            style={{
                                width,
                                height,
                                transform: `translate(${position.x * (colWidth + gap)}px, ${
                                    position.y * (rowHeight + gap)
                                }px)`,
                            }}
                        >
                            {editMode && (
                                <button
                                    type="button"
                                    className="base-widget-grid__resize"
                                    aria-label="Thay đổi kích thước ô"
                                    onPointerDown={(event) =>
                                        startResize(event, widget.key)
                                    }
                                />
                            )}
                            {widget.node}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
