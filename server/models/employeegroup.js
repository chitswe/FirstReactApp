'use strict';
module.exports = function(sequelize, DataTypes) {
  var EmployeeGroup = sequelize.define('EmployeeGroup', {
  id:{
      type:DataTypes.INTEGER,
      autoIncrement:false,
      primaryKey:true
  },
    Name: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
          EmployeeGroup.hasMany(models.Employee);
      }
    }
  });
  return EmployeeGroup;
};