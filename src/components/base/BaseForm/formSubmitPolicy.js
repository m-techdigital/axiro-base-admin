export const isFormSubmitBlocked = ({
    submitDisabled = false,
    loading = false,
} = {}) => Boolean(submitDisabled || loading)

export const runFormSubmitIfAllowed = async (state, submit) => {
    if (isFormSubmitBlocked(state)) return { executed: false }

    return { executed: true, value: await submit() }
}
