/**
 * Created by ChitSwe on 12/20/16.
 */
import {Request}  from 'tedious';
import db from '../../models';
class AcLog {

    static importData(sqlConnection){
        const instance = new AcLog(sqlConnection);
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
        const request = new Request("SELECT EmployeeID,RecordTime,EditedRecordTime,Ignore,State,Status,AppliedRecordTime,TimeDiff FROM AcLog",(error,rowCount)=>{
            if(error)
                onError(error);
        });
        request.on('row',columns=>{
            if(!this.hasError) {
                let promise = db.AcLog.create({
                    RecordTime:columns.RecordTime.value?columns.RecordTime.value.assumeUTCAsLocal():null,
                    EditedRecordTime:columns.EditedRecordTime.value?columns.EditedRecordTime.value.assumeUTCAsLocal():null,
                    Ignore:columns.Ignore.value,
                    State:columns.State.value,
                    Status:columns.Status.value,
                    AppliedRecordTime:columns.AppliedRecordTime.value.assumeUTCAsLocal(),
                    TimeDiff:columns.TimeDiff.value,
                    EmployeeId:columns.EmployeeID.value

                }).catch(error => {
                    console.log(`Could not save new row to AcLog`);
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

export default AcLog;