const express = require("express");
const router = new express.Router();
const messageController = require("../controllers/messageController");
const utilities = require("../utilities");

// Default route for /message
router.get("/", utilities.checkJWTToken, (req, res) => {
  res.redirect("/message/inbox"); // Redirect to inbox by default
});

// Inbox route
router.get("/inbox", utilities.checkJWTToken, messageController.buildInbox);

// New message route
router.get("/new", utilities.checkJWTToken, messageController.buildNewMessage);

// Create message route
router.post("/new", utilities.checkJWTToken, messageController.createMessage);

// Mark a message as read
router.get("/read/:id", utilities.checkJWTToken, messageController.markMessageAsRead);

// Archive a message
router.get("/archive/:id", utilities.checkJWTToken, messageController.archiveMessage);
router.post("/archive/:id", utilities.checkJWTToken, messageController.archiveMessage);

// Delete a message
router.get("/delete/:id", utilities.checkJWTToken, messageController.deleteMessage);

// Reply to a message
router.get("/reply/:id", utilities.checkJWTToken, messageController.buildReplyMessage);
router.post("/reply/:id", utilities.checkJWTToken, messageController.replyToMessage);

module.exports = router;
