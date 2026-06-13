import html2pdf from 'html2pdf.js';

// Download order invoice as PDF
export const downloadOrderInvoice = (order, pharmacyName) => {
  const element = document.createElement('div');
  element.innerHTML = `
    <div style="padding: 30px; font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #2563EB; margin: 0;">Rare Medicine Locator</h1>
        <p style="color: #6b7280;">Order Invoice</p>
        <hr style="border: 1px solid #e5e7eb;" />
      </div>
      
      <div style="display: flex; justify-content: space-between; margin-bottom: 30px;">
        <div>
          <h3 style="margin: 0 0 5px 0;">Order Details</h3>
          <p style="margin: 0; color: #6b7280;">Order ID: ${order._id.slice(-8)}</p>
          <p style="margin: 0; color: #6b7280;">Date: ${new Date(order.orderDate).toLocaleString()}</p>
        </div>
        <div style="text-align: right;">
          <h3 style="margin: 0 0 5px 0;">Pharmacy Details</h3>
          <p style="margin: 0; color: #6b7280;">${pharmacyName || 'Registered Pharmacy'}</p>
        </div>
      </div>
      
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
        <thead>
          <tr style="background-color: #f3f4f6;">
            <th style="padding: 12px; text-align: left; border: 1px solid #e5e7eb;">Medicine</th>
            <th style="padding: 12px; text-align: center; border: 1px solid #e5e7eb;">Quantity</th>
            <th style="padding: 12px; text-align: right; border: 1px solid #e5e7eb;">Unit Price</th>
            <th style="padding: 12px; text-align: right; border: 1px solid #e5e7eb;">Total</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="padding: 12px; border: 1px solid #e5e7eb;">${order.medicineName}</td>
            <td style="padding: 12px; text-align: center; border: 1px solid #e5e7eb;">${order.quantity || 1}</td>
            <td style="padding: 12px; text-align: right; border: 1px solid #e5e7eb;">₹${(order.totalAmount / (order.quantity || 1)).toLocaleString()}</td>
            <td style="padding: 12px; text-align: right; border: 1px solid #e5e7eb;">₹${order.totalAmount?.toLocaleString()}</td>
          </tr>
        </tbody>
        <tfoot>
          <tr style="background-color: #f9fafb;">
            <td colspan="3" style="padding: 12px; text-align: right; font-weight: bold;">Grand Total:</td>
            <td style="padding: 12px; text-align: right; font-weight: bold;">₹${order.totalAmount?.toLocaleString()}</td>
          </tr>
        </tfoot>
      </table>
      
      <div style="margin-bottom: 20px;">
        <h3>Delivery Information</h3>
        <p style="margin: 5px 0;">Name: ${order.userName}</p>
        <p style="margin: 5px 0;">Phone: ${order.phoneNumber || 'Not provided'}</p>
        <p style="margin: 5px 0;">Address: ${order.billingAddress}</p>
      </div>
      
      <div style="margin-bottom: 20px;">
        <h3>Payment Information</h3>
        <p style="margin: 5px 0;">Status: ${order.paymentStatus === 'paid' ? 'Paid' : order.paymentStatus === 'pending' ? 'Pending' : 'Failed'}</p>
        <p style="margin: 5px 0;">Mode: ${order.paymentMode?.toUpperCase() || 'Cash'}</p>
        <p style="margin: 5px 0;">Delivery By: ${new Date(order.deliveryByDate).toLocaleDateString()}</p>
      </div>
      
      <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin-top: 20px;">
        <p style="margin: 0; font-size: 12px; color: #6b7280;">
          This is a computer-generated invoice. No signature is required.
        </p>
        <p style="margin: 10px 0 0 0; font-size: 12px; color: #6b7280;">
          Thank you for choosing Rare Medicine Locator!
        </p>
      </div>
    </div>
  `;
  
  const opt = {
    margin: [0.5, 0.5],
    filename: `Invoice_${order._id.slice(-8)}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
  };
  
  html2pdf().set(opt).from(element).save();
};