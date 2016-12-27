'use strict';
module.exports = function(sequelize, DataTypes) {
  var AcLog = sequelize.define('AcLog', {
      RecordTime: DataTypes.DATE,
      EditedRecordTime:DataTypes.DATE,
      Ignore:DataTypes.BOOLEAN,
      State:DataTypes.INTEGER,
      Status:DataTypes.STRING(200),
      AppliedRecordTime:DataTypes.DATE,
      TimeDiff:DataTypes.INTEGER

  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
          AcLog.belongsTo(models.Employee);
      }
    }
  });
  return AcLog;
};