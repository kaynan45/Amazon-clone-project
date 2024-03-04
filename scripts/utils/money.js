export function formatCurrency(price) {
    const finalPrice = (price / 100).toFixed(2);
    return finalPrice;
};