const debug = require('debug')('startup:user')
const { User } = require('../resources/users/users.model')
const { Company } = require('../resources/companies/companies.model')
const { Setting } = require('../resources/settings/settings.model')
const config = require('config')

const dm_temp_test = require('../services/loka/dm.temp.testes')
const job = require('../jobs/loka/dm.job')
const initialize_data = require('./temp-initialize.script')

const startupUser = async () => {
    try {
        const users = await User.find()
        if (!users.length) {
            const newCompany = await Company.findOne({ type: 'owner' })
            // await newCompany.save()
            
            const newUser = new User({ full_name: 'Admin', email: 'admin@admin.smart', password: 'admin123', role: 'admin', company: newCompany._id })
            await newUser.save()

            // const setting = new Setting({
            //     enable_gc16: true,
            //     battery_level_limit: 18,
            //     job_schedule_time_in_sec: 50,
            //     range_radius: 3000,
            //     clean_historic_moviments_time: 1440,
            //     no_signal_limit_in_days: 2
            // })

            // await setting.save()
            
            debug('Startup user with success.')
        } else {
            debug('Company and User already created.')

            // await initialize_data()

            // await dm_temp_test.test_login()
            // await dm_temp_test.test_messages()
            // await dm_temp_test.test_positions()
            // dm_temp_test.test_deviceById()
            // dm_temp_test.test_devices_list()
            // dm_temp_test.test_confirmDevice()
            // dm_temp_test.test_getDeviceDataFromMidd()
            
            // await job()

            // debug('job encerrado')
        }
    } catch (error) {
        debug('Something failed when startup a user.')
        throw new Error(error)
    }
}

module.exports = () => {
    startupUser()
}