const express = require("express");
const router = express.Router();
const temperaturesController = require("./temperatures.controller");
const auth = require("../../security/auth.middleware");

router.get("/", [auth], temperaturesController.get);
router.get("/last", [auth], temperaturesController.getLast);

module.exports = router;

// GET '/'
/**
 * @swagger
 * /temperatures:
 *   get:
 *     summary: Retrieve the temperatures of all devices with temperature messages in the specified period of time
 *     description: All temperatures in the period of time. If a period is not specified, then it returns the last 10 results.
 *     security:
 *       - Bearer: []
 *     tags:
 *       - Temperatures
 *     parameters:
 *       - name: tag
 *         description: Return position filtered by tag code
 *         in: query
 *         required: false
 *         type: string
 *       - name: start_date
 *         description: Start date of period of time. The date is GMT-0 given in the format "YYYY-MM-DDTHH:MM:SS.000Z", example "2020-10-19T22:19:30.000Z".
 *         in: query
 *         required: false
 *         type: string
 *       - name: end_date
 *         description: End date of period of time. The date is GMT-0 given in the format "YYYY-MM-DDTHH:MM:SS.000Z", example "2020-10-19T22:19:30.000Z".
 *         in: query
 *         required: false
 *         type: string 
 *     responses:
 *       200:
 *         description: list of all reports
 *       400:
 *         description: Bad Request
 *       404:
 *         description: Not Found
 */

// GET '/status'
/**
 * @swagger
 * /temperatures/last:
 *   get:
 *     summary: Retrieve the last temperature of all devices
 *     description: The last position of all devices that attend to a criteria set
 *     security:
 *       - Bearer: []
 *     tags:
 *       - Temperatures
 *     parameters:
 *       - name: company_id
 *         description: Return temperature filtered by tag code
 *         in: path
 *         required: false
 *         type: string
 *       - name: family_id
 *         description: Device's family id
 *         in: query
 *         required: false
 *         type: string
 *       - name: serial
 *         description: Device's serial
 *         in: query
 *         required: false
 *         type: string 
 *     responses:
 *       200:
 *         description: list of all reports
 *       400:
 *         description: Bad Request
 *       404:
 *         description: Not Found
 */