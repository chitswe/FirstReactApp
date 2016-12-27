/**
 * Created by ChitSwe on 12/19/16.
 */
import {Connection,Request}  from 'tedious';
import EmployeeGroup from './employee_group';
import Employee from './employee';
import AttendanceStatus from './attendance_status';
import AttendanceRule from './attendance_rule';
import AcLog from './aclog';
import db from '../../models';
const config={
    server: '192.168.0.195',
    userName: 'sa',
    password: '12345',
    options:{
        database:'Hr',
        useColumnNames:true
    }
};


var connection = new Connection(config);

connection.on('connect', function(err) {

       if(!err) {
           console.log('Connected to sql server.');
           db.AcLog.destroy({where:{}});
           db.AttendanceRule.destroy({where:{}});
           db.AttendanceStatus.destroy({where:{}});
           db.Employee.destroy({where:{}});
           db.EmployeeGroup.destroy({where:{}});
           EmployeeGroup.importData(connection).then(rowsCount => {
               reportRowsCount('EmployeeGroup', rowsCount);
               Employee.importData(connection).then(rowsCount=>{
                   reportRowsCount("Employee",rowsCount);
                   AttendanceStatus.importData(connection).then(rowsCount=>{
                       reportRowsCount("AttendanceStatus",rowsCount);
                       AttendanceRule.importData(connection).then(rowsCount=>{
                           reportRowsCount("AttendanceRule",rowsCount);
                           AcLog.importData(connection).then(rowsCount=>{
                               reportRowsCount("AcLog",rowsCount);
                               connection.close('Close on completed');
                           }).catch(error=>{
                               reportImportError("AcLog",error);
                               connection.close("Close on Error");
                           });
                       }).catch(error=>{
                            reportImportError("AttendanceRule");
                           connection.close("Close on Error");
                       });
                   }).catch(error=>{
                       reportImportError("AttendanceStatus",error);
                       connection.close("Close on Error");
                   });
               }).catch(error=>{
                   reportImportError("Employee",error);
                   connection.close("Close on Error");
               });

           }).catch(error => {
               reportImportError('EmployeeGroup', error);
               connection.close("Close on Error");
           });
       }
       else{
           console.log('Data import aborted.');
           console.log(`Error:${err}`);
           connection.close("Close on Error");
       }
    }
);

function reportImportError(tableName,error){
    console.log(`${tableName}: ${error}`);
}
function reportRowsCount(tableName,count){
    console.log(`${tableName}: ${count} rows imported.`);
}

connection.on('debug', function(text) {
        console.log(`Sql server:${text}`);
    }
);



