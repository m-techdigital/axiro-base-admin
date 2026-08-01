export const findOption = (options = [], value) =>
    options.find((option) => option?.value === value)

export const optionLabel = (options = [], value, fallback = '-') =>
    findOption(options, value)?.label || fallback

export const optionColor = (options = [], value, fallback = 'default') =>
    findOption(options, value)?.color || fallback
