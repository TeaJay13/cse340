const { body, validationResult } = require("express-validator");
const validate = {};

/* *****************************
 * Validation rules for creating a new message
 * *************************** */
validate.newMessageRules = () => {
  return [
    body("message_to")
      .notEmpty()
      .withMessage("Recipient is required.")
      .isInt()
      .withMessage("Recipient must be a valid user ID."),
    body("message_subject")
      .notEmpty()
      .withMessage("Subject is required.")
      .isLength({ min: 1 })
      .withMessage("Subject must be at least 1 character long."),
    body("message_body")
      .notEmpty()
      .withMessage("Message body is required.")
      .isLength({ min: 1 })
      .withMessage("Message body must be at least 1 character long."),
  ];
};

/* *****************************
 * Validation rules for replying to a message
 * *************************** */
validate.replyMessageRules = () => {
  return [
    body("message_subject")
      .notEmpty()
      .withMessage("Subject is required.")
      .isLength({ min: 1 })
      .withMessage("Subject must be at least 1 character long."),
    body("message_body")
      .notEmpty()
      .withMessage("Message body is required.")
      .isLength({ min: 1 })
      .withMessage("Message body must be at least 1 character long."),
  ];
};

/* *****************************
 * Middleware to check validation results
 * *************************** */
validate.checkMessageData = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const nav = await require("../utilities").getNav();
    const { message_subject, message_body, message_to } = req.body;

    // Render the appropriate view based on the route
    if (req.originalUrl.includes("/reply")) {
      return res.status(400).render("message/reply", {
        title: "Reply to Message",
        nav,
        errors: errors.array(),
        message: { message_subject, message_body, message_to },
      });
    } else {
      return res.status(400).render("message/new", {
        title: "New Message",
        nav,
        errors: errors.array(),
        message_subject,
        message_body,
        message_to,
      });
    }
  }
  next();
};

module.exports = validate;
