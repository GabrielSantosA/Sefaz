const debug = require("debug")("model:button");
const mongoose = require("mongoose");
const { Packing } = require("./packings.model");

const buttonSchema = new mongoose.Schema({
  tag: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  timestamp: {
    type: Number,
    required: true,
  },
  detector_switch: {
    type: Boolean,
    default: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

buttonSchema.index({ tag: 1, timestamp: -1 }, { unique: true });

const createMany = async (packing, buttonArray) => {
  for (const [index, button] of buttonArray.entries()) {
    try {
      const newButton = new Button({
        tag: packing.tag.code,
        date: new Date(button.date),
        timestamp: button.timestamp,
        detector_switch: button.detector_switch,
      });

      await newButton.save().catch((err) => debug(err));

      if (index == 0) {
        await newButton
          .save()
          .then((doc) => referenceFromPackage(packing, doc))
          .catch((err) => debug(err));
      } else {
        await newButton.save();
      }
    } catch (error) {
      debug(`Erro ao salvar a Detector Switch do device ${packing.tag.code} | ${error}`);
    }
  }
};

buttonSchema.statics.createButton = async (button, packing = null) => {
  let actualPacking = null;

  if (!packing) actualPacking = await Packing.findOne({ "tag.code": button.tag });
  else actualPacking = packing;

  let newButton = new Button({
    tag: button.tag,
    date: button.date,
    timestamp: button.timestamp,
    detector_switch: button.detector_switch,
  });

  try {
    await newButton
      .save()
      .then((newDocument) => referenceFromPackage(actualPacking, newDocument))
      .catch((error) => debug(error));
  } catch (error) {
    console.log(error);
  }
};

const referenceFromPackage = async (packing, doc) => {
  console.log("button referenceFromPackage");
  try {
    await Packing.findByIdAndUpdate(packing._id, { last_detector_switch: doc._id }, { new: true });
  } catch (error) {
    debug(error);
  }
};
const Button = mongoose.model("Button", buttonSchema);

exports.Button = Button;
exports.buttonSchema = buttonSchema;
exports.createMany = createMany;