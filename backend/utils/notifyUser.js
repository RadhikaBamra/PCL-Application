const Notification = require("../models/Notifications");
const sendEmail = require("./sendEmail");

const notifyUser = async ({
  recipientId,
  recipientEmail,
  subject = "Notification",
  sampleId,
  message,
}) => {
  try {
    if (!recipientEmail || !message) {
      console.warn(
        "⚠️ notifyUser called without recipientEmail or message. Skipping."
      );
      return;
    }

    if (recipientId) {
      const notif = new Notification({
        recipient: recipientId,
        sampleId,
        message,
      });
      await notif.save();
      console.log("✅ Notification saved:", notif);
    }

    await sendEmail(recipientEmail.trim(), subject, message);
    console.log("📧 Email sent to:", recipientEmail.trim());
  } catch (err) {
    console.error("❌ notifyUser ERROR:", err);
  }
};

module.exports = notifyUser;
