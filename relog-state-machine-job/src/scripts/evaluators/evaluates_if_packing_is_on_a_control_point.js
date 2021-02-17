const jsts = require("jsts");
const turf = require("@turf/turf");
const martinez = require("martinez-polygon-clipping");
const getDistanceFromLatLonInKm = require("../common/get_distance_from_lat_lng_in_km");
const { EventRecord } = require("../../models/event_record.model");
const { Packing } = require("../../models/packings.model");

const getLastPosition = (packing) => {
   if (packing.last_position) return packing.last_position;
   return null;
};

module.exports = async (packing, controlPoints, settings) => {
   try {
      // console.log(packing);

      let _result = null;

      // Se já teve event_record
      if (packing.last_event_record) {
         //Se o último evento foi INBOUND
         if (packing.last_event_record.type == "inbound") {
            // console.log(" inbound 1");
            //recupera o ponto de controle em que estava e testa se o device continua incluído nele
            let controlPointToTest = controlPoints.find(
               (elem) => elem._id.toString() == packing.last_event_record.control_point.toString()
            );

            let controlPointToTestFound = await testOneControlPoint(packing, controlPointToTest, settings);
            // console.log("controlPointToTestFound", !!controlPointToTestFound ? controlPointToTestFound.cp.name : controlPointToTestFound);

            // se CONTINUA no mesmo ponto de controle
            if (!!controlPointToTestFound) {
               // console.log("continua no mesmo PC");
               _result = controlPointToTestFound.cp;
            } else {
               // console.log("saiu do PC");
               // se NÃO CONTINUA no mesmo ponto de controle:
               // Procura algum PC
               // console.log("procurando novo");
               let actualControlPointFound = await findActualControlPoint(packing, controlPoints, settings);
               // console.log("actualControlPointFound", actualControlPointFound)

               if (actualControlPointFound) {
                  // console.log("achou ", actualControlPointFound.cp._id);
                  // Se encontrou um novo PC e o sinal é elegível para entrada
                  //sai do PC anterior e entra no novo
                  if (getLastPosition(packing).accuracy <= settings.accuracy_limit) {
                     // console.log("creation 1. last type:", packing.last_event_record ? packing.last_event_record.type : "nulo");
                     await createOutbound(packing);
                     await createInbound(packing, actualControlPointFound.cp, actualControlPointFound.distance);

                     _result = actualControlPointFound.cp;
                  } else{
                     //saiu do PC, achou outro, mas não tem sinal bom o suficiente 
                     await createOutbound(packing);
                  }
                  // else não é elegível
               } else {
                  // console.log("não achou. está fora de PC");
                  // Se não encontrou um novo PC então sai do que estava
                  // console.log("creation 2. last type:", packing.last_event_record ? packing.last_event_record.type : "nulo");
                  await createOutbound(packing); //Não se encontra em nenhum ponto de controle
               }
            }
         }

         //Se o último evento foi OUTBOUND
         if (packing.last_event_record.type === "outbound") {
            // console.log("outbound 2");
            //Procura algum PC

            // console.log("procurando");
            let actualControlPointFound = await findActualControlPoint(packing, controlPoints, settings);
            // console.log("resultado", actualControlPointFound ? actualControlPointFound._id : null);

            if (actualControlPointFound) {
               // Se encontrou um novo PC e o sinal é elegível para entrada
               //sai do PC anterior e entra no novo
               if (getLastPosition(packing).accuracy <= settings.accuracy_limit) {
                  // É elegível
                  // console.log("creation 3. last type:", packing.last_event_record ? packing.last_event_record.type : "nulo");
                  await createInbound(packing, actualControlPointFound.cp, actualControlPointFound.distance);
                  _result = actualControlPointFound.cp;
               }
            }
         }
      } else {
         // Se nunca teve event_record
         //Procura algum PC
         if (getLastPosition(packing)) {
            let actualControlPointFound = await findActualControlPoint(packing, controlPoints, settings);
            if (actualControlPointFound) {
               // Se encontrou um novo PC e o sinal é elegível para entrada
               //sai do PC anterior e entra no novo
               if (getLastPosition(packing).accuracy <= settings.accuracy_limit) {
                  // console.log("creation 4. last type:", packing.last_event_record ? packing.last_event_record.type : "nulo");
                  await createInbound(packing, actualControlPointFound.cp, actualControlPointFound.distance);
                  _result = actualControlPointFound.cp;
               }
            }
         }
      }

      return _result;
   } catch (error) {
      console.error(error);
      throw new Error(error);
   }
};

const testOneControlPoint = async (packing, controlPoint, settings) => {
   let result = null;

   // console.log("testOneControlPoint", packing._id, controlPoint._id);

   if (controlPoint.geofence.type == "c") {
      myActualControlPoint = await findCircularIntersection(packing, [controlPoint], settings);
      if (myActualControlPoint) {
         result = myActualControlPoint;
      }
   }

   if (controlPoint.geofence.type == "p") {
      myActualControlPoint = await findPolygonalIntersection(packing, [controlPoint], settings);
      if (myActualControlPoint) {
         result = myActualControlPoint;
      }
   }

   // console.log("resultado", !!result ? result.cp.name : null);
   return result;
};

const findActualControlPoint = async (packing, allControlPoints, settings) => {
   /**
    * Ao encontrar intersecção poligonal, já assume o dispositivo como incluso.
    * Ponto de controle circular tem que buscar aquele que possui a menor distância.
    */

   if (getLastPosition(packing)) {
      let myActualControlPoint = null;

      let polygonalControlPoints = allControlPoints.filter((elem) => elem.geofence.type == "p");
      myActualControlPoint = await findPolygonalIntersection(packing, polygonalControlPoints, settings);

      if (myActualControlPoint) {
         // Polygonal control point found
         return myActualControlPoint;
      } else {
         //Try circular controlPoints
         let circularControlPoints = allControlPoints.filter((elem) => elem.geofence.type == "c");

         myActualControlPoint = await findCircularIntersection(packing, circularControlPoints, settings);

         if (myActualControlPoint) {
            return myActualControlPoint;
         } else {
            return null;
         }
      }
   }
};

/**
 * Return the { cp: controlPointFoundObject, distance: smallerDistanceFound } object if a intersection exists or null if no intersection was found.
 * @param {*} packing
 * @param {*} allControlPoints
 */
const findPolygonalIntersection = async (packing, allControlPoints) => {
   let myActualControlPoint = null;

   allControlPoints.some((controlPointToTest) => {
      let isInsideControlePoint = false;

      if (intersectionpoly(packing, controlPointToTest)) {
         myActualControlPoint = controlPointToTest;
         isInsideControlePoint = true;
      }

      return isInsideControlePoint;
   });

   if (myActualControlPoint) return { cp: myActualControlPoint, distance: 0 };
   else return null;
};

/**
 * Return the { cp: controlPointFoundObject, distance: smallerDistanceFound } object if a intersection exists or null if no intersection was found.
 * @param {*} packing
 * @param {*} allControlPoints
 */
const findCircularIntersection = async (packing, allControlPoints) => {
   let myActualControlPoint = null;
   let smallerDistance = Infinity;

   allControlPoints.forEach((controlPointToTest) => {
      const calculatedDistance = getDistanceFromLatLonInKm(
         getLastPosition(packing).latitude,
         getLastPosition(packing).longitude,
         controlPointToTest.geofence.coordinates[0].lat,
         controlPointToTest.geofence.coordinates[0].lng
      );

      if (calculatedDistance <= controlPointToTest.geofence.radius + getLastPosition(packing).accuracy) {
         if (calculatedDistance < smallerDistance) {
            smallerDistance = calculatedDistance;
            myActualControlPoint = controlPointToTest;
         }
      }
   });

   if (myActualControlPoint) return { cp: myActualControlPoint, distance: smallerDistance };
   else return null;
};

/**
 * Creates a new EventRecord register in the database
 * @param {*} packing  The avaluated packing.
 * @param {*} currentControlPoint The control point that the packing are located in.
 * @param {*} distance The distance to the controlpoint in case it has a circular geofence.
 */
const createInbound = async (packing, currentControlPoint, distance) => {
   const eventRecord = new EventRecord({
      packing: packing._id,
      control_point: currentControlPoint._id,
      distance_km: distance,
      accuracy: getLastPosition(packing).accuracy,
      type: "inbound",
      device_data_id: getLastPosition(packing)._id,
      created_at: getLastPosition(packing).date,
   });

   // console.log("inbound", packing._id, eventRecord._id, currentControlPoint._id, getLastPosition(packing)._id);
   await eventRecord.save();
   await Packing.findOneAndUpdate({ _id: packing._id }, { last_event_record: eventRecord._id });
};

const createOutbound = async (packing) => {
   const eventRecord = new EventRecord({
      packing: packing._id,
      control_point: packing.last_event_record.control_point._id,
      distance_km: packing.last_event_record.distance_km,
      accuracy: getLastPosition(packing).accuracy,
      type: "outbound",
      device_data_id: getLastPosition(packing)._id,
      created_at: getLastPosition(packing).date,
   });

   // console.log("outbound", packing.last_event_record.control_point._id, getLastPosition(packing)._id);
   await eventRecord.save();
   await Packing.findOneAndUpdate({ _id: packing._id }, { last_event_record: eventRecord._id });
};

let idAbleToLog = false;
const mLog = (mText) => {
   if (idAbleToLog) console.log(mText);
};

const intersectionpoly = (packing, controlPoint) => {
   try {
      //criar polígono da planta
      let coordinates = controlPoint.geofence.coordinates;

      let path = [];
      let templateTurfPolygon = [];

      coordinates.forEach((elem) => {
         path.push([elem.lng, elem.lat]);
      });
      path.push(path[0]);
      //mLog('> ', path)

      //linha do polígono
      let controlPointLine = turf.lineString(path);
      // mLog('lineString')
      // mLog(JSON.stringify(controlPointLine))

      //limpando a linha do polígono
      //controlPointLine.geometry.type = "Polygon"
      //mLog(controlPointLine)
      controlPointLine = turf.cleanCoords(controlPointLine).geometry.coordinates;
      // mLog('cleanCoords')
      // mLog(controlPointLine)

      let newControlPointLine = turf.lineString(controlPointLine);

      //reconverte para o LineString limpo para polígno
      controlPointPolygon = turf.lineToPolygon(newControlPointLine);

      // mLog('antes:')
      // mLog(JSON.stringify(controlPointPolygon))

      //se o polígono tem autointersecção, então quebra em 2 ou mais features
      //se o polígono não tem auto intersecção, então o mantém
      let unkinkControlPointPolygon = turf.unkinkPolygon(controlPointPolygon);

      if (unkinkControlPointPolygon.features.length > 1) {
         //Caso o polígono tenha auto intersecção
         // mLog('p com auto intersecção')
         // mLog('.depois:')
         // mLog(JSON.stringify(unkinkControlPointPolygon))

         let controlPointPolygonArray = [];

         unkinkControlPointPolygon.features.forEach((feature) => {
            let auxPolygon = turf.polygon(feature.geometry.coordinates);
            controlPointPolygonArray.push(auxPolygon);
         });

         let result = false;

         controlPointPolygonArray.forEach((mPolygon) => {
            //criar polígono da embalagem
            let center = [getLastPosition(packing).longitude, getLastPosition(packing).latitude];
            let radius = getLastPosition(packing).accuracy;
            let options = { steps: 64, units: "meters" };

            //mLog(center, radius)
            let packingPolygon = turf.circle(center, radius, options);
            //mLog('c: ')
            //mLog(JSON.stringify(packingPolygon))

            //checar intersecção
            let intersection = turf.intersect(mPolygon, packingPolygon);
            let intersectionMartinez = martinez.intersection(
               controlPointPolygon.geometry.coordinates,
               packingPolygon.geometry.coordinates
            );

            //checar inclusão total
            let contained = turf.booleanContains(mPolygon, packingPolygon);

            // mLog(' ')
            // mLog('i: ', packing.tag.code)
            // mLog(intersection)

            if (result == false){
               // result = intersection !== null || intersectionMartinez !== null || contained !== false ? true : false;

               if (intersectionMartinez) { 
                  if (intersectionMartinez.length) {  
                     result = true; 
                  }
               }
            }
         });

         //mLog(result);
         return result;
      } else {
         //Caso o polígono não tenha autointersecção
         // mLog('p sem auto intersecção')
         // mLog('..depois:')
         // mLog(JSON.stringify(unkinkControlPointPolygon))

         //criar polígono da embalagem
         let center = [getLastPosition(packing).longitude, getLastPosition(packing).latitude];
         let radius = getLastPosition(packing).accuracy;
         let options = { steps: 64, units: "meters" };

         //mLog(center, radius)
         let packingPolygon = turf.circle(center, radius, options);
         //mLog('c: ')
         //mLog(JSON.stringify(packingPolygon))

         //checar intersecção
         let intersection = turf.intersect(controlPointPolygon, packingPolygon);
         let intersectionMartinez = martinez.intersection(
            controlPointPolygon.geometry.coordinates,
            packingPolygon.geometry.coordinates
         );

         //checar inclusão total
         let contained = turf.booleanContains(controlPointPolygon, packingPolygon);

         // mLog(' ')
         // mLog('i: ', packing.tag.code)
         // if(intersection !== null || intersectionMartinez !== null || contained !== false) {
         // }

         let result = false;
         if (intersectionMartinez) { 
            if (intersectionMartinez.length) {  
               result = true; 
            }
         }

         return result;
      }
   } catch (error) {
      //mLog('erro: ', controlPointLine)
      //mLog(controlPoint.name)
      console.log(packing);
      console.log(packing._id, packing.last_position._id, controlPoint._id);
      throw new Error(error);
   }
};
