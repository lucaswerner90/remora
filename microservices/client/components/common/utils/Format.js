export const formatPrice = (price = 0) => {
  return parseFloat(price).toString().replace(/\d(?=(\d{3})+\.)/g, '$&,');
}
export const formatPriceToFixed = (price = 0) => {
  return parseFloat(price).toFixed(2).toString().replace(/\d(?=(\d{3})+\.)/g, '$&,');
}
export const formatPriceToFixed0 = (price = 0) => {
  return parseFloat(price).toFixed(1).toString().replace(/\d(?=(\d{3})+\.)/g, '$&,');
}