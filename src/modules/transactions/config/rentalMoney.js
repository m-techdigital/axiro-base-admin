export const rentalMoneyBreakdown = ({
    rentalAmount = 0,
    depositAmount = 0,
    deductionAmount = 0,
} = {}) => {
    const rental = Number(rentalAmount || 0)
    const deposit = Number(depositAmount || 0)
    const deduction = Math.min(
        deposit,
        Math.max(0, Number(deductionAmount || 0)),
    )
    return {
        rentalAmount: rental,
        depositAmount: deposit,
        initialAmount: rental + deposit,
        deductionAmount: deduction,
        refundableAmount: Math.max(0, deposit - deduction),
    }
}
