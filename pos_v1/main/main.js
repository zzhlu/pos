'use strict';

function printReceipt(tags) {
  const allItems = loadAllItems();
  const cartItems = buildCartItems(tags, allItems);

  const promotions = loadPromotions();
  const receiptItems = buildReceiptItems(cartItems, promotions);

  const receipt = buildReceipt(receiptItems);

  const receiptText = generateReceiptText(receipt);

  console.log(receiptText);
}

function buildCartItems(tags, allItems) {

  const cartItems = [];

  for (const tag of tags) {
    const splittedTag = tag.split('-');
    const barcode = splittedTag[0];
    const count = parseFloat(splittedTag[1] || 1);

    const cartItem = cartItems.find(cartItem => cartItem.item.barcode === barcode);
    if (cartItem) {
      cartItem.count += count;
    } else {
      const item = allItems.find(item => item.barcode === barcode);

      cartItems.push({item, count});
    }
  }

  return cartItems;
}

function buildReceiptItems(cartItems, promotions) {
  return cartItems.map(cartItem => {

    const promotionType = getPromotionType(cartItem.item.barcode, promotions);

    const {subtotal, saved} = discount(cartItem.item.price, cartItem.count, promotionType);

    return {cartItem, subtotal, saved};
  });
}

function getPromotionType(barcode, promotions) {

  const promotion = promotions.find(promotion => promotion.barcodes.some(b => b === barcode));

  return promotion ? promotion.type : undefined;
}

function discount(price, count, promotionType) {

  let subtotal = price * count;
  let saved = 0;

  if (promotionType === 'BUY_TWO_GET_ONE_FREE') {
    saved = price * parseInt(count / 3);
    subtotal -= saved;
  }

  return {subtotal, saved};
}

function buildReceipt(receiptItems) {

  let actualTotal = 0;
  let savedTotal = 0;

  for (const receiptItem of receiptItems) {
    actualTotal += receiptItem.subtotal;
    savedTotal += receiptItem.saved;
  }

  return {receiptItems, actualTotal, savedTotal};
}

function formatMoney(money) {
  return money.toFixed(2);
}

function generateReceiptText(receipt) {

  let receiptItemsText = receipt.receiptItems.map(receiptItem => {
    const cartItem = receiptItem.cartItem;
    return `名称：${cartItem.item.name}，数量：${cartItem.count}${cartItem.item.unit}，\
单价：${formatMoney(cartItem.item.price)}(元)，小计：${formatMoney(receiptItem.subtotal)}(元)`;
  }).join('\n');

  return `***<没钱赚商店>收据***
${receiptItemsText}
----------------------
总计：${formatMoney(receipt.actualTotal)}(元)
节省：${formatMoney(receipt.savedTotal)}(元)
**********************`;
}