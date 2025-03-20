const pool = require("../database/")
const { get } = require("../routes/static")

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications(){
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}




/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
    try {
      const data = await pool.query(
        `SELECT * FROM public.inventory AS i 
        JOIN public.classification AS c 
        ON i.classification_id = c.classification_id 
        WHERE i.classification_id = $1`,
        [classification_id]
      )
      return data.rows
    } catch (error) {
      console.error("getclassificationsbyid error " + error)
    }
}

// function to retrieve vehicle details by vehicle id
async function getVehicleById(inv_id) {
  try {
      const query = `
          SELECT * FROM public.inventory AS i 
          JOIN public.classification AS c 
          ON i.classification_id = c.classification_id 
          WHERE i.inv_id = $1`;
      const data = await pool.query(query, [inv_id]);
      return data.rows.length > 0 ? data.rows[0] : null;
  } catch (error) {
      console.error("getVehicleById error:", error);
      return null;
  }
}

// Function to insert a new classification into database
async function addClassification(classification_name){
  try {
    const query = `INSERT INTO public.classification (classification_name) VALUES ($1)`;
    return await pool.query(query, [classification_name]);
  } catch (error) {
    return error.message
  }
}

// Function to insert a new vehicle into the inventory table
async function addInventory(vehicleData){
  try {
    const query = `
      INSERT INTO public.inventory 
      (classification_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`;
    const values = [
      vehicleData.classification_id,
      vehicleData.inv_make,
      vehicleData.inv_model,
      vehicleData.inv_year,
      vehicleData.inv_description,
      vehicleData.inv_image,
      vehicleData.inv_thumbnail,
      vehicleData.inv_price,
      vehicleData.inv_miles,
      vehicleData.inv_color
    ];
    return await pool.query(query, values);
  } catch (error) {
    return error.message
  }
}

module.exports = {
  getClassifications,
  getInventoryByClassificationId,
  getVehicleById,
  addClassification,
  addInventory
};