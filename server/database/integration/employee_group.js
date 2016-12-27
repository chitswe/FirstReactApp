/**
 * Created by ChitSwe on 12/19/16.
 */
import {Connection,Request}  from 'tedious';
import db from '../../models';

class EmployeeGroup {

    static importData(sqlConnection){
        const instance = new EmployeeGroup(sqlConnection);
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
        const request = new Request("SELECT GroupID,Name FROM EmployeeGroup",(error,rowCount)=>{
            if(error)
                onError(error);
        });
        request.on('row',columns=>{
            if(!this.hasError) {
                let promise = db.EmployeeGroup.create({
                    id: columns.GroupID.value,
                    Name: columns.Name.value
                }).catch(error => {
                    console.log(`Could not save new row to EmployeeGroup`);
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

export default EmployeeGroup;