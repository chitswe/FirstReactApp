SELECT theDate AS At,CIN."AppliedRecordTime" AS InTime,COUT."AppliedRecordTime" AS OutTime,CIN."Status" AS InStatus,COUT."Status" AS OutStatus,CIN."TimeDiff" AS InDiff,COUT."TimeDiff" AS OutDiff FROM explodeDateRange('2016-7-6'::DATE,'2016-08-23'::DATE) AS T
LEFT JOIN
(SELECT * FROM "AcLog" WHERE "Ignore"=false AND "State" = 1 AND "EmployeeId"=2) AS COUT
ON T.theDate = COUT."AppliedRecordTime"::DATE
LEFT JOIN
(SELECT * FROM "AcLog" WHERE "Ignore"=false AND "State" = 0 AND "EmployeeId" = 2) AS CIN
ON T.theDate = CIN."AppliedRecordTime"::DATE






