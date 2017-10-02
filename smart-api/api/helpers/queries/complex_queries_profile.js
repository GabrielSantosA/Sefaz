exports.queries = {
  profiles: [{
      "$match": {
        "$or": [{
          "profile": {
            "$in": ["Supplier", 'Logistic', 'AdminFactory', 'StaffFactory']
          }
        }, ]
      }
    },
    {
      "$lookup": {
        "from": "suppliers",
        "localField": "_id",
        "foreignField": "profile",
        "as": "supplier"
      }
    }, {
      "$lookup": {
        "from": "logisticoperators",
        "localField": "_id",
        "foreignField": "profile",
        "as": "logistic"
      }
    }, {
      "$lookup": {
        "from": "admins",
        "localField": "_id",
        "foreignField": "profile",
        "as": "admin"
      }
    },
    {
      "$unwind": {
        "path": "$supplier",
        'preserveNullAndEmptyArrays': true
      }
    },
    {
      "$unwind": {
        "path": "$logistic",
        'preserveNullAndEmptyArrays': true
      }
    },
    {
      "$unwind": {
        "path": "$admin",
        'preserveNullAndEmptyArrays': true
      }
    },
    {
      $project: {
        "_id": '$_id',
        "_id": '$_id',
        "profile": "$profile",
        "name": "$user",
        "email": "$email",
        "city": "$city",
        "street": "$street",
        "telephone": "$telephone",
        "cellphone": "$cellphone",
        "cep": "$cep",
        "neighborhood": "$neighborhood",
        "uf": "$uf",
        "user": {
          '$cond': {
            if: '$admin',
            then: '$admin',
            else: {
              '$cond': {
                if: '$supplier',
                then: '$supplier',
                else: '$logistic'
              }
            }
          }
        }
      }
    }
  ],
  profiles_supplier: function(id) {
    return [{
        "$match": {
          "$or": [{
            "profile": {
              "$in": ['StaffSupplier']
            }
          }]
        }
      },

      {
        "$match": {

          'official_supplier': id,
        }
      },
      {
        $project: {
          "_id": '$_id',
          "_id": '$_id',
          "profile": "$profile",
          "name": "$user",
          "email": "$email",
          "city": "$city",
          "street": "$street",
          "telephone": "$telephone",
          "cellphone": "$cellphone",
          "cep": "$cep",
          "neighborhood": "$neighborhood",
          "uf": "$uf"
        }
      }
    ]
  },
  login: function(password, email) {
    return [{
        "$match": {
          "password": password,
          "email": email
        }
      },
      {
        "$lookup": {
          "from": "suppliers",
          "localField": "_id",
          "foreignField": "profile",
          "as": "supplier"
        }
      },
      {
        "$unwind": {
          "path": "$supplier",
          'preserveNullAndEmptyArrays': true
        }
      }
    ]
  }
}
