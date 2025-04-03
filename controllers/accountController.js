// Require utilities index

const utilities = require("../utilities")
const accountModel = require("../models/account-model")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
require("dotenv").config()

/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/login", {
      title: "Login",
      nav,
      errors: null,
    })
  }

/* ****************************************
*  Deliver registration view
* *************************************** */
async function buildRegister(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/register", {
      title: "Register",
      nav,
      errors: null,
    })
  }

/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_password } = req.body

  // Hash the password before storing
  let hashedPassword
  try {
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the registration.')
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    })
    return
  }

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  )

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    )
    res.status(201).render("account/login", {
      title: "Login",
      nav,
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
    })
  }
}

/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email) // Fetch account data by email
  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.")
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    })
    return
  }
  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password
      const tokenPayload = {
        account_id: accountData.account_id,
        account_type: accountData.account_type,
        account_firstname: accountData.account_firstname,
        account_lastname: accountData.account_lastname,
        account_email: accountData.account_email,
      }
      const accessToken = jwt.sign(tokenPayload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1h" })
      res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 }) // Set JWT cookie
      res.locals.accountData = tokenPayload
      res.locals.loggedin = 1
      return res.redirect("/account") // Redirect to account management
    } else {
      req.flash("notice", "Please check your credentials and try again.")
      res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      })
    }
  } catch (error) {
    console.error("Error during login:", error)
    req.flash("notice", "An error occurred during login. Please try again.")
    res.redirect("/account/login")
  }
}

/* ****************************************
*  Deliver account management view
* *************************************** */
async function buildAccount(req, res, next) {
  let nav = await utilities.getNav();
  if (!req.user || !req.user.account_id) {
    req.flash("notice", "You must be logged in to view this page.");
    return res.redirect("/account/login");
  }
  try {
    const accountData = await accountModel.getAccountById(req.user.account_id); // Fetch account data using account_id
    if (accountData.rows.length === 0) {
      req.flash("notice", "Account not found.");
      return res.redirect("/account/login");
    }
    res.render("account/account", {
      title: "Account Management",
      nav,
      errors: [],
      messages: req.flash("notice") || [],
      accountData: accountData.rows[0],
      account_type: accountData.rows[0].account_type, // Pass account_type to the view
    });
  } catch (error) {
    console.error("Error fetching account data:", error);
    req.flash("notice", "An error occurred while retrieving account information.");
    res.redirect("/");
  }
}

/* ****************************************
*  Deliver account update view
* *************************************** */
async function buildAccountUpdate(req, res, next) {
  let nav = await utilities.getNav();
  const accountData = await accountModel.getAccountById(req.params.id); // Fetch account data by ID

  if (accountData.rows.length > 0) {
    res.render("account/update", {
      title: "Update Account",
      nav,
      errors: null,
      accountData: accountData.rows[0],
      account_id: accountData.rows[0].account_id,
    });
  } else {
    req.flash("notice", "Account not found.");
    res.redirect("/account");
  }
}

/* ****************************************
*  Process account update
* *************************************** */
async function updateAccount(req, res) {
  let nav = await utilities.getNav();
  console.log("Request Body:", req.body); // Log the entire request body
  const { account_id, account_firstname, account_lastname, account_email } = req.body;

  if (!account_id) {
    console.error("Account ID is missing in the request body.");
    req.flash("notice", "An error occurred. Please try again.");
    return res.status(400).render("account/update", {
      title: "Update Account",
      nav,
      errors: null,
      accountData: req.body,
    });
  }

  try {
    const updateResult = await accountModel.updateAccount(account_id, account_firstname, account_lastname, account_email);
    if (updateResult.rowCount) {
      const accountUser = `${account_firstname} ${account_lastname}`;
      req.flash("notice", `Account updated successfully, ${accountUser}.`);
      return res.redirect("/account");
    } else {
      req.flash("notice", "Account update failed.");
      res.status(400).render("account/update", {
        title: "Update Account",
        nav,
        errors: null,
        accountData: req.body, // Pass the form data back to the view
      });
    }
  } catch (error) {
    console.error("Error during account update:", error);
    req.flash("notice", "An error occurred during the update. Please try again.");
    res.status(500).render("account/update", {
      title: "Update Account",
      nav,
      errors: null,
      accountData: req.body, // Pass the form data back to the view
    });
  }
}

/* ****************************************
*  Process password change
* *************************************** */
async function updatePassword(req, res) {
  let nav = await utilities.getNav();
  const { account_id, account_password } = req.body;

  if (!account_id) {
    console.error("Account ID is missing in the request body.");
    req.flash("notice", "An error occurred. Please try again.");
    return res.status(400).render("account/update", {
      title: "Update Account",
      nav,
      errors: null,
      accountData: { account_id }, // Pass the account ID back to the view
    });
  }

  try {
    const hashedPassword = await bcrypt.hash(account_password, 10);
    const updateResult = await accountModel.updatePassword(account_id, hashedPassword);
    if (updateResult.rowCount) {
      req.flash("notice", "Password updated successfully.");
      return res.redirect("/account");
    } else {
      req.flash("notice", "Password update failed.");
      res.status(400).render("account/update", {
        title: "Update Account",
        nav,
        errors: null,
        accountData: { account_id }, // Pass the account ID back to the view
      });
    }
  } catch (error) {
    console.error("Error during password update:", error);
    req.flash("notice", "An error occurred during the password update. Please try again.");
    res.status(500).render("account/update", {
      title: "Update Account",
      nav,
      errors: null,
      accountData: { account_id }, // Pass the account ID back to the view
    });
  }
}

/* ****************************************
*  Logout process
* *************************************** */
function logout(req, res) {
  res.clearCookie("jwt")
  req.flash("notice", "You have been logged out.")
  res.redirect("/")
}

module.exports = { 
  buildLogin, 
  buildRegister, 
  registerAccount, 
  accountLogin, 
  buildAccount, 
  buildAccountUpdate, 
  updateAccount,
  updatePassword,
  logout 
}

