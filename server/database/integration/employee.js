/**
 * Created by ChitSwe on 12/19/16.
 */
import {Connection,Request}  from 'tedious';
import db from '../../models';

class Employee {

    static importData(sqlConnection){
        const instance = new Employee(sqlConnection);
        return new Promise((resolve,reject)=>{
            instance.import(resolve,reject);
        });
    }
    constructor(sqlConnection){
        this.sqlConnection = sqlConnection;
        this.hasError = false;
        this.promises = [];
    }
    import(onComplete,onError){
        const request = new Request("SELECT EmployeeID,Code,Name,JobTitle,Active,RetiredDate,HiredDate,BasicSalary,GroupID FROM Employee",(error,rowCount)=>{
            if(error)
                onError(error);
        });
        request.on('row',columns=>{
            if(!this.hasError) {
                let promise = db.Employee.create({
                    id: columns.EmployeeID.value,
                    Alias:columns.Code.value,
                    Name:columns.Name.value,
                    JobTitle:columns.JobTitle.value,
                    Active:columns.Active.value,
                    RetiredDate:columns.RetiredDate.value,
                    HiredDate:columns.HiredDate.value,
                    EmployeeGroupId:columns.GroupID.value
                }).catch(error => {
                    console.log(`Could not save new row to Employee`);
                    console.log(error);
                    this.hasError = true;
                    onError(error);
                });
                this.promises.push(promise);
            }
        });
        request.on('doneInProc',(rowCount,more,rows)=>{
            if(!this.hasError) {
                Promise.all(this.promises).then(()=>{onComplete(rowCount);});
            }
        });

        this.sqlConnection.execSql(request,(error,rowCount,rows)=>{
            if(error) {
                this.hasError = true;
                onError(error);
            }else
                onComplete(rowCount);
        });
    }
}

export default Employee;