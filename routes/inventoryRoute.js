// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities")
const classificationValidate = require("../utilities/classification-validation")
const inventoryValidate = require("../utilities/inventory-validation")

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

// Route to get vehicle details by vehicle id
router.get("/detail/:id", invController.getVehicleDetail);

// Route to get display inventory management page
router.get("/management", invController.buildManagementView);

// Route to get add-classification page
router.get("/add-classification", invController.buildAddClassification);

// Route to handle post submission of add-classification form
router.post(
    "/add-classification",
    classificationValidate.classificationRules(),
    classificationValidate.checkClassData,
    utilities.handleErrors(invController.addClassification)
)

// Route to get add-inventory page
router.get("/add-inventory", invController.buildAddInventory);

// Route to handle post submission of add-inventory form
router.post(
    "/add-inventory",
    inventoryValidate.inventoryRules(),
    inventoryValidate.checkInventoryData,
    utilities.handleErrors(invController.addInventory)
)

// Route to handle fetching inventory data based on classification
router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))

// Route to build edit inventory view
router.get(
    "/edit/:inv_id",
    utilities.handleErrors(invController.editInventoryView)
);

// Route to handle update inventory
router.post(
  "/update/",
  inventoryValidate.inventoryRules(), // Reuse inventoryRules
  inventoryValidate.checkUpdateData,
  invController.updateInventory
);

module.exports = router;