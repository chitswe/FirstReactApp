/**
 * Created by ChitSwe on 12/20/16.
 */
import {Connection,Request}  from 'tedious';
import db from '../../models';

class AttendanceStatus {

    static importData(sqlConnection){
        const instance = new AttendanceStatus(sqlConnection);
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
        const request = new Request("SELECT ID,Code,Description,LowerBound,UpperBound,ApplyAmount,AmountType,Enabled,AdState FROM AttendanceStatus",(error,rowCount)=>{
            if(error)
                onError(error);
        });
        request.on('row',columns=>{
            if(!this.hasError) {
                let promise = db.AttendanceStatus.create({
                    id:columns.ID.value,
                    Code:columns.Code.value,
                    Description:columns.Description.value,
                    LowerBound:columns.LowerBound.value,
                    UpperBound:columns.UpperBound.value,
                    ApplyAmount:columns.ApplyAmount.value,
                    AmountType:columns.AmountType.value,
                    Enabled:columns.Enabled.value,
                    AdState:columns.AdState.value
                }).catch(error => {
                    console.log(`Could not save new row to AttendanceStatus`);
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

export default AttendanceStatus;