'use strict';
module.exports = function(sequelize, DataTypes) {
  var AttendanceStatus = sequelize.define('AttendanceStatus', {
    id: {
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:false
    },
      Code: DataTypes.STRING(3),
      Description:DataTypes.STRING(100),
      LowerBound:DataTypes.INTEGER,
      UpperBound:DataTypes.INTEGER,
      ApplyAmount:DataTypes.DECIMAL(10,2),
      AmountType:DataTypes.INTEGER,
      Enabled:DataTypes.BOOLEAN,
      AdState:DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return AttendanceStatus;
};