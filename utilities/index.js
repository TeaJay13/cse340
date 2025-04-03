const jwt = require("jsonwebtoken")
require("dotenv").config()
const invModel = require("../models/inventory-model")
const Util = {}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
  let grid
  if(data.length > 0){
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => { 
      grid += '<li>'
      grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
      + 'details"><img src="' + vehicle.inv_thumbnail 
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors" /></a>'
      grid += '<div class="namePrice">'
      grid += '<hr />'
      grid += '<h2>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

/* **************************************
* Build the vehicle details view HTML
* ************************************ */
Util.buildVehicleDetail = async function(vehicle) {
  return `
      <div class="vehicle-detail">
          <h1>${vehicle.inv_make} ${vehicle.inv_model} (${vehicle.inv_year})</h1>
          <div id="vehicle-detail-content">
            <img src="${vehicle.inv_thumbnail}" alt="${vehicle.inv_make} ${vehicle.inv_model}">
            <div id="vehicle-detail-info">
              <p><strong>Price:</strong> $${vehicle.inv_price.toLocaleString("en-US")}</p>
              <p><strong>Mileage:</strong> ${vehicle.inv_miles.toLocaleString()} miles</p>
              <p><strong>Color:</strong> ${vehicle.inv_color}</p>
              <p><strong>Description:</strong> ${vehicle.inv_description}</p>
            </div>
          </div>
      </div>
  `;
};

/* **************************************
* Build the classification drop-down list
* ************************************ */
Util.buildClassificationList = async function (classification_id = null) {
  let data = await invModel.getClassifications();
  let classificationList = `
    <select name="classification_id" id="classificationList" required>
      <option value=''>Choose a Classification</option>
  `;
  data.rows.forEach((row) => {
    classificationList += `
      <option value="${row.classification_id}" ${classification_id != null && row.classification_id == classification_id ? 'selected' : ''}>
        ${row.classification_name}
      </option>
    `;
  });
  classificationList += "</select>";
  return classificationList;
}

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

/* ****************************************
* Middleware to check token validity
**************************************** */
Util.checkJWTToken = (req, res, next) => {
  if (req.cookies.jwt) {
    jwt.verify(
      req.cookies.jwt,
      process.env.ACCESS_TOKEN_SECRET,
      function (err, accountData) {
        if (err) {
          req.flash("notice", "Please log in.")
          res.clearCookie("jwt")
          return res.redirect("/account/login")
        }
        req.user = accountData // Attach decoded JWT data to req.user
        res.locals.accountData = accountData
        res.locals.loggedin = 1 // Mark user as logged in
        next()
      }
    )
  } else {
    res.locals.loggedin = 0 // Mark user as not logged in
    next()
  }
}

/* ****************************************
 * Middleware to verify JWT and attach user data
 * *************************************** */
function verifyJWT(req, res, next) {
  const token = req.cookies.jwt
  if (!token) {
    req.flash("notice", "You must be logged in to view this page.")
    return res.redirect("/account/login")
  }
  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    req.user = decoded
    next()
  } catch (error) {
    console.error("JWT verification failed:", error)
    req.flash("notice", "Invalid session. Please log in again.")
    res.redirect("/account/login")
  }
}

/* ****************************************
 *  Check Login
 * ************************************ */
Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next()
  } else {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }
 }

module.exports = {
  ...Util,
  verifyJWT,
}
