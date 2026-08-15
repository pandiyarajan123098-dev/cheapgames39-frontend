export const WHATSAPP_SUPPORT_NUMBER = "916379490178";

/**
 * Generates the standardized CG39 WhatsApp order confirmation & support message.
 * @param {Object} order - Order object containing id, total_price, transaction_id, billing_name, billing_email, billing_phone, order_items / items
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

  // Format line items
  const rawItems = (order.order_items && order.order_items.length > 0)
    ? order.order_items
    : (order.items && order.items.length > 0)
    ? order.items
    : fallbackItems;

  let itemsText = "";
  if (rawItems && rawItems.length > 0) {
    itemsText = rawItems
      .map((item, idx) => {
        const title = item.games?.title || item.title || "Game Product";
        const qty = item.quantity || 1;
        const itemPrice = item.price ? `₹${item.price * qty}` : (item.games?.price ? `₹${item.games.price * qty}` : "");
        return `${idx + 1}. ${title} × ${qty}${itemPrice ? ` — ${itemPrice}` : ""}`;
      })
      .join("\n");
  } else {
    itemsText = "1. Game Product × 1";
  }

  const name = order.billing_name || "Customer";
  const email = order.billing_email || "customer@email.com";
  const phone = order.billing_phone ? `\nPhone: ${order.billing_phone}` : "";

  const paymentStatus = (order.payment_status === "paid" || order.status === "paid" || order.status === "completed" || order.status === "delivered")
    ? "Verified"
    : order.transaction_id
    ? "Awaiting Verification"
    : "Pending Verification";

  return `Hi CG39 Support,

I have submitted my payment.

Order ID: ${orderId}
Transaction ID: ${txnId}
Amount: ${amount}

Items:
${itemsText}

Customer:
Name: ${name}
Email: ${email}${phone}

Payment Method: UPI
Payment Status: ${paymentStatus}

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
