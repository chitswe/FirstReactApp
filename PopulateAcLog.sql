DO $$
DECLARE 
NotClockInMins INT;
NotClockOutMins INT;
NotClockInAction INT;
NotClockOutAction INT;
EarlyLeaveToAbsent INT;
LateInToAbsent INT;
LateLeaveToOT INT;
EarlyInToOT INT;
DuplicateInAction INT;
DuplicateOutAction INT;
CheckInTime TIME WITH TIME ZONE;
CheckOutTime TIME WITH TIME ZONE;
BEGIN
	SELECT "NotClockInMins","NotClockOutMins","NotClockInAction","NotClockOutAction","EarlyLeaveToAbsent","LateInToAbsent","LateLeaveToOT","EarlyInToOT", "DuplicateInAction","DuplicateOutAction","CheckInTime","CheckOutTime"
	INTO NotClockInMins,NotClockOutMins,NotClockInAction,NotClockOutAction,EarlyLeaveToAbsent,LateInToAbsent,LateLeaveToOT,EarlyInToOT,DuplicateInAction,DuplicateOutAction,CheckInTime,CheckOutTime
	FROM "AttendanceRule";

	--set AppliedRecordTime truncate seconds
	UPDATE "AcLog" 
	SET "AppliedRecordTime" = DATE_TRUNC('MINUTE',COALESCE("EditedRecordTime","RecordTime")),
	"Ignore"=FALSE,
	"Status"=NULL;
	--set "TimeDiff" in minutes
	UPDATE "AcLog"
	SET "TimeDiff" = CASE "State" WHEN 0 THEN
	EXTRACT(EPOCH FROM ((CAST("AppliedRecordTime" AS DATE ) + CheckInTime) - "AppliedRecordTime")) /60
	WHEN 1 THEN
	EXTRACT(EPOCH FROM ("AppliedRecordTime" - (CAST("AppliedRecordTime" AS DATE ) + CheckOutTime))) /60
	ELSE NULL END;

	--Duplicate In Action is Take_First
	UPDATE "AcLog" 
	SET "Ignore"=TRUE,
	"Status" = 'Duplicate In'
	FROM 
	(
	SELECT *,ROW_NUMBER() OVER (PARTITION BY "EmployeeId",CAST("AppliedRecordTime" AS DATE) ORDER BY "AppliedRecordTime") AS O FROM "AcLog"
	WHERE "State" = 0 AND DuplicateInAction=0
	) AS T
	WHERE "AcLog".Id=T."id" AND T.O>1;

	--Duplicate In Action is Take_Last
	UPDATE "AcLog" 
	SET "Ignore"=TRUE,
	"Status" = 'Duplicate In'
	FROM 
	(
	SELECT *,ROW_NUMBER() OVER (PARTITION BY "EmployeeId",CAST("AppliedRecordTime" AS DATE) ORDER BY "AppliedRecordTime" DESC) AS O FROM "AcLog"
	WHERE "State" = 0 AND DuplicateInAction=1
	) AS T
	WHERE "AcLog".Id=T."id" AND T.O>1;
	
	--Duplicate Out Action is Take_First
	UPDATE "AcLog" 
	SET "Ignore"=TRUE,
	"Status" = 'Duplicate Out'
	FROM 
	(
	SELECT *,ROW_NUMBER() OVER (PARTITION BY "EmployeeId",CAST("AppliedRecordTime" AS DATE) ORDER BY "AppliedRecordTime" ) AS O FROM "AcLog"
	WHERE "State" = 1 AND DuplicateOutAction=0
	) AS T
	WHERE "AcLog".Id=T."id" AND T.O>1;

	--Duplicate Out Action is Take_Last
	UPDATE "AcLog" 
	SET "Ignore"=TRUE,
	"Status" = 'Duplicate Out'
	FROM 
	(
	SELECT *,ROW_NUMBER() OVER (PARTITION BY "EmployeeId",CAST("AppliedRecordTime" AS DATE) ORDER BY "AppliedRecordTime" DESC) AS O FROM "AcLog"
	WHERE "State" = 1 AND DuplicateOutAction=1
	) AS T
	WHERE "AcLog".Id=T."id" AND T.O>1;

	--Late in to absent
	UPDATE "AcLog" SET "Ignore" = true, "Status"='Absent for very Late In'  WHERE "Ignore" = false
	AND "State" = 0
	AND "TimeDiff" < LateInToAbsent * -1;

	--Early out to Absent
	UPDATE "AcLog" SET "Ignore" = true, "Status" = 'Absent for very early out'  WHERE "Ignore" = false
	AND "State" = 1
	AND "TimeDiff" <EarlyLeaveToAbsent * -1;


	--Late IN
	UPDATE "AcLog" SET "Status" = 'Late'  WHERE "State" = 0 AND "Ignore" = false AND "TimeDiff">=LateInToAbsent * -1 AND "TimeDiff" <0;

	--ot
	UPDATE "AcLog" SET "Status" = 'OT'  WHERE "State" = 0 AND "Ignore" = false AND "TimeDiff">EarlyInToOT;

	--normal
	UPDATE "AcLog" SET "Status" = 'Normal'  WHERE "State" = 0 AND "Ignore" = false AND "TimeDiff"<=EarlyInToOT AND "TimeDiff">=0;

	-------
	--early
	UPDATE "AcLog" SET "Status" = 'Early' WHERE "State" = 1 AND "Ignore" = false AND "TimeDiff" >=EarlyLeaveToAbsent * -1 AND "TimeDiff" < 0;

	--OT
	UPDATE "AcLog" SET "Status" = 'OT'  WHERE "State" = 1 AND "Ignore" = false AND "TimeDiff">LateLeaveToOT;

	--NORMAL
	UPDATE "AcLog" SET "Status" = 'Normal'  WHERE "State" = 1 AND "Ignore" = false AND "TimeDiff"<=LateLeaveToOT AND "TimeDiff">=0;

	UPDATE "AcLog" AS L SET "Status" =S."Code" FROM  "AttendanceStatus" AS S WHERE (L."TimeDiff"*-1) >=S."LowerBound" AND (L."TimeDiff" * -1)<=S."UpperBound"
	AND L."State" = S."AdState" AND L."TimeDiff"<0 AND S."Enabled" = true AND L."Ignore"=false;


	
	DROP TABLE IF EXISTS TAcLog;
	CREATE  TEMP TABLE TAcLog AS
	SELECT 'A';
	
	
END $$;

 PopulateAttendanceLog();
