export const buildRoute = (template, params = {}) =>
    Object.entries(params).reduce(
        (path, [key, value]) =>
            path.replace(`:${key}`, encodeURIComponent(String(value))),
        template,
    )
