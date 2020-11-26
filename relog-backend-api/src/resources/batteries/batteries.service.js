const debug = require("debug")("service:batteries");
const mongoose = require("mongoose");
const _ = require("lodash");
const { Battery } = require("./batteries.model"); 
const { Packing } = require("../packings/packings.model");


exports.create = async (data) => {
   try { 
      const newBattery = new Battery(data);
      await newBattery.save();
      return newBattery;
   } catch (error) {
      throw new Error(error);
   }
};

exports.get = async ({ tag = null, start_date = null, end_date = null, max = null }) => {
   let conditions = {};
   let projection = {};
   let options = {};

   if (tag) conditions.tag = tag;
   // options.sort = { message_date: -1 };

   try {
      // Periodo of time
      if (start_date && end_date)
         if (isNaN(start_date) && isNaN(end_date))
            conditions.date = {
               $gte: new Date(start_date),
               $lte: new Date(end_date),
            };
         else
            conditions.timestamp = {
               $gte: start_date,
               $lte: end_date,
            };
      else if (start_date){
         if (isNaN(start_date)) conditions.date = { $gte: new Date(start_date) };
         else conditions.timestamp = { $gte: start_date };
      }
      else if (end_date){
         console.log("end_date", end_date);
         if (isNaN(end_date)) conditions.date = { $lte: new Date(end_date) };
         else conditions.timestamp = { $lte: end_date };
      }
      
      if (!start_date && !end_date) options.limit = parseInt(max);

      return await Battery.find(conditions, projection, options);
   } catch (error) {
      throw new Error(error);
   }
};

