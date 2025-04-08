const pool = require("../database");

/* *****************************
 * Create a new message
 * *************************** */
async function createMessage(subject, body, to, from) {
  try {
    const sql = `
      INSERT INTO message (message_subject, message_body, message_to, message_from)
      VALUES ($1, $2, $3, $4)
      RETURNING *`;
    return await pool.query(sql, [subject, body, to, from]);
  } catch (error) {
    return error.message;
  }
}

/* *****************************
 * Get inbox messages for a user
 * *************************** */
async function getInboxMessages(userId) {
  try {
    const sql = `
      SELECT m.message_id, m.message_subject, m.message_created, a.account_firstname AS sender, m.message_read
      FROM message m
      JOIN account a ON m.message_from = a.account_id
      WHERE m.message_to = $1 AND m.message_archived = FALSE
      ORDER BY m.message_created DESC`;
    return await pool.query(sql, [userId]);
  } catch (error) {
    return error.message;
  }
}

/* *****************************
 * Get archived messages for a user
 * *************************** */
async function getArchivedMessages(userId) {
  try {
    const sql = `
      SELECT m.message_id, m.message_subject, m.message_created, a.account_firstname AS sender, m.message_read
      FROM message m
      JOIN account a ON m.message_from = a.account_id
      WHERE m.message_to = $1 AND m.message_archived = TRUE
      ORDER BY m.message_created DESC`;
    return await pool.query(sql, [userId]);
  } catch (error) {
    return error.message;
  }
}

/* *****************************
 * Get a single message by ID
 * *************************** */
async function getMessageById(messageId, userId) {
  try {
    const sql = `
      SELECT m.*, 
             sender.account_email AS sender_email
      FROM message m
      JOIN account sender ON m.message_from = sender.account_id
      WHERE m.message_id = $1 AND (m.message_to = $2 OR m.message_from = $2)`;
    return await pool.query(sql, [messageId, userId]);
  } catch (error) {
    return error.message;
  }
}

/* *****************************
 * Mark a message as read
 * *************************** */
async function markMessageAsRead(messageId, userId) {
  try {
    const sql = `
      UPDATE message
      SET message_read = TRUE
      WHERE message_id = $1 AND message_to = $2`;
    return await pool.query(sql, [messageId, userId]);
  } catch (error) {
    return error.message;
  }
}

/* *****************************
 * Archive a message
 * *************************** */
async function archiveMessage(messageId, userId) {
  try {
    const sql = `
      UPDATE message
      SET message_archived = TRUE
      WHERE message_id = $1 AND message_to = $2`;
    return await pool.query(sql, [messageId, userId]); 
  } catch (error) {
    return error.message;
  }
}

/* *****************************
 * Delete a message
 * *************************** */
async function deleteMessage(messageId, userId) {
  try {
    const sql = `
      DELETE FROM message
      WHERE message_id = $1 AND message_to = $2`;
    return await pool.query(sql, [messageId, userId]);
  } catch (error) {
    return error.message;
  }
}

/* *****************************
 * Reply to a message
 * *************************** */
async function replyToMessage(subject, body, to, from) {
  try {
    const sql = `
      INSERT INTO message (message_subject, message_body, message_to, message_from)
      VALUES ($1, $2, $3, $4)
      RETURNING *`;
    return await pool.query(sql, [subject, body, to, from]);
  } catch (error) {
    return error.message;
  }
}

module.exports = {
  createMessage,
  getInboxMessages,
  getArchivedMessages,
  getMessageById,
  markMessageAsRead,
  archiveMessage,
  deleteMessage,
  replyToMessage,
};
