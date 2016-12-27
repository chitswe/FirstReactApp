/**
 * Created by ChitSwe on 12/20/16.
 */
import {Request}  from 'tedious';
import db from '../../models';
class AttendanceRule {

    static importData(sqlConnection){
        const instance = new AttendanceRule(sqlConnection);
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
        const request = new Request("SELECT NotClockInMins,NotClockOutMins,NotClockInAction,NotClockOutAction,EarlyLeaveToAbsent,LateInToAbsent,LateLeaveToOT,EarlyInToOT,DuplicateInAction,DuplicateOutAction,CheckInTime,CheckOutTime FROM AttendanceRule",(error,rowCount)=>{
            if(error)
                onError(error);
        });
        request.on('row',columns=>{
            if(!this.hasError) {
                let promise = db.AttendanceRule.create({
                    NotClockInMins:columns.NotClockInMins.value,
                    NotClockOutMins:columns.NotClockOutMins.value,
                    NotClockInAction:columns.NotClockInAction.value,
                    NotClockOutAction:columns.NotClockOutAction.value,
                    EarlyLeaveToAbsent:columns.EarlyLeaveToAbsent.value,
                    LateInToAbsent:columns.LateInToAbsent.value,
                    LateLeaveToOT:columns.LateLeaveToOT.value,
                    EarlyInToOT:columns.EarlyInToOT.value,
                    DuplicateInAction:columns.DuplicateInAction.value,
                    DuplicateOutAction:columns.DuplicateOutAction.value,
                    CheckInTime:columns.CheckInTime.value,
                    CheckOutTime:columns.CheckOutTime.value

                }).catch(error => {
                    console.log(`Could not save new row to AttendanceRule`);
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

export default AttendanceRule;