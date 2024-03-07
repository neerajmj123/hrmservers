'use strict';

const { insertMany } = require("../models/users");

module.exports = {
  up: (models, mongoose) => {


    return models.user_types
    .insertMany([
      {
        _id:"65bb1a7d13faaff4f7e60713",
        user_type:"admin",

      },
      {
        _id:"65bb1a7e13faaff4f7e60714",
        user_type:"employee"
      }
    ])

    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return models.Test.bulkWrite([
        {
          insertOne: {
            document: {
              name: 'first test'
            }
          }
        }
      ]).then(res => {
      // Prints "1"
      console.log(res.insertedCount);
    });
    */
  },

  down: (models, mongoose) => {



    return models.user_types
    .deleteMany({
     _id:{
      $in:[
        "65bb1a7d13faaff4f7e60713",
        "65bb1a7e13faaff4f7e60714",
      ],
      },
    })
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return models.Test.bulkWrite([
        {
          deleteOne: {
            filter: {
              name: 'first test'
            }
          }
        }
      ]).then(res => {
      // Prints "1"
      console.log(res.deletedCount);
      });
    */
  }
};
