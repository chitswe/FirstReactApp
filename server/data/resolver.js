/**
 * Created by ChitSwe on 12/21/16.
 */
import { GraphQLScalarType } from 'graphql';
import { Kind } from 'graphql/language';
import db from '../models/index';
import { property, constant } from 'lodash';

const Resolver={
    DateTime:new GraphQLScalarType({
        name: 'DateTime',
        description: 'Date time custom scalar type',
        parseValue(value) {
            return new Date(value); // value from the client
        },
        serialize(value) {
            return value.toJSON(); // value sent to the client
        },
        parseLiteral(ast) {
            if (ast.kind === Kind.STRING) {
                return new Date(ast.value); // ast value is always in string format
            }
            return null;
        },
    }),
    Date:new GraphQLScalarType({
        name: 'Date',
        description: 'Date custom scalar type',
        parseValue(value) {
            return (new Date(value)).dateOnly(); // value from the client
        },
        serialize(value) {
            return value.toDateOnlyJSON(); // value sent to the client
        },
        parseLiteral(ast) {
            if (ast.kind === Kind.STRING) {
                return new Date(ast.value); // ast value is always in string format
            }
            return null;
        },
    }),
    RawLog:{
        LDate:property('AppliedRecordTime'),
        LTime:property('RecordTime'),
        EditedTime:property('EditedRecordTime'),
        AppliedTime:property('AppliedRecordTime')
    },
    Employee:{
        InLog(employee,{forTheMonth}){
            let where={
                State:0,
                EmployeeId:employee.id
            }
            return db.AcLog.findAll({where,order:['AppliedRecordTime']});
        },
        OutLog(employee,{forTheMonth}){
            let where={
                State:1,
                EmployeeId:employee.id
            }
            return db.AcLog.findAll({where});
        },
        GroupName(employee){
            return employee.getEmployeeGroup().then(group=>group.Name);
        },
        Attendance(employee,{forTheMonth}){
            return db.sequelize.query("SELECT * FROM GetAttendanceLog(:StartDate,:EndDate,:EmployeeId)",
                {
                    replacements: {
                        StartDate:forTheMonth? forTheMonth.startOfMonth().toDateOnlyJSON() : null,
                        EndDate:forTheMonth? forTheMonth.endOfMonth().toDateOnlyJSON() : null,
                        EmployeeId:employee.id
                },type: db.sequelize.QueryTypes.SELECT});
        }

    },
    Attendance:{
        At:property('at'),
        In(attendance){
            return attendance.intime? {At:attendance.intime,Status:attendance.instatus,Difference:attendance.indiff}:null;
        },
        Out(attendance){
            return attendance.outtime? {At:attendance.outtime,Status:attendance.outstatus,Difference:attendance.outdiff}:null;
        }
    }
    ,
    Query:{
        employee(_,args){
            let search = args && args.search? `%${args.search}%`:'%';
            return db.Employee.findAll({where:{Name:{like:search}}});
        },
        employeeById(_,args){
            return db.Employee.findAll({where:{id:args.id}}).then(function(data){
                return data.length>0 ? data[0]:null;
            });
        }
    }
};

export default  Resolver;