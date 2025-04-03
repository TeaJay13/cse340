// Needed Resources 
const express = require("express")
const router = new express.Router() 
const accountController = require("../controllers/accountController")
const utilities = require("../utilities")
const regValidate = require("../utilities/account-validation")

// Get route for path sent from the "My Account" link when clicked
router.get("/login", utilities.handleErrors(accountController.buildLogin))

// Process the login data
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
)

// Registration route
router.get("/register", utilities.handleErrors(accountController.buildRegister))

// Process the registration data
router.post(
  "/register",
  regValidate.registationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
)

// Account route
router.get("/account", utilities.checkJWTToken, utilities.handleErrors(accountController.buildAccount))

// Protect the root account route
router.get("/", utilities.checkLogin, utilities.handleErrors(accountController.buildAccount))

// Logout route
router.get("/logout", utilities.handleErrors(accountController.logout))

// Deliver account update view
router.get(
  "/update/:id",
  utilities.checkJWTToken,
  utilities.handleErrors(accountController.buildAccountUpdate)
);

// Process account update
router.post(
  "/update",
  regValidate.updateAccountRules(),
  regValidate.checkUpdateData,
  utilities.handleErrors(accountController.updateAccount)
);

// Process password change
router.post(
  "/update-password",
  regValidate.passwordRules(),
  regValidate.checkPasswordData,
  utilities.handleErrors(accountController.updatePassword)
);

module.exports = router