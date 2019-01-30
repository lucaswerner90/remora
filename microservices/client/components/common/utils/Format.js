export const formatPrice = (price = 0) => {
  return parseFloat(price).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
}