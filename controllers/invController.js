const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

/* ***************************
 *  Get details for a specific vehicle
 * ************************** */
invCont.getVehicleDetail = async function (req, res, next) {
  try {
      const vehicleId = req.params.id;
      const vehicleData = await invModel.getVehicleById(vehicleId);

      if (!vehicleData) {
          return res.status(404).render('errors/404', { message: 'Vehicle not found' });
      }
    
    let nav = await utilities.getNav()
    const vehicleHTML = await utilities.buildVehicleDetail(vehicleData)

    res.render("./inventory/detail", {
      title: vehicleData.inv_make + " " + vehicleData.inv_model,
      nav,
      vehicleHTML,
    })
  }
  catch (error) {
    console.error("getVehicleDetail error " + error)
  }
};

/* ***************************
  *  Render inventory management page
  * ************************** */
invCont.buildManagement = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("./inventory/management", {
    title: "Manage Inventory",
    nav,
    errors: null,
  })
}

/* ***************************
  *  Render add classification page
  * ************************** */
invCont.buildAddClassification = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("./inventory/add-classification", {
    title: "Add Classification",
    nav,
    errors: null,
  })
}

/* ***************************
  *  Process add classification
  * ************************** */
invCont.addClassification = async function (req, res) {
  let nav = await utilities.getNav();
  const { classification_name } = req.body;

  const result = await invModel.addClassification(classification_name);

  if (result) {
    req.flash('notice', 'Classification added successfully.');
    res.status(201).redirect('/inv/management');
  } else {
    req.flash('notice', 'Failed to add classification.');
    res.status(500).render("inventory/add-classification", {
      title: "Add Classification",
      nav,
      notice: req.flash('notice'),
      errors: null
    });
  }
}

/* ***************************
  *  Render add inventory page
  * ************************** */
invCont.buildAddInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  let classificationList = await utilities.buildClassificationList()
  res.render("./inventory/add-inventory", {
    title: "Add Inventory",
    nav,
    classificationList,
    errors: null,
    inv_make: "",
    inv_model: "",
    inv_year: "",
    inv_description: "",
    inv_image: "",
    inv_thumbnail: "",
    inv_price: "",
    inv_miles: "",
    inv_color: ""
  })
}

/* ***************************
  *  Process add inventory
  * ************************** */
invCont.addInventory = async function (req, res) {
  let nav = await utilities.getNav();
  const vehicleData = req.body;

  const result = await invModel.addInventory(vehicleData);

  if (result) {
    req.flash('notice', 'Vehicle added successfully.');
    res.status(201).redirect('/inv/management');
  } else {
    req.flash('notice', 'Failed to add vehicle.');
    let classificationList = await utilities.buildClassificationList(vehicleData.classification_id)
    res.status(500).render("inventory/add-inventory", {
      title: "Add Inventory",
      nav,
      classificationList,
      notice: req.flash('notice'),
      errors: null,
    });
  }
}

module.exports = invCont