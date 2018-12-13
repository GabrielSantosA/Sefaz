const mongoose = require('mongoose')
// const config = require('config')
// const { Company } = require('./companies.model')

describe('Company unit test', () => {
    describe('validate_object_id', () => {
        it('should validate a object_id if is an invalid _id', () => {
            const obj_id = 'invalid_id'
            const result = mongoose.Types.ObjectId.isValid(obj_id)
            expect(result).toBe(false)
        })
        it('should validate a object_id if is a valid _id', () => {
            const obj_id = mongoose.Types.ObjectId()
            const result = mongoose.Types.ObjectId.isValid(obj_id)
            expect(result).toBe(true)
        })
    })
})