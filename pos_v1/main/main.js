'use strict';

let printReceipt = (tags) => {
  let allItems = loadAllItems();
  let cartItems = buildCartItems(tags, allItems);
  let promotions = loadPromotions();
  let receiptItems = buildReceiptItems(cartItems, promotions);
  let receipt = buildReceipt(receiptItems);
  let receiptText = generateReceiptText(receipt);

  console.log(receiptText);
};

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

let buildReceipt = (receiptItems) => {
  let actualTotal = 0;
  let saveTotal = 0;

  for (let receiptItem of receiptItems) {
    actualTotal += receiptItem.subtotal;
    saveTotal += receiptItem.save;
  }

  return {receiptItems: receiptItems, actualTotal: actualTotal, saveTotal: saveTotal};
};

let generateReceiptText = (receipt) => {
  return `***<没钱赚商店>收据***
${generateReceiptItemsText(receipt.receiptItems)}----------------------
总计：${receipt.actualTotal.toFixed(2)}(元)
节省：${receipt.saveTotal.toFixed(2)}(元)
**********************`;
};

let generateReceiptItemsText = (receiptItems) => {
  let receiptItemsText = ``;

  for (let receiptItem of receiptItems) {
    receiptItemsText += `名称：${receiptItem.cartItem.item.name}，数量：${receiptItem.cartItem.count}${receiptItem.cartItem.item.unit}，单价：${receiptItem.cartItem.item.price.toFixed(2)}(元)，小计：${receiptItem.subtotal.toFixed(2)}(元)
`;
  }

  return receiptItemsText;
};