import { useEffect } from 'react'

const EVENT_NAME = 'app:page-title-override'

export const PAGE_TITLE_OVERRIDE_EVENT = EVENT_NAME
export const PAGE_TITLE_OVERRIDE_KEY = '__APP_PAGE_TITLE_OVERRIDE__'

export function usePageTitleOverride(title) {
    useEffect(() => {
        if (title) {
            document.title = title
        }

        window[PAGE_TITLE_OVERRIDE_KEY] = title || null

        window.dispatchEvent(
            new CustomEvent(EVENT_NAME, {
                detail: { title: title || null },
            }),
        )

        return () => {
            window[PAGE_TITLE_OVERRIDE_KEY] = null

            window.dispatchEvent(
                new CustomEvent(EVENT_NAME, {
                    detail: { title: null },
                }),
            )
        }
    }, [title])
}
