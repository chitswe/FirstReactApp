'use strict';
module.exports = function(sequelize, DataTypes) {
  var Employee = sequelize.define('Employee', {
    id:{
        type:DataTypes.INTEGER,
        autoIncrement:false,
        primaryKey:true
    },
    Alias: DataTypes.STRING,
    Name: DataTypes.STRING,
    JobTitle: DataTypes.STRING,
    Active: DataTypes.BOOLEAN,
    RetiredDate: DataTypes.DATEONLY,
    HiredDate: DataTypes.DATEONLY,
    BasicSalary: DataTypes.DECIMAL
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
          Employee.belongsTo(models.EmployeeGroup,{
              foreignKey:{
                allowNull:false
              }
          });
          Employee.hasMany(models.AcLog);
      }
    }
  });
  return Employee;
};