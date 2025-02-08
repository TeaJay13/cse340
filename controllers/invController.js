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


module.exports = invCont