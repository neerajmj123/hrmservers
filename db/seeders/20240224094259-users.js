'use strict';

module.exports = {
  up: (models, mongoose) => {



    return models.users
    .insertMany([
      {
        _id:"65d9bb7e77f3a6dbd0a99fc5",
        name:"jack",
        age:"10",
        phone_no:"123456789",
        pincode:"680564",
        email:"jack@gmail.com",
        password:"$2a$12$1AOqY9dbpdnoOVE9Frm9sek7Pz4g6EFcP7Y12v9a0nM5Xc9FkmLju",//jack@123
        user_type:"65bb1a7d13faaff4f7e60713"
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
    return models.users
    .deleteMany({
      _id:{
       $in: [
          "65d9bb7e77f3a6dbd0a99fc5"
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
