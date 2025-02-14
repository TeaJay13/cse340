// Needed Resources 
const express = require("express")
const router = new express.Router() 
const accountController = require("../controllers/accountController")
const utilities = require("../utilities")


//Get route for path sent from the "My Account" link when clicked
router.get("/login", utilities.handleErrors(accountController.buildLogin))

module.exports = router