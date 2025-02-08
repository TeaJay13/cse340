const pool = require("../database/")
const { get } = require("../routes/static")

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications(){
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}

module.exports = {getClassifications}


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

module.exports = {getClassifications, getInventoryByClassificationId, getVehicleById}