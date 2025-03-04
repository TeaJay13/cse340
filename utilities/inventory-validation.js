const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}

/*  **********************************
    *  Inventory Data Validation Rules
    * ********************************* */
validate.inventoryRules = () => {
    return [
        body("classification_id")
            .notEmpty()
            .withMessage("Classification is required."),
        body("inv_make")
            .trim()
            .escape()
            .notEmpty()
            .withMessage("Make is required."),
        body("inv_model")
            .trim()
            .escape()
            .notEmpty()
            .withMessage("Model is required."),
        body("inv_year")
            .isInt({ min: 1886 })
            .withMessage("Valid year is required."),
        body("inv_description")
            .trim()
            .escape()
            .notEmpty()
            .withMessage("Description is required."),
        body("inv_image")
            .trim()
            .escape()
            .notEmpty()
            .withMessage("Image path is required."),
        body("inv_thumbnail")
            .trim()
            .escape()
            .notEmpty()
            .withMessage("Thumbnail path is required."),
        body("inv_price")
            .isFloat({ min: 0 })
            .withMessage("Valid price is required."),
        body("inv_miles")
            .isInt({ min: 0 })
            .withMessage("Valid miles are required."),
        body("inv_color")
            .trim()
            .escape()
            .notEmpty()
            .withMessage("Color is required.")
    ]
}

/* ******************************
    * Check data and return errors or continue to registration
    * ***************************** */
validate.checkInventoryData = async (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        let classificationList = await utilities.buildClassificationList(req.body.classification_id)
        res.render("inventory/add-inventory", {
            title: "Add Inventory",
            nav,
            classificationList,
            errors,
            inv_make: req.body.inv_make,
            inv_model: req.body.inv_model,
            inv_year: req.body.inv_year,
            inv_description: req.body.inv_description,
            inv_image: req.body.inv_image,
            inv_thumbnail: req.body.inv_thumbnail,
            inv_price: req.body.inv_price,
            inv_miles: req.body.inv_miles,
            inv_color: req.body.inv_color
        })
    } else {
        next()
    }
}

module.exports = validate
