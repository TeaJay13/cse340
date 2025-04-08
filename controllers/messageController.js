const messageModel = require("../models/message-model");
const utilities = require("../utilities");
const accountModel = require("../models/account-model");

/* *****************************
 * Render inbox view
 * *************************** */
async function buildInbox(req, res) {
  let nav = await utilities.getNav();
  const userId = req.user.account_id;
  const messages = await messageModel.getInboxMessages(userId);
  res.render("message/inbox", {
    title: "Inbox",
    nav,
    messages: messages.rows,
    errors: null,
  });
}

/* *****************************
 * Render new message form
 * *************************** */
async function buildNewMessage(req, res) {
  let nav = await utilities.getNav();
  const userId = req.user.account_id;
  const recipients = await accountModel.getAllAccountsExcept(userId); 
  res.render("message/new", {
    title: "New Message",
    nav,
    recipients: recipients.rows, 
    errors: null,
  });
}

/* *****************************
 * Create a new message
 * *************************** */
async function createMessage(req, res) {
  const { message_subject, message_body, message_to } = req.body;
  const message_from = req.user.account_id;

  try {
    await messageModel.createMessage(message_subject, message_body, message_to, message_from);
    req.flash("notice", "Message sent successfully.");
    res.redirect("/message/inbox");
  } catch (error) {
    console.error("Error creating message:", error);
    req.flash("notice", "An error occurred. Please try again.");
    res.redirect("/message/new");
  }
}

/* *****************************
 * Mark a message as read
 * *************************** */
async function markMessageAsRead(req, res) {
  const messageId = req.params.id; 
  const userId = req.user.account_id; 

  try {
    const result = await messageModel.markMessageAsRead(messageId, userId);
    if (result.rowCount) {
      req.flash("notice", "Message marked as read.");
    } else {
      req.flash("notice", "Failed to mark the message as read.");
    }
    res.redirect("/message/inbox"); 
  } catch (error) {
    console.error("Error marking message as read:", error);
    req.flash("notice", "An error occurred. Please try again.");
    res.redirect("/message/inbox");
  }
}

/* *****************************
 * Archive a message
 * *************************** */
async function archiveMessage(req, res) {
  const messageId = req.params.id; 
  const userId = req.user.account_id; 

  try {
    const result = await messageModel.archiveMessage(messageId, userId);
    if (result.rowCount) {
      req.flash("notice", "Message archived successfully.");
    } else {
      req.flash("notice", "Failed to archive the message.");
    }
    res.redirect("/message/inbox");
  } catch (error) {
    console.error("Error archiving message:", error);
    req.flash("notice", "An error occurred. Please try again.");
    res.redirect("/message/inbox");
  }
}

/* *****************************
 * Delete a message
 * *************************** */
async function deleteMessage(req, res) {
  const messageId = req.params.id; 
  const userId = req.user.account_id; 

  try {
    const result = await messageModel.deleteMessage(messageId, userId);
    if (result.rowCount) {
      req.flash("notice", "Message deleted successfully.");
    } else {
      req.flash("notice", "Failed to delete the message.");
    }
    res.redirect("/message/inbox");
  } catch (error) {
    console.error("Error deleting message:", error);
    req.flash("notice", "An error occurred. Please try again.");
    res.redirect("/message/inbox");
  }
}

/* *****************************
 * Render reply message form
 * *************************** */
async function buildReplyMessage(req, res) {
  let nav = await utilities.getNav();
  const messageId = req.params.id;
  const userId = req.user.account_id;

  try {
    const message = await messageModel.getMessageById(messageId, userId);
    if (message.rows.length === 0) {
      req.flash("notice", "Message not found.");
      return res.redirect("/message/inbox");
    }
    const senderEmail = message.rows[0].sender_email; 
    res.render("message/reply", {
      title: "Reply to Message",
      nav,
      message: { ...message.rows[0], sender_email: senderEmail },
      errors: null,
    });
  } catch (error) {
    console.error("Error fetching message for reply:", error);
    req.flash("notice", "An error occurred. Please try again.");
    res.redirect("/message/inbox");
  }
}

/* *****************************
 * Reply to a message
 * *************************** */
async function replyToMessage(req, res) {
  const { message_subject, message_body } = req.body;
  const message_from = req.user.account_id;
  const message_to = req.params.id; 

  try {
    await messageModel.replyToMessage(message_subject, message_body, message_to, message_from);
    req.flash("notice", "Reply sent successfully.");
    res.redirect("/message/inbox");
  } catch (error) {
    console.error("Error replying to message:", error);
    req.flash("notice", "An error occurred. Please try again.");
    res.redirect(`/message/reply/${req.params.id}`);
  }
}

module.exports = {
  buildInbox,
  buildNewMessage,
  createMessage,
  markMessageAsRead,
  archiveMessage,
  deleteMessage,
  buildReplyMessage,
  replyToMessage,
};
