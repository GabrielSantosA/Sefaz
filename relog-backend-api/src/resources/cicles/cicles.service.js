const debug = require('debug')('service:engine_types')
const _ = require('lodash')
const { Cicle } = require('./cicles.model')


exports.get_cicles = async (id) => {
    try {
        if (!id) return await Cicle.find()
        .populate("Rack", ["_id", "name"])
        .populate("ControlPoint", ["_id", "name", "full_address"]);

        const data = await Cicle.findById(id)
        return data ? [data] : []
    } catch (error) {
        throw new Error(error)
    }
 }


exports.create_cicle = async (cicle) => {
    try {
        const new_cicle = new Cicle(cicle)
        await new_cicle.save()
        return new_cicle
    } catch (error) {
        throw new Error(error)
    }
}

exports.find_by_id = async (id) => {
    try {
        const cicle = await Cicle.findById(id)
        .populate("Rack", ["_id", "name"])
        .populate("ControlPoint", ["_id", "name", "full_address"]);
        return cicle
    } catch (error) {
        throw new Error(error)
    }
}

exports.update_cicle = async (id, cicle_edited) => {
    try {
        const options = { runValidators: true, new: true }
        const cicle = await Cicle.findByIdAndUpdate(id, cicle_edited, options)

        return cicle
    } catch (error) {
        throw new Error(error)
    }
}
