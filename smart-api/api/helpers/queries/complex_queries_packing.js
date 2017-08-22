'use strict';
var Mongoose = require('mongoose');
var ObjectId = Mongoose.Types.ObjectId;

exports.queries = {
  inventory_general: [{
      "$lookup": {
        "from": "suppliers",
        "localField": "supplier",
        "foreignField": "_id",
        "as": "supplierObject"
      }
    },
    {
      "$lookup": {
        "from": "projects",
        "localField": "project",
        "foreignField": "_id",
        "as": "projectObject"
      }
    },
    {
      "$lookup": {
        "from": "gc16",
        "localField": "gc16",
        "foreignField": "_id",
        "as": "gc16Object"
      }
    },

    {
      "$unwind": {
        "path": "$supplierObject",
        'preserveNullAndEmptyArrays': true
      }
    }, {
      "$unwind": {
        "path": "$projectObject",
        'preserveNullAndEmptyArrays': true
      }
    }, {
      "$unwind": {
        "path": "$gc16Object",
        'preserveNullAndEmptyArrays': true
      }
    },
    {
      "$group": {
        "_id": {
          "code": "$code",
          "supplier": "$supplier"
        },
        "code": {
          "$first": "$code"
        },
        "supplier": {
          "$first": "$supplierObject"
        },
        "description": {
          "$first": "$type"
        },
        "project": {
          "$first": "$projectObject"
        },
        "quantity": {
          "$sum": 1
        },
        "gc16": {
          "$first": "$gc16Object"
        }
      }
    }
  ],
  inventory_general_by_plant: function(code, supplier) {
    return [{
        "$match": {
          "supplier": supplier,
          "code": code
        }
      },
      {
        "$lookup": {
          "from": "suppliers",
          "localField": "supplier",
          "foreignField": "_id",
          "as": "supplierObject"
        }
      },
      {
        "$lookup": {
          "from": "plants",
          "localField": "actual_plant",
          "foreignField": "_id",
          "as": "plantObject"
        }
      },
      {
        "$lookup": {
          "from": "projects",
          "localField": "project",
          "foreignField": "_id",
          "as": "projectObject"
        }
      },
      {
        "$lookup": {
          "from": "gc16",
          "localField": "gc16",
          "foreignField": "_id",
          "as": "gc16Object"
        }
      },
      {
        "$unwind": {
          "path": "$supplierObject",
          'preserveNullAndEmptyArrays': true
        }
      }, {
        "$unwind": {
          "path": "$projectObject",
          'preserveNullAndEmptyArrays': true
        }
      }, {
        "$unwind": {
          "path": "$plantObject",
          'preserveNullAndEmptyArrays': true
        }
      },
      {
        "$unwind": {
          "path": "$gc16Object",
          'preserveNullAndEmptyArrays': true
        }
      },
      {
        "$group": {
          "_id": {
            "code": "$code",
            "plant": "$actual_plant",
            "supplier": "$supplier",
            "missing": "$missing"
          },
          "code": {
            "$first": "$code"
          },
          "supplier": {
            "$first": "$supplierObject"
          },
          "actual_plant": {
            "$first": "$plantObject"
          },
          "description": {
            "$first": "$type"
          },
          "project": {
            "$first": "$projectObject"
          },
          "quantity": {
            "$sum": 1
          },
          "gc16": {
            "$first": "$gc16Object"
          }
        }
      }
    ]
  },
  supplier_inventory: function(id) {
    return [{
        "$lookup": {
          "from": "suppliers",
          "localField": "supplier",
          "foreignField": "_id",
          "as": "supplierObject"
        }
      },
      {
        "$lookup": {
          "from": "plants",
          "localField": "actual_plant",
          "foreignField": "_id",
          "as": "plantObject"
        }
      },
      {
        "$lookup": {
          "from": "projects",
          "localField": "project",
          "foreignField": "_id",
          "as": "projectObject"
        }
      },
      {
        "$lookup": {
          "from": "gc16",
          "localField": "gc16",
          "foreignField": "_id",
          "as": "gc16Object"
        }
      },
      {
        "$unwind": {
          "path": "$supplierObject",
          'preserveNullAndEmptyArrays': true
        }
      }, {
        "$unwind": {
          "path": "$projectObject",
          'preserveNullAndEmptyArrays': true
        }
      }, {
        "$unwind": {
          "path": "$plantObject",
          'preserveNullAndEmptyArrays': true
        }
      },
      {
        "$unwind": {
          "path": "$gc16Object",
          'preserveNullAndEmptyArrays': true
        }
      },
      {
        "$match": {
          "supplierObject._id": id,
        }
      },
      {
        "$group": {
          "_id": {
            "code": "$code",
            "plant": "$actual_plant",
            "supplier": "$supplier",
            "missing": "$missing"
          },
          "code": {
            "$first": "$code"
          },
          "supplier": {
            "$first": "$supplierObject"
          },
          "actual_plant": {
            "$first": "$plantObject"
          },
          "description": {
            "$first": "$type"
          },
          "project": {
            "$first": "$projectObject"
          },
          "quantity": {
            "$sum": 1
          },
          "gc16": {
            "$first": "$gc16Object"
          }
        }
      }
    ]

  },
  historic_packing: function(serial) {
    return [{
        "$match": {
          "serial": serial,
        }
      },
      {
        "$lookup": {
          "from": "suppliers",
          "localField": "supplier",
          "foreignField": "_id",
          "as": "supplierObject"
        }
      },
      {
        "$lookup": {
          "from": "plants",
          "localField": "actual_plant",
          "foreignField": "_id",
          "as": "plantObject"
        }
      },
      {
        "$lookup": {
          "from": "projects",
          "localField": "project",
          "foreignField": "_id",
          "as": "projectObject"
        }
      },
      {
        "$lookup": {
          "from": "gc16",
          "localField": "gc16",
          "foreignField": "_id",
          "as": "gc16Object"
        }
      },
      {
        "$lookup": {
          "from": "historicpackings",
          "localField": "_id",
          "foreignField": "packing",
          "as": "historicpackingsObject"
        }
      },
      {
        "$unwind": {
          "path": "$historicpackingsObject",
          'preserveNullAndEmptyArrays': true
        }
      },
      {
        "$unwind": {
          "path": "$supplierObject",
          'preserveNullAndEmptyArrays': true
        }
      }, {
        "$unwind": {
          "path": "$projectObject",
          'preserveNullAndEmptyArrays': true
        }
      }, {
        "$unwind": {
          "path": "$plantObject",
          'preserveNullAndEmptyArrays': true
        }
      },
      {
        "$unwind": {
          "path": "$gc16Object",
          'preserveNullAndEmptyArrays': true
        }
      },
      {
        "$group": {
          "_id": {
            "code": "$code",
            "plant": "$actual_plant",
            "supplier": "$supplier",
            "missing": "$missing"
          },
          "code": {
            "$first": "$code"
          },
          "supplier": {
            "$first": "$supplierObject"
          },
          "actual_plant": {
            "$first": "$plantObject"
          },
          "description": {
            "$first": "$type"
          },
          "project": {
            "$first": "$projectObject"
          },
          "quantity": {
            "$sum": 1
          },
          "gc16": {
            "$first": "$gc16Object"
          },
          "historic": {
            "$first": "$historicpackingsObject"
          }
        }
      }
    ]
  },
  quantity_total: function(code){
    return [
       {
        "$match": {
          "code": code,
        }
      },
      {
        "$group": {
          "_id": {
            "missing": "$missing"
          },
          "quantity": {
            "$sum": 1
          },
          "missing": {
            "$first": "$missing"
          }
        }
      }
    ];
  },
  quantity_inventory: function(code){
    return [{
        "$match": {
          "code": code,
        }
      },
      {
        "$lookup": {
          "from": "suppliers",
          "localField": "supplier",
          "foreignField": "_id",
          "as": "supplierObject"
        }
      },
      {
        "$lookup": {
          "from": "plants",
          "localField": "actual_plant",
          "foreignField": "_id",
          "as": "plantObject"
        }
      },
      {
        "$lookup": {
          "from": "projects",
          "localField": "project",
          "foreignField": "_id",
          "as": "projectObject"
        }
      },
      {
        "$lookup": {
          "from": "gc16",
          "localField": "gc16",
          "foreignField": "_id",
          "as": "gc16Object"
        }
      },
      {
        "$lookup": {
          "from": "historicpackings",
          "localField": "_id",
          "foreignField": "packing",
          "as": "historicpackingsObject"
        }
      },
      {
        "$unwind": {
        "path": "$supplierObject",
        'preserveNullAndEmptyArrays': true
      }
      }, {
        "$unwind": {
        "path": "$projectObject",
        'preserveNullAndEmptyArrays': true
      }
      },{
        "$unwind": {
        "path": "$plantObject",
        'preserveNullAndEmptyArrays': true
      }
      },
       {
        "$unwind": {
        "path": "$gc16Object",
        'preserveNullAndEmptyArrays': true
      }
      },
      {
        "$group": {
          "_id": {
            "code": "$code",
            "plant": "$actual_plant",
            "supplier": "$supplier",
            "missing": "$missing",
            "problem": "$problem"
          },
          "code": {
            "$first": "$code"
          },
          "supplier": {
            "$first": "$supplierObject"
          },
          "actual_plant": {
            "$first": "$plantObject"
          },
          "description": {
            "$first": "$type"
          },
          "project": {
            "$first": "$projectObject"
          },
          "quantity": {
            "$sum": 1
          },
          "gc16": {
            "$first": "$gc16Object"
          },
          "missing": {
            "$first": "$missing"
          },
          "serial": {
            "$first": "$serial"
          },
          "problem": {
            "$first": "$problem"
          },
          "historic": {
              "$first": "$historicpackingsObject"
          }
        }
      }
    ];
  },
  populate: [
    "plant",
    "supplier",
    "packing",
    {
      path: 'packing',
      populate: {
        path: 'supplier',
        model: 'Supplier'
      }
    },
    {
      path: 'packing',
      populate: {
        path: 'project',
        model: 'Project'
      }
    },
    {
      path: 'packing',
      populate: {
        path: 'actual_plant',
        model: 'Plant'
      }
    },
    {
      path: 'packing',
      populate: {
        path: 'gc16',
        model: 'GC16'
      }
    }
  ],
  packingList: function(code) {
    return [{
        "$match": {
          "actual_plant": {
            "$exists": true
          },
          "department": {
            "$exists": true
          },
          "code": code,
          "missing": false,
          "problem": false

        }
      }, {
        "$lookup": {
          "from": "departments",
          "localField": "department",
          "foreignField": "_id",
          "as": "departmentObject"
        }
      }, {
        "$lookup": {
          "from": "plants",
          "localField": "actual_plant",
          "foreignField": "_id",
          "as": "plantObject"
        }
      },
      {
        "$lookup": {
          "from": "suppliers",
          "localField": "supplier",
          "foreignField": "_id",
          "as": "supplierObject"
        }
      }, {
        "$unwind": "$plantObject"
      }, {
        "$unwind": "$departmentObject"
      }, {
        "$unwind": "$supplierObject"
      }, {
        "$group": {
          "_id": {
            "department": "$department",
            "plant": "$actual_plant",
            "supplier": "$supplier"
          },
          "quantity": {
            "$sum": 1
          },
          "plant": {
            "$first": "$plantObject"
          },
          "department": {
            "$first": "$departmentObject"
          },
          "supplier": {
            "$first": "$supplierObject"
          }
        }
      }
    ];
  },
  quantityFound: function(code) {
    return [{
      "$match": {
        "actual_plant": {
          "$exists": true
        },
        "department": {
          "$exists": true
        },
        "code": code,
        "missing": false
      }
    }, {
      "$group": {
        "_id": "$code",
        "quantity": {
          "$sum": 1
        }
      }
    }]
  },
  existingQuantity: function(code) {
    return [{
      "$match": {
        "actual_plant": {
          "$exists": true
        },
        "department": {
          "$exists": true
        },
        "code": code
      }
    }, {
      "$group": {
        "_id": "$code",
        "quantity": {
          "$sum": 1
        }
      }
    }]
  },

  listPackingMissing: function(code) {
    return [{
      "$match": {
        "actual_plant": {
          $exists: true
        },
        "department": {
          $exists: true
        },
        "code": code,
        "missing": true
      }
    }, {
      "$lookup": {
        "from": "departments",
        "localField": "department",
        "foreignField": "_id",
        "as": "departmentObject"
      }
    }, {
      "$lookup": {
        "from": "plants",
        "localField": "actual_plant",
        "foreignField": "_id",
        "as": "plantObject"
      }
    }, {
      "$unwind": "$plantObject"
    }, {
      "$unwind": "$departmentObject"
    }, {
      "$group": {
        "_id": {
          "department": "$department",
          "plant": "$actual_plant",
          "supplier": "$supplier"

        },
        "quantity": {
          "$sum": 1
        },
        "plant": {
          "$first": "$plantObject"
        },
        "department": {
          "$first": "$departmentObject"
        },
        "missing": {
          "$first": "$missing"
        }
      }
    }]
  },
  listPackingProblem: function(code) {
    return [{
        "$match": {
          "actual_plant": {
            "$exists": true
          },
          "department": {
            "$exists": true
          },
          "code": code,
          "problem": true
        }
      }, {
        "$lookup": {
          "from": "routes",
          "localField": "hashPacking",
          "foreignField": "hashPacking",
          "as": "routeObject"
        }
      }, {
        "$lookup": {
          "from": "departments",
          "localField": "department",
          "foreignField": "_id",
          "as": "departmentObject"
        }
      }, {
        "$lookup": {
          "from": "plants",
          "localField": "actual_plant",
          "foreignField": "_id",
          "as": "plantObject"
        }
      }, {
        "$lookup": {
          "from": "suppliers",
          "localField": "supplier",
          "foreignField": "_id",
          "as": "ObjectSupplier"
        }
      }, {
        "$unwind": "$plantObject"
      }, {
        "$unwind": "$ObjectSupplier"
      }, {
        "$unwind": "$departmentObject"
      }, {
        "$unwind": "$routeObject"
      }, {
        "$lookup": {
          "from": "plants",
          "localField": "routeObject.plant_factory",
          "foreignField": "_id",
          "as": "plantObjectCorrectFactory"
        }
      }, {
        "$lookup": {
          "from": "plants",
          "localField": "routeObject.plant_supplier",
          "foreignField": "_id",
          "as": "plantObjectCorrectSupplier"
        }
      }, {
        "$unwind": "$plantObjectCorrectFactory"
      },
      {
        "$unwind": "$plantObjectCorrectSupplier"
      },

      {
        "$group": {
          "_id": {
            "department": "$departmentObject._id",
            "plant": "$plantObject._id",
            "supplier": "$ObjectSupplier._id"

          },
          "supplier": {
            "$first": "$ObjectSupplier.name"
          },
          "quantity": {
            "$sum": 1
          },
          "plant": {
            "$first": "$plantObject"
          },
          "department": {
            "$first": "$departmentObject"
          },
          "plantCorrectFactory": {
            "$first": "$plantObjectCorrectFactory"
          },
          "plantCorrectSupplier": {
            "$first": "$plantObjectCorrectSupplier"
          },
          "supplier": {
            "$first": "$ObjectSupplier"
          }
        }
      }
    ];
  },
  listPackingBySupplier: function(id) {

    return [{
        "$match": {
          "supplier": id,
          "gc16": {
            "$exists": false
          }
        }
      },
      {
        "$group": {
          "_id": "$code",
          "packing": {
            "$first": "$code"
          },
          "project": {
            "$first": "$project"
          }
        }
      }
    ];
  },
  "listPackingsNoBinded": function(id) {
    return [
      {
      "$match": {
        "route": { $exists: false },
        "supplier": id

      }
    },{
      "$lookup": {
        "from": "suppliers",
        "localField": "supplier",
        "foreignField": "_id",
        "as": "ObjectSupplier"
      }
    },{
      "$unwind": "$ObjectSupplier"
    },{
      "$lookup": {
        "from": "plants",
        "localField": "ObjectSupplier.plant",
        "foreignField": "_id",
        "as": "ObjectPlant"
      }
    },{
      "$unwind": "$ObjectPlant"
    },{
      '$group': {
        "_id": {
          "code": "$code"
        },
        "id": {
            "$first": "$code"
        },
        "packing": {
          "$first": "$_id"
        },
        "supplier": {
            "$first": "$ObjectSupplier"
        },
        "plant": {
            "$first": "$ObjectPlant"
        }

      }
    }]
  },
  listPackingNoBindedWithCode: function(code) {
    return [{
      "$lookup": {
        "from": "routes",
        "localField": "code",
        "foreignField": "packing",
        "as": "packingObject"
      }
    }, {
      "$unwind": {
        "path": "$packingObject",
        'preserveNullAndEmptyArrays': true
      }
    }, {
      "$match": {
        '$or': [{
          "plantObject": {
            "$exists": false
          }
        }, {
          'code': code
        }]
      }
    }, {
      '$group': {
        "_id": "$code",
        "code": {
          "$first": "$code"
        }
      }
    }];
  },
  "packingListNoCode": [{
    "$match": {
      "actual_plant": {
        "$exists": true
      },
      "department": {
        "$exists": true
      },
      "missing": false,
      "problem": false

    }
  }, {
    "$lookup": {
      "from": "departments",
      "localField": "department",
      "foreignField": "_id",
      "as": "departmentObject"
    }
  }, {
    "$lookup": {
      "from": "plants",
      "localField": "actual_plant",
      "foreignField": "_id",
      "as": "plantObject"
    }
  }, {
    "$lookup": {
      "from": "routes",
      "localField": "hashPacking",
      "foreignField": "hashPacking",
      "as": "routeObject"
    }
  }, {
    "$unwind": "$plantObject"
  }, {
    "$unwind": "$routeObject"
  }, {
    "$unwind": "$departmentObject"
  }, {
    "$lookup": {
      "from": "suppliers",
      "localField": "routeObject.supplier",
      "foreignField": "_id",
      "as": "supplierObject"
    }
  }, {
    "$unwind": "$supplierObject"
  }, {
    "$group": {
      "_id": {
        "code": "$code",
        "department": "$department",
        "plant": "$actual_plant",
        "supplier": "$supplier"
      },
      "quantity": {
        "$sum": 1
      },
      "code": {
        "$first": "$code"
      },
      "plant": {
        "$first": "$plantObject"
      },
      "department": {
        "$first": "$departmentObject"
      },
      "supplier": {
        "$first": "$supplierObject"
      },
      "nothing": {
        "$sum": 1
      },
    }
  }],
  "quantityFoundNoCode": [{
    "$match": {
      "missing": false
    }
  }, {
    "$group": {
      "_id": "$code",
      "quantity": {
        "$sum": 1
      }
    }
  }],
  "existingQuantityNoCode": [{
    "$group": {
      "_id": "$code",
      "quantity": {
        "$sum": 1
      }
    }
  }],
  "listPackingMissingNoCodeNoRoute": [{
    "$match": {

      "missing": true
    }
  }, {
    "$group": {
      "_id": {
        "code": "$code",
      },
      "code": {
        "$first": "$code"
      },
      "quantity": {
        "$sum": 1
      },
      "missing": {
        "$first": "$missing"
      },
      "missing": {
        "$sum": 1
      }
    }
  }],
  "listPackingMissingNoCodeRoute": [{
    "$match": {
      "actual_plant": {
        $exists: true
      },
      "department": {
        $exists: true
      },

      "missing": true
    }
  }, {
    "$lookup": {
      "from": "departments",
      "localField": "department",
      "foreignField": "_id",
      "as": "departmentObject"
    }
  }, {
    "$lookup": {
      "from": "plants",
      "localField": "actual_plant",
      "foreignField": "_id",
      "as": "plantObject"
    }
  }, {
    "$lookup": {
      "from": "routes",
      "localField": "code",
      "foreignField": "packing",
      "as": "routeObject"
    }
  }, {
    "$unwind": "$plantObject"
  }, {
    "$unwind": "$departmentObject"
  }, {
    "$unwind": "$routeObject"
  }, {
    "$lookup": {
      "from": "suppliers",
      "localField": "routeObject.supplier",
      "foreignField": "_id",
      "as": "supplierObject"
    }
  }, {
    "$unwind": "$supplierObject"
  }, {
    "$group": {
      "_id": {
        "code": "$code",
        "department": "$department",
        "plant": "$actual_plant",
        "supplier": "$supplier"
      },
      "quantity": {
        "$sum": 1
      },
      "plant": {
        "$first": "$plantObject"
      },
      "department": {
        "$first": "$departmentObject"
      },
      "supplier": {
        "$first": "$supplierObject"
      },
      "missing": {
        "$first": "$missing"
      },
      "missing": {
        "$sum": 1
      },
    }
  }],
  "countAll": {

    "actual_plant": {
      "$exists": true
    },
    "department": {
      "$exists": true
    }


  },
  "listPackingProblemNoCode": [{
      "$match": {
        "actual_plant": {
          "$exists": true
        },
        "department": {
          "$exists": true
        },

        "problem": true
      }
    }, {
      "$lookup": {
        "from": "routes",
        "localField": "hashPacking",
        "foreignField": "hashPacking",
        "as": "routeObject"
      }
    }, {
      "$lookup": {
        "from": "departments",
        "localField": "department",
        "foreignField": "_id",
        "as": "departmentObject"
      }
    }, {
      "$lookup": {
        "from": "plants",
        "localField": "actual_plant",
        "foreignField": "_id",
        "as": "plantObject"
      }
    }, {
      "$lookup": {
        "from": "suppliers",
        "localField": "supplier",
        "foreignField": "_id",
        "as": "ObjectSupplier"
      }
    }, {
      "$unwind": "$plantObject"
    }, {
      "$unwind": "$ObjectSupplier"
    }, {
      "$unwind": "$departmentObject"
    }, {
      "$unwind": "$routeObject"
    }, {
      "$lookup": {
        "from": "plants",
        "localField": "routeObject.plant_factory",
        "foreignField": "_id",
        "as": "plantObjectCorrectFactory"
      }
    }, {
      "$lookup": {
        "from": "plants",
        "localField": "routeObject.plant_supplier",
        "foreignField": "_id",
        "as": "plantObjectCorrectSupplier"
      }
    }, {
      "$unwind": "$plantObjectCorrectFactory"
    },
    {
      "$unwind": "$plantObjectCorrectSupplier"
    },

    {
      "$group": {
        "_id": {
          "department": "$departmentObject._id",
          "plant": "$plantObject._id",
          "supplier": "$ObjectSupplier._id"

        },
        "supplier": {
          "$first": "$ObjectSupplier.name"
        },
        "quantity": {
          "$sum": 1
        },
        "code": {
          "$first": "$code"
        },
        "plant": {
          "$first": "$plantObject"
        },
        "department": {
          "$first": "$departmentObject"
        },
        "plantCorrectFactory": {
          "$first": "$plantObjectCorrectFactory"
        },
        "plantCorrectSupplier": {
          "$first": "$plantObjectCorrectSupplier"
        },
        "supplier": {
          "$first": "$ObjectSupplier"
        },
        "problem": {
          "$sum": 1
        }

      }
    }
  ]
}
