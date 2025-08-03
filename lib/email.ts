import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number.parseInt(process.env.SMTP_PORT || "587"),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export interface EmailTemplate {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export async function sendEmail({ to, subject, html, text }: EmailTemplate) {
  try {
    const info = await transporter.sendMail({
      from: `"Selar Onchain" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html,
      text: text || html.replace(/<[^>]*>/g, ""), // Strip HTML for text version
    });

    console.log("Email sent:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error: any) {
    console.error("Email sending failed:", error);
    return { success: false, error: error.message };
  }
}

// Email Templates
export const emailTemplates = {
  welcome: (name: string, username: string) => ({
    subject: "🎉 Welcome to Selar Onchain - Your Digital Store is Ready!",
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to Selar Onchain</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f8fafc; }
            .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px 30px; text-align: center; }
            .content { padding: 40px 30px; }
            .button { display: inline-block; background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 20px 0; }
            .footer { background: #f8fafc; padding: 20px 30px; text-align: center; color: #64748b; font-size: 14px; }
            .feature { display: flex; align-items: center; margin: 20px 0; }
            .feature-icon { width: 40px; height: 40px; background: #667eea; border-radius: 8px; display: flex; align-items: center; justify-content: center; margin-right: 15px; color: white; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0; font-size: 28px;">🎉 Welcome to Selar Onchain!</h1>
              <p style="margin: 10px 0 0 0; opacity: 0.9;">Your digital store is ready to go</p>
            </div>
            
            <div class="content">
              <h2>Hi ${name}! 👋</h2>
              <p>Congratulations on joining Selar Onchain! Your digital store has been created and you're ready to start selling your products with crypto payments.</p>
              
              <div class="feature">
                <div class="feature-icon">🏪</div>
                <div>
                  <strong>Your Store URL:</strong><br>
                  <a href="https://selar-onchain.vercel.app/store/${username}">selar-onchain.vercel.app/store/${username}</a>
                </div>
              </div>
              
              <div class="feature">
                <div class="feature-icon">🔗</div>
                <div>
                  <strong>Link in Bio:</strong><br>
                  <a href="https://selar-onchain.vercel.app/bio/${username}">selar-onchain.vercel.app/bio/${username}</a>
                </div>
              </div>
              
              <h3>What's Next?</h3>
              <ul>
                <li>✅ Add your first product</li>
                <li>✅ Customize your storefront</li>
                <li>✅ Set up your link in bio</li>
                <li>✅ Start accepting crypto payments</li>
              </ul>
              
              <a href="https://selar-onchain.vercel.app/dashboard" class="button">Go to Dashboard</a>
              
              <p>Need help getting started? Reply to this email and we'll be happy to assist you!</p>
            </div>
            
            <div class="footer">
              <p>Happy selling! 🚀<br>The Selar Onchain Team</p>
              <p><a href="https://selar-onchain.vercel.app">selar-onchain.vercel.app</a></p>
            </div>
          </div>
        </body>
      </html>
    `,
  }),

  orderConfirmation: (order: any, customer: any) => ({
    subject: `✅ Order Confirmation #${order.orderNumber} - Thank you for your purchase!`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Order Confirmation</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f8fafc; }
            .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
            .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 40px 30px; text-align: center; }
            .content { padding: 40px 30px; }
            .order-details { background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .item { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e2e8f0; }
            .total { font-weight: bold; font-size: 18px; color: #10b981; }
            .button { display: inline-block; background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 20px 0; }
            .footer { background: #f8fafc; padding: 20px 30px; text-align: center; color: #64748b; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0; font-size: 28px;">✅ Order Confirmed!</h1>
              <p style="margin: 10px 0 0 0; opacity: 0.9;">Thank you for your purchase</p>
            </div>
            
            <div class="content">
              <h2>Hi ${customer.name || "Valued Customer"}! 👋</h2>
              <p>Your order has been confirmed and payment received successfully. Here are your order details:</p>
              
              <div class="order-details">
                <h3>Order #${order.orderNumber}</h3>
                <p><strong>Order Date:</strong> ${new Date(
                  order.createdAt
                ).toLocaleDateString()}</p>
                <p><strong>Payment Status:</strong> <span style="color: #10b981;">✅ Paid</span></p>
                
                <h4>Items Ordered:</h4>
                ${order.items
                  .map(
                    (item: any) => `
                  <div class="item">
                    <div>
                      <strong>${item.product.name}</strong><br>
                      <small>Quantity: ${item.quantity}</small>
                    </div>
                    <div>$${(item.price * item.quantity).toFixed(2)} ${
                      order.currency
                    }</div>
                  </div>
                `
                  )
                  .join("")}
                
                <div class="item total">
                  <div>Total Amount:</div>
                  <div>$${order.totalAmount.toFixed(2)} ${order.currency}</div>
                </div>
              </div>
              
              ${
                order.paymentHash
                  ? `
                <p><strong>Transaction Hash:</strong><br>
                <a href="https://basescan.org/tx/${order.paymentHash}" style="font-family: monospace; word-break: break-all;">${order.paymentHash}</a></p>
              `
                  : ""
              }
              
              <p>Your digital products will be available for download shortly. If you have any questions, please don't hesitate to contact us.</p>
              
              <a href="https://selar-onchain.vercel.app/orders/${
                order.id
              }" class="button">View Order Details</a>
            </div>
            
            <div class="footer">
              <p>Thank you for choosing Selar Onchain! 🚀</p>
              <p><a href="https://selar-onchain.vercel.app">selar-onchain.vercel.app</a></p>
            </div>
          </div>
        </body>
      </html>
    `,
  }),

  sellerNotification: (order: any, seller: any) => ({
    subject: `🎉 New Sale! Order #${order.orderNumber} - $${order.totalAmount} ${order.currency}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>New Sale Notification</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f8fafc; }
            .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
            .header { background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; padding: 40px 30px; text-align: center; }
            .content { padding: 40px 30px; }
            .sale-details { background: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b; }
            .button { display: inline-block; background: #f59e0b; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 20px 0; }
            .footer { background: #f8fafc; padding: 20px 30px; text-align: center; color: #64748b; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0; font-size: 28px;">🎉 Congratulations!</h1>
              <p style="margin: 10px 0 0 0; opacity: 0.9;">You made a new sale</p>
            </div>
            
            <div class="content">
              <h2>Hi ${seller.name}! 👋</h2>
              <p>Great news! You just received a new order. Here are the details:</p>
              
              <div class="sale-details">
                <h3>💰 Sale Summary</h3>
                <p><strong>Order:</strong> #${order.orderNumber}</p>
                <p><strong>Amount:</strong> $${order.totalAmount.toFixed(2)} ${
      order.currency
    }</p>
                <p><strong>Customer:</strong> ${
                  order.buyerName || order.buyerEmail || "Anonymous"
                }</p>
                <p><strong>Date:</strong> ${new Date(
                  order.createdAt
                ).toLocaleDateString()}</p>
                
                <h4>Items Sold:</h4>
                <ul>
                  ${order.items
                    .map(
                      (item: any) => `
                    <li>${item.product.name} (Qty: ${item.quantity}) - $${(
                        item.price * item.quantity
                      ).toFixed(2)}</li>
                  `
                    )
                    .join("")}
                </ul>
              </div>
              
              <p>The payment has been processed and will be available in your connected wallet shortly.</p>
              
              <a href="https://selar-onchain.vercel.app/dashboard" class="button">View in Dashboard</a>
              
              <p>Keep up the great work! 🚀</p>
            </div>
            
            <div class="footer">
              <p>Happy selling!<br>The Selar Onchain Team</p>
              <p><a href="https://selar-onchain.vercel.app">selar-onchain.vercel.app</a></p>
            </div>
          </div>
        </body>
      </html>
    `,
  }),

  paymentReceived: (payment: any, seller: any) => ({
    subject: `💰 Payment Received - $${payment.amount} ${payment.currency}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Payment Received</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f8fafc; }
            .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
            .header { background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%); color: white; padding: 40px 30px; text-align: center; }
            .content { padding: 40px 30px; }
            .payment-details { background: #f3e8ff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #8b5cf6; }
            .button { display: inline-block; background: #8b5cf6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 20px 0; }
            .footer { background: #f8fafc; padding: 20px 30px; text-align: center; color: #64748b; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0; font-size: 28px;">💰 Payment Received!</h1>
              <p style="margin: 10px 0 0 0; opacity: 0.9;">Your crypto payment is confirmed</p>
            </div>
            
            <div class="content">
              <h2>Hi ${seller.name}! 👋</h2>
              <p>Great news! A crypto payment has been successfully received in your wallet.</p>
              
              <div class="payment-details">
                <h3>💳 Payment Details</h3>
                <p><strong>Amount:</strong> $${payment.amount.toFixed(2)} ${
      payment.currency
    }</p>
                <p><strong>Transaction Hash:</strong><br>
                <a href="https://basescan.org/tx/${
                  payment.txHash
                }" style="font-family: monospace; word-break: break-all;">${
      payment.txHash
    }</a></p>
                <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
                <p><strong>Status:</strong> <span style="color: #10b981;">✅ Confirmed</span></p>
              </div>
              
              <p>The payment has been confirmed on the Base blockchain and is now available in your wallet.</p>
              
              <a href="https://selar-onchain.vercel.app/dashboard?tab=wallet" class="button">View Wallet</a>
            </div>
            
            <div class="footer">
              <p>Powered by Base blockchain 🔗<br>The Selar Onchain Team</p>
              <p><a href="https://selar-onchain.vercel.app">selar-onchain.vercel.app</a></p>
            </div>
          </div>
        </body>
      </html>
    `,
  }),

  productAdded: (product: any, seller: any) => ({
    subject: `🎯 Product Added Successfully - ${product.name}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Product Added</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f8fafc; }
            .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
            .header { background: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%); color: white; padding: 40px 30px; text-align: center; }
            .content { padding: 40px 30px; }
            .product-details { background: #cffafe; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #06b6d4; }
            .button { display: inline-block; background: #06b6d4; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 20px 0; }
            .footer { background: #f8fafc; padding: 20px 30px; text-align: center; color: #64748b; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0; font-size: 28px;">🎯 Product Added!</h1>
              <p style="margin: 10px 0 0 0; opacity: 0.9;">Your product is now live</p>
            </div>
            
            <div class="content">
              <h2>Hi ${seller.name}! 👋</h2>
              <p>Congratulations! Your new product has been successfully added to your store and is now available for purchase.</p>
              
              <div class="product-details">
                <h3>📦 Product Details</h3>
                <p><strong>Name:</strong> ${product.name}</p>
                <p><strong>Price:</strong> $${product.price.toFixed(2)} ${
      product.currency
    }</p>
                <p><strong>Type:</strong> ${product.type}</p>
                <p><strong>Status:</strong> ${
                  product.isActive ? "✅ Active" : "⏸️ Draft"
                }</p>
                <p><strong>Description:</strong> ${product.description}</p>
              </div>
              
              <h3>Next Steps:</h3>
              <ul>
                <li>📸 Add product images to increase sales</li>
                <li>📝 Optimize your product description</li>
                <li>📢 Share your product link on social media</li>
                <li>📊 Monitor your sales analytics</li>
              </ul>
              
              <a href="https://selar-onchain.vercel.app/dashboard?tab=products" class="button">Manage Products</a>
            </div>
            
            <div class="footer">
              <p>Keep building your digital empire! 🚀<br>The Selar Onchain Team</p>
              <p><a href="https://selar-onchain.vercel.app">selar-onchain.vercel.app</a></p>
            </div>
          </div>
        </body>
      </html>
    `,
  }),

  tipReceived: (tip: any, creator: any, tipper: any) => ({
    subject: `💝 You received a tip of $${tip.amount} ${tip.currency}!`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Tip Received</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f8fafc; }
            .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
            .header { background: linear-gradient(135deg, #ec4899 0%, #be185d 100%); color: white; padding: 40px 30px; text-align: center; }
            .content { padding: 40px 30px; }
            .tip-details { background: #fce7f3; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ec4899; }
            .button { display: inline-block; background: #ec4899; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 20px 0; }
            .footer { background: #f8fafc; padding: 20px 30px; text-align: center; color: #64748b; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0; font-size: 28px;">💝 Tip Received!</h1>
              <p style="margin: 10px 0 0 0; opacity: 0.9;">Someone appreciates your work</p>
            </div>
            
            <div class="content">
              <h2>Hi ${creator.name}! 👋</h2>
              <p>Amazing news! Someone just sent you a tip to show their appreciation for your work.</p>
              
              <div class="tip-details">
                <h3>💖 Tip Details</h3>
                <p><strong>Amount:</strong> $${tip.amount.toFixed(2)} ${
      tip.currency
    }</p>
                <p><strong>From:</strong> ${
                  tipper.name || "Anonymous supporter"
                }</p>
                ${
                  tip.message
                    ? `<p><strong>Message:</strong> "${tip.message}"</p>`
                    : ""
                }
                <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
              </div>
              
              <p>This tip has been sent directly to your wallet. Keep creating amazing content!</p>
              
              <a href="https://selar-onchain.vercel.app/dashboard?tab=wallet" class="button">View Wallet</a>
              
              <p>Your supporters love what you do. Keep up the fantastic work! 🌟</p>
            </div>
            
            <div class="footer">
              <p>You're making a difference! 💫<br>The Selar Onchain Team</p>
              <p><a href="https://selar-onchain.vercel.app">selar-onchain.vercel.app</a></p>
            </div>
          </div>
        </body>
      </html>
    `,
  }),
};
