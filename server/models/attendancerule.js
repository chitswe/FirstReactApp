'use strict';
module.exports = function(sequelize, DataTypes) {
  var AttendanceRule = sequelize.define('AttendanceRule', {
      NotClockInMins: DataTypes.INTEGER,
      NotClockOutMins: DataTypes.INTEGER,
      NotClockInAction: DataTypes.INTEGER,
      NotClockOutAction: DataTypes.INTEGER,
      EarlyLeaveToAbsent: DataTypes.INTEGER,
      LateInToAbsent:DataTypes.INTEGER,
      LateLeaveToOT:DataTypes.INTEGER,
      EarlyInToOT:DataTypes.INTEGER,
      DuplicateInAction:DataTypes.INTEGER,
      DuplicateOutAction:DataTypes.INTEGER,
      CheckInTime:DataTypes.TIME,
      CheckOutTime:DataTypes.TIME
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  AttendanceRule.removeAttribute('id');//remove primary key.
  return AttendanceRule;
};