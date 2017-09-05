

module.exports = {
  changed: function (p , plant ) {
    p.actual_plant = {
      plant: plant._id,
      local: plant.supplier ? 'Supplier' : 'Factory'
    };

    if(plant.supplier){
      if(plant.supplier.equals(p.supplier._id)){
        if(p.gc16){
          p.actual_gc16 = {
            days: p.gc16.supplierStock.ssDays,
            max: p.gc16.supplierStock.QuantContainerSsMax,
            min: p.gc16.supplierStock.QuantContainerSs,
          }
          console.log("INSERT GC16 SUPPLIER TO PACKING: "+p._id);
        }
      }
    }else{
      if(p.gc16){
        p.actual_gc16 = {
          days: p.gc16.factoryStock.fsDays,
          max: p.gc16.factoryStock.QuantContainerfsMax,
          min: p.gc16.factoryStock.QuantContainerfs,
        }
        console.log("INSERT GC16 FACTORY TO PACKING: "+p._id);
      }
    }

    p.permanence = {
      "amount_days" : 0,
      "date" : new Date().getTime(),
      "time_exceeded" : false
    };

    return p;
  },
  fixed: function (p , plant ) {

    if(plant.supplier){
      if(plant.supplier.equals(p.supplier._id)){
        if(p.gc16){
          p.actual_gc16 = {
            days: p.gc16.supplierStock.ssDays,
            max: p.gc16.supplierStock.QuantContainerSsMax,
            min: p.gc16.supplierStock.QuantContainerSs,
          }
          console.log("INSERT GC16 SUPPLIER TO PACKING: "+p._id);
        }
      }
    }else{
      if(p.gc16){
        p.actual_gc16 = {
          days: p.gc16.factoryStock.fsDays,
          max: p.gc16.factoryStock.QuantContainerfsMax,
          min: p.gc16.factoryStock.QuantContainerfs,
        }
        console.log("INSERT GC16 FACTORY TO PACKING: "+p._id);
      }
    }

    return p;
  }

}
