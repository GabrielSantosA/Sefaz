const express = require('express')
const router = express.Router()
const home_controller = require('./home.controller')
const auth = require('../../security/auth.middleware')

router.get('/', auth, home_controller.home_report)
router.get('/low_battery', auth, home_controller.home_low_battery_report)
router.get('/permanence_time_exceeded', auth, home_controller.home_permanence_time_exceeded_report)

module.exports = router

// GET '/'
/**
 * @swagger
 * /home:
 *   get:
 *     summary: Retrieve home on database
 *     description: Retrieve general report about all packings
 *     security:
 *       - Bearer: []
 *     tags:
 *       - Home
 *     parameters:
 *       - name: current_state
 *         description: analise, local_incorreto, local_correto, perdida, sem_sinal
 *         in: query
 *         required: false
 *         type: string
 *     responses:
 *       200:
 *         description: list of all home
 *       400:
 *         description: Bad Request
 *       404:
 *         description: Not Found
 */

// GET '/low_battery'
/**
 * @swagger
 * /home/low_battery:
 *   get:
 *     summary: Retrieve home on database
 *     description: Retrieve general report about all packings
 *     security:
 *       - Bearer: []
 *     tags:
 *       - Home
 *     responses:
 *       200:
 *         description: list of all home
 *       400:
 *         description: Bad Request
 *       404:
 *         description: Not Found
 */

// GET '/permanence_time_exceeded'
/**
 * @swagger
 * /home/permanence_time_exceeded:
 *   get:
 *     summary: Retrieve home on database
 *     description: Retrieve general report about all packings
 *     security:
 *       - Bearer: []
 *     tags:
 *       - Home
 *     responses:
 *       200:
 *         description: list of all home
 *       400:
 *         description: Bad Request
 *       404:
 *         description: Not Found
 */