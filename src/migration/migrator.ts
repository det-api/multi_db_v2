import UserModel from "../model/user.model";

const fs = require("fs");

export const migrate = () => {
  fs.readFile("./src/migration/user.json", async (err, data) => {
    if (err) {
      console.log(err);
    } else {
      try{
        let result = JSON.parse(data.toString())
        let ret = await UserModel.create(result);
        if (ret){
          console.log("added")
        }
      }catch{
        console.log("already exist")
      }

    }
  });
};

