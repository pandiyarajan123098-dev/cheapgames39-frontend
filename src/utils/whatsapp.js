export const WHATSAPP_SUPPORT_NUMBER = "916379490178";

/**
 * Generates the standardized CG39 WhatsApp order confirmation & support message.
 * @param {Object} order - Order object containing id, total_price, transaction_id, order_items / items
 * @param {Array} fallbackItems - Fallback items array from cart if order_items is not populated yet
 * @returns {string} Fully formatted WhatsApp message string
 */
export const formatWhatsAppOrderMessage = (order, fallbackItems = []) => {
  if (!order) {
    return "Hi CG39 Support,\n\nI need help with my order.\n\nThank you,\nCG39 Game Store";
  }

  const orderId = order.id ? `#${String(order.id).slice(0, 8).toUpperCase()}` : "N/A";
  const txnId = order.transaction_id || "Awaiting UTR";
  const amount = order.total_price !== undefined ? `₹${order.total_price}` : "₹0";

  // Extract line items from order_items, items, or cart fallbackItems
  const rawItems = (order.order_items && order.order_items.length > 0)
    ? order.order_items
    : (order.items && order.items.length > 0)
    ? order.items
    : (Array.isArray(fallbackItems) && fallbackItems.length > 0)
    ? fallbackItems
    : [];

  let itemsText = "";
  if (rawItems.length > 0) {
    itemsText = rawItems
      .map((item) => {
        const title = item.games?.title || item.title || item.name || "Game Product";
        const qty = item.quantity || 1;
        const unitPrice = item.price || item.games?.price || 0;
        const lineTotal = unitPrice ? unitPrice * qty : (order.total_price || 0);
        return `• ${title} × ${qty} — ₹${lineTotal}`;
      })
      .join("\n");
  } else {
    itemsText = `• Game Product × 1 — ${amount}`;
  }

  return `Hi CG39 Support,

I have submitted my payment.

Order ID: ${orderId}
Transaction ID: ${txnId}
Amount: ${amount}

Items:
${itemsText}

Payment Method: UPI
Payment Status: Awaiting Verification

Please verify my payment and process my order.

Thank you,
CG39 Game Store`;
};

/**
 * Returns a direct WhatsApp click-to-chat URL with the encoded message
 */
export const getWhatsAppOrderUrl = (order, fallbackItems = []) => {
  const message = formatWhatsAppOrderMessage(order, fallbackItems);
  return `https://wa.me/${WHATSAPP_SUPPORT_NUMBER}?text=${encodeURIComponent(message)}`;
};
