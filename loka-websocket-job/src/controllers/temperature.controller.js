const { Temperature } = require("../db/models/temperatures.model");
const { Packing } = require("../db/models/packings.model");

exports.createTemperature = async (temperatureMessage) => {
  let actualPacking = await Packing.findOne({ "tag.code": temperatureMessage.src });

  if (actualPacking) {
    let messageTimestamp = temperatureMessage.timestamp;
    if (messageTimestamp.toString().length == 13) messageTimestamp = messageTimestamp / 1000;

    updateLastMessage(actualPacking, messageTimestamp);

    await Temperature.createTemperature(
      {
        tag: temperatureMessage.src,
        date: new Date(messageTimestamp * 1000),
        timestamp: messageTimestamp,
        value: temperatureMessage.analog.value,
      },
      actualPacking
    );
  }
};

const updateLastMessage = async (actualPacking, timestamp) => {
  if (actualPacking.last_message_signal) {
    if (timestamp * 1000 > new Date(actualPacking.last_message_signal).getTime()) {
      await Packing.findByIdAndUpdate(
        actualPacking._id,
        { last_message_signal: new Date(timestamp * 1000) },
        { new: true }
      ).exec();
    }
  } else {
    await Packing.findByIdAndUpdate(
      actualPacking._id,
      { last_message_signal: new Date(timestamp * 1000) },
      { new: true }
    ).exec();
  }
};
