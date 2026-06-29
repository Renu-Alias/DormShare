import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const from = process.env.FROM_EMAIL || "noreply@dormshare.com";

export const sendNewBorrowRequestEmail = async (lenderEmail, lenderName, borrowerName, borrowerContact, itemTitle, returnDate) => {
  try {
    await transporter.sendMail({
      from,
      to: lenderEmail,
      subject: `Borrow Request: ${itemTitle}`,
      text: `Hi ${lenderName},\n\n${borrowerName} has requested to borrow "${itemTitle}".\n\nBorrower contact: ${borrowerContact}\nExpected return date: ${new Date(returnDate).toLocaleDateString()}\n\nLog in to your DormShare dashboard to approve or reject this request.\n\n- DormShare Team`,
      html: `<p>Hi ${lenderName},</p><p><strong>${borrowerName}</strong> has requested to borrow <strong>"${itemTitle}"</strong>.</p><p><strong>Borrower contact:</strong> ${borrowerContact}<br/><strong>Expected return date:</strong> ${new Date(returnDate).toLocaleDateString()}</p><p><a href="${process.env.CORS_ORIGIN || "http://localhost:5173"}/dashboard" style="display:inline-block;padding:10px 20px;background:#0d9488;color:#fff;text-decoration:none;border-radius:8px">View in Dashboard</a></p><p>- DormShare Team</p>`,
    });
    console.log(`Borrow request email sent to ${lenderEmail}`);
  } catch (err) {
    console.error("Failed to send borrow request email:", err.message);
  }
};

export const sendBorrowApprovedEmail = async (borrowerEmail, borrowerName, lenderName, itemTitle) => {
  try {
    await transporter.sendMail({
      from,
      to: borrowerEmail,
      subject: `Borrow Request Approved: ${itemTitle}`,
      text: `Hi ${borrowerName},\n\nYour request to borrow "${itemTitle}" has been approved by ${lenderName}.\n\nPlease coordinate with the lender to pick up the item.\n\n- DormShare Team`,
      html: `<p>Hi ${borrowerName},</p><p>Your request to borrow <strong>"${itemTitle}"</strong> has been <strong style="color:#0d9488">approved</strong> by ${lenderName}.</p><p>Please coordinate with the lender to arrange pickup or delivery.</p><p>- DormShare Team</p>`,
    });
    console.log(`Borrow approved email sent to ${borrowerEmail}`);
  } catch (err) {
    console.error("Failed to send borrow approved email:", err.message);
  }
};

export const sendPasswordResetEmail = async (email, name, resetUrl) => {
  try {
    await transporter.sendMail({
      from,
      to: email,
      subject: "Password Reset - DormShare",
      text: `Hi ${name},\n\nYou requested a password reset.\n\nClick the link below to reset your password. This link expires in 1 hour.\n\n${resetUrl}\n\nIf you didn't request this, you can safely ignore this email.\n\n- DormShare Team`,
      html: `<p>Hi ${name},</p><p>You requested a password reset.</p><p><a href="${resetUrl}" style="display:inline-block;padding:10px 20px;background:#0d9488;color:#fff;text-decoration:none;border-radius:8px">Reset Password</a></p><p>This link expires in 1 hour. If you didn't request this, you can safely ignore this email.</p><p>- DormShare Team</p>`,
    });
    console.log(`Password reset email sent to ${email}`);
  } catch (err) {
    console.error("Failed to send password reset email:", err.message);
  }
};

export const sendBorrowRejectedEmail = async (borrowerEmail, borrowerName, lenderName, itemTitle) => {
  try {
    await transporter.sendMail({
      from,
      to: borrowerEmail,
      subject: `Borrow Request Declined: ${itemTitle}`,
      text: `Hi ${borrowerName},\n\nYour request to borrow "${itemTitle}" has been declined by ${lenderName}.\n\nYou can browse other available items in the marketplace.\n\n- DormShare Team`,
      html: `<p>Hi ${borrowerName},</p><p>Your request to borrow <strong>"${itemTitle}"</strong> has been declined by ${lenderName}.</p><p>You can browse other available items in the <a href="${process.env.CORS_ORIGIN || "http://localhost:5173"}/marketplace">Marketplace</a>.</p><p>- DormShare Team</p>`,
    });
    console.log(`Borrow rejected email sent to ${borrowerEmail}`);
  } catch (err) {
    console.error("Failed to send borrow rejected email:", err.message);
  }
};
