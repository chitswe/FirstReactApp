/**
 * Created by ChitSwe on 12/21/16.
 */
const Schema=`
    scalar DateTime
    scalar Date
    type EmployeeGroup{
        id:Int!
        Name:String
        Member:[Employee]
    }
    type Employee{
        id:Int!
        Alias:String
        Name:String
        JobTitle:String
        Active:Boolean
        RetiredDate:Date
        HiredDate:Date
        BasicSalary:Float
        updatedAt:DateTime
        createdAt:DateTime
        GroupName:String
        EmployeeGroupId:Int
        InLog(forTheMonth:Date):[RawLog]
        OutLog(forTheMonth:Date):[RawLog]
        Attendance(forTheMonth:Date):[Attendance]
    }
    type RawLog{
        LDate:Date
        LTime:DateTime
        EditedTime:DateTime
        AppliedTime:DateTime
    }
    type AttendanceEntry{
        At:DateTime
        Status:String
        Difference:Int        
    }
    type Attendance{
        At:Date
        In:AttendanceEntry
        Out:AttendanceEntry
    }
    
    type Query{
        employee(search:String):[Employee]
        employeeById(id:Int!,forTheMonth:Date):Employee
    }
    
    schema{
        query:Query
    }
    
`;

export default Schema;