/**
 * Bounded compatibility adapter for AXIRO parent BaseButton.
 *
 * AXIRO Mini currently has exactly one authenticated admin role, so every
 * authenticated admin action is allowed. Keeping the parent hook contract at
 * this path lets shared base components remain source-compatible without
 * porting the parent's RBAC, company, project, or team permission graph.
 */
export function usePermission() {
    return {
        can: () => true,
        canAny: () => true,
        canAll: () => true,
    }
}

export default usePermission
