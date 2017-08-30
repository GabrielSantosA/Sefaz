const mongoose          = require('mongoose');
const mongoosePaginate  = require('mongoose-paginate');

const plantSchema = new mongoose.Schema({
    plant_name:{type: String, required: true, unique: true},
    lat: {type: Number},
    lng: {type: Number},
    logistic_operator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'LogisticOperator'
    },
    supplier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Supplier'
    },
    location: String,
    profile: [String]

});

plantSchema.plugin(mongoosePaginate);
mongoose.model('Plant', plantSchema);
