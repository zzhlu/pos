'use strict';

let buildCartItems = (tags, allItems) => {
  let cartItems = [];

  for (let tag of tags) {
    let splittedTag = tag.split('-');
    let barcode = splittedTag[0];
    let count = parseFloat(splittedTag[1] || 1);

    let cartItem = cartItems.find(cartItem => cartItem.item.barcode === barcode);
    if (cartItem) {
      cartItem.count++;
    } else {
      let item = allItems.find(item => item.barcode === barcode);

      cartItems.push({item: item, count: count});
    }
  }

  return cartItems;
};

let buildReceiptItems = (cartItems, promotions) => {
  let receiptItems = [];

  for (let cartItem of cartItems) {
    let subtotal = cartItem.item.price * cartItem.count;
    let save = 0;

    let barcode = promotions[0].barcodes.find(barcode => barcode === cartItem.item.barcode);
    if (barcode && cartItem.count >= 3) {
      save = cartItem.item.price * parseInt(cartItem.count / 3);
      subtotal -= save;
    }

    receiptItems.push({cartItem: cartItem, subtotal: subtotal, save: save});
  }

  return receiptItems;
};