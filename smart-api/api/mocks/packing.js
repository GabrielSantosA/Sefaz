const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
const mongooseAggregatePaginate = require('mongoose-aggregate-paginate');


const packingSchema = new mongoose.Schema({
  code: {type: String, required: true},
  type: String,
  weigth: Number,
  width: Number,
  heigth: Number,
  length: Number,
  capacity: Number,
  battery: Number,
  problem: Boolean,
  missing: Boolean,
  lastCommunication: Number,
  permanence: {
    time_exceeded: Boolean,
    date: Number,
    amount_days: Number
  },
  trip: {
    time_exceeded: Boolean,
    date: Number,
    time_countdown: Number,
  },
  packing_missing: {
    last_time: Number,
    time_countdown: Number,
  },
  position: {
    latitude: Number,
    longitude: Number,
    accuracy: Number,
    date: Number
  },
  actual_gc16: {
    days: Number,
    max: Number,
    min: Number,
  },
  temperature: Number,
  serial: {
    type: String,
    required: true,
    unique: true
  },
  correct_plant_factory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Plant'
  },
  gc16: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'GC16'
  },
  routes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Route'
  }],
  correct_plant_supplier: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Plant'
  },
  actual_plant: {
    plant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Plant'
    },
    local: String
  },
  tag: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tags'
  },
  code_tag: String,
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department'
  },
  supplier: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Supplier'
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project'
  },
  hashPacking: String

});

packingSchema.plugin(mongooseAggregatePaginate);
packingSchema.plugin(mongoosePaginate);
mongoose.model('Packing', packingSchema);