exports.getLast = async ({ companyId = null, familyId = null, serial = null }) => {
   try {
      let packings = [];

      switch (true) {
         // company, family and serial
         case companyId != null && familyId != null && serial != null:
            console.log("c, f e s");
            packings = await Packing.aggregate([
               {
                  $project: {
                     tag: 1,
                     family: 1,
                     serial: 1,
                     last_battery: 1,
                  },
               },
               {
                  $lookup: {
                     from: "families",
                     localField: "family",
                     foreignField: "_id",
                     as: "family",
                  },
               },
               {
                  $unwind: {
                     path: "$family",
                     preserveNullAndEmptyArrays: true,
                  },
               },
               {
                  $lookup: {
                     from: "batteries",
                     localField: "last_battery",
                     foreignField: "_id",
                     as: "last_battery",
                  },
               },
               {
                  $unwind: {
                     path: "$last_battery",
                     preserveNullAndEmptyArrays: true,
                  },
               },
               {
                  $match: {
                     "family._id": new mongoose.Types.ObjectId(familyId),
                     "family.company": new mongoose.Types.ObjectId(companyId),
                     serial: serial,
                  },
               },
               {
                  $project: {
                     "tag.code": 1,
                     serial: 1,
                     "family._id": 1,
                     "family.code": 1,
                     "family.company": 1,
                     "last_battery.date": 1,
                     "last_battery.timestamp": 1,
                     "last_battery.battery": 1,
                     "last_battery.batteryVoltage": 1,
                  },
               },
            ]);
            break;

         // company and family
         case companyId != null && familyId != null:
            console.log("c e f");
            packings = await Packing.aggregate([
               {
                  $project: {
                     tag: 1,
                     family: 1,
                     serial: 1,
                     last_battery: 1,
                  },
               },
               {
                  $lookup: {
                     from: "families",
                     localField: "family",
                     foreignField: "_id",
                     as: "family",
                  },
               },
               {
                  $unwind: {
                     path: "$family",
                     preserveNullAndEmptyArrays: true,
                  },
               },
               {
                  $match: {
                     "family._id": new mongoose.Types.ObjectId(familyId),
                     "family.company": new mongoose.Types.ObjectId(companyId),
                  },
               },
               {
                  $lookup: {
                     from: "batteries",
                     localField: "last_battery",
                     foreignField: "_id",
                     as: "last_battery",
                  },
               },
               {
                  $unwind: {
                     path: "$last_battery",
                     preserveNullAndEmptyArrays: true,
                  },
               },
               {
                  $project: {
                     "tag.code": 1,
                     serial: 1,
                     "family._id": 1,
                     "family.code": 1,
                     "family.company": 1,
                     "last_battery.date": 1,
                     "last_battery.timestamp": 1,
                     "last_battery.battery": 1,
                     "last_battery.batteryVoltage": 1,
                  },
               },
            ]);
            break;

         // company and serial
         case companyId != null && serial != null:
            console.log("c e s");
            packings = await Packing.aggregate([
               {
                  $project: {
                     tag: 1,
                     family: 1,
                     serial: 1,
                     last_battery: 1,
                  },
               },
               {
                  $lookup: {
                     from: "families",
                     localField: "family",
                     foreignField: "_id",
                     as: "family",
                  },
               },
               {
                  $unwind: {
                     path: "$family",
                     preserveNullAndEmptyArrays: true,
                  },
               },
               {
                  $match: {
                     "family.company": new mongoose.Types.ObjectId(companyId),
                     serial: serial,
                  },
               },
               {
                  $lookup: {
                     from: "batteries",
                     localField: "last_battery",
                     foreignField: "_id",
                     as: "last_battery",
                  },
               },
               {
                  $unwind: {
                     path: "$last_battery",
                     preserveNullAndEmptyArrays: true,
                  },
               },
               {
                  $project: {
                     "tag.code": 1,
                     serial: 1,
                     "family._id": 1,
                     "family.code": 1,
                     "family.company": 1,
                     "last_battery.date": 1,
                     "last_battery.timestamp": 1,
                     "last_battery.battery": 1,
                     "last_battery.batteryVoltage": 1,
                  },
               },
            ]);
            break;

         //family and serial
         case familyId != null && serial != null:
            console.log("f e s");
            packings = await Packing.aggregate([
               {
                  $project: {
                     tag: 1,
                     family: 1,
                     serial: 1,
                     last_battery: 1,
                  },
               },
               {
                  $lookup: {
                     from: "families",
                     localField: "family",
                     foreignField: "_id",
                     as: "family",
                  },
               },
               {
                  $unwind: {
                     path: "$family",
                     preserveNullAndEmptyArrays: true,
                  },
               },
               {
                  $match: {
                     "family._id": new mongoose.Types.ObjectId(familyId),
                     serial: serial,
                  },
               },
               {
                  $lookup: {
                     from: "batteries",
                     localField: "last_battery",
                     foreignField: "_id",
                     as: "last_battery",
                  },
               },
               {
                  $unwind: {
                     path: "$last_battery",
                     preserveNullAndEmptyArrays: true,
                  },
               },
               {
                  $project: {
                     "tag.code": 1,
                     serial: 1,
                     "family._id": 1,
                     "family.code": 1,
                     "family.company": 1,
                     "last_battery.date": 1,
                     "last_battery.timestamp": 1,
                     "last_battery.battery": 1,
                     "last_battery.batteryVoltage": 1,
                  },
               },
            ]);
            break;

         //Only company
         case companyId != null:
            console.log("only company");
            packings = await Packing.aggregate([
               {
                  $project: {
                     tag: 1,
                     family: 1,
                     serial: 1,
                     last_battery: 1,
                  },
               },
               {
                  $lookup: {
                     from: "families",
                     localField: "family",
                     foreignField: "_id",
                     as: "family",
                  },
               },
               {
                  $unwind: {
                     path: "$family",
                     preserveNullAndEmptyArrays: true,
                  },
               },
               {
                  $lookup: {
                     from: "batteries",
                     localField: "last_battery",
                     foreignField: "_id",
                     as: "last_battery",
                  },
               },
               {
                  $unwind: {
                     path: "$last_battery",
                     preserveNullAndEmptyArrays: true,
                  },
               },
               {
                  $match: {
                     "family.company": new mongoose.Types.ObjectId(companyId),
                  },
               },
               {
                  $project: {
                     "tag.code": 1,
                     serial: 1,
                     "family._id": 1,
                     "family.code": 1,
                     "family.company": 1,
                     "last_battery.date": 1,
                     "last_battery.timestamp": 1,
                     "last_battery.battery": 1,
                     "last_battery.batteryVoltage": 1,
                  },
               },
            ]);
            break;

         //Only family
         case familyId != null:
            console.log("f");
            packings = await Packing.find(
               { family: familyId },
               {
                  "tag.code": 1,
                  serial: 1,
                  last_battery: 1,
               }
            )
            .populate("last_battery", "date timestamp battery batteryVoltage")
               .populate("family", "code company");
            break;

         //Only serial
         case serial != null:
            console.log("s");
            packings = await Packing.find(
               { serial: serial },
               {
                  "tag.code": 1,
                  serial: 1,
                  last_battery: 1,
               }
            )
               .populate("last_battery", "date timestamp battery batteryVoltage")
               .populate("family", "code company");
            break;

         default:
            console.log("default");
            packings = await Packing.find(
               {},
               {
                  "tag.code": 1,
                  serial: 1,
                  last_battery: 1,
               }
            )
            .populate("last_battery", "date timestamp battery batteryVoltage")
               .populate("family", "code company");
            break;
      }
      return packings;
   } catch (error) {
      throw new Error(error);
   }
};
