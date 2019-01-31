export const formatPrice = (price = 0) => {
  return parseFloat(price).toString().replace(/\d(?=(\d{3})+\.)/g, '$&,');
}