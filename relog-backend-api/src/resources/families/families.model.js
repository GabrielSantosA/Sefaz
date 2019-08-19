const mongoose = require('mongoose')
const Joi = require('joi')

const familySchema = new mongoose.Schema({
    code: {
        type: String,
        minlength: 2,
        maxlength: 25,
        required: true,
        unique: true
    },
    routes: [{
        type: mongoose.Schema.ObjectId,
        ref: 'Route'
    }],
    control_points: [{
        type: mongoose.Schema.ObjectId,
        ref: 'ControlPoint'
    }],
    company: {
        type: mongoose.Schema.ObjectId,
        ref: 'Company',
        required: true
    },
    created_at: {
        type: Date,
        default: Date.now

    },
    update_at: {
        type: Date,
        default: Date.now
    }
})

const validate_families = (family) => {
    const schema = Joi.object().keys({
        code: Joi.string().min(2).max(25).required(),
        company: Joi.objectId().required(),
        routes: Joi.array().items(Joi.objectId()),
        control_points: Joi.array().items(Joi.objectId())
    })

    return Joi.validate(family, schema, { abortEarly: false })
}

familySchema.statics.findByCode = function (code, projection = '') {
    return this.findOne({ code }, projection)
}

const update_updated_at_middleware = function (next) {
    let update = this.getUpdate()
    update.update_at = new Date()
    next()
}

familySchema.pre('update', update_updated_at_middleware)
familySchema.pre('findOneAndUpdate', update_updated_at_middleware)

const Family = mongoose.model('Family', familySchema)

exports.Family = Family
exports.familySchema = familySchema
exports.validate_families = validate_families