function completeTimeSpan(timeSpan)
{
    var result = timeSpan;
    if(result == undefined)
    {
	result = {};
    }
    if(result.startDay == undefined) { result.startDay = 1; }
    if(result.startMonth == undefined) { result.startMonth = 1; }
    if(result.startQuarter == undefined) { result.startQuarter = 1; }
    if(result.startYear == undefined) { result.startYear = new Date().getFullYear(); }

    var currentDate = new Date();
    var currentYear = currentDate.getFullYear();
    var currentMonth = currentDate.getMonth();
    var currentQuarter = Math.floor(currentMonth/3)+1;
    var currentDay = currentDate.getDate();
    if(result.endYear == undefined) { result.endYear = currentYear; }
    if(result.endQuarter == undefined)
    {
	if(result.endYear == currentYear) { result.endQuarter = currentQuarter; }
	else { result.endQuarter = 4; }
    }
    if(result.endMonth == undefined)
    {
	if(result.endYear == currentYear) { result.endMonth = currentMonth+1; }
	else { result.endMonth = 12; }
    }
    if(result.endDay == undefined)
    {
	if(result.endYear == currentYear && result.endMonth == currentMonth+1) { result.endDay = currentDay; }
	else { result.endDay = 31; }
    }

    return result;
}

function generateTimePeriods(timeStep, timeSpan)
{
    switch(timeStep)
    {
    case 'year':
	return generateYearPeriods(timeSpan);
	break;
    case 'quarter':
	return generateQuarterPeriods(timeSpan);
	break;
    case 'month':
	return generateMonthPeriods(timeSpan);
	break;
    case 'week':
	return generateWeekPeriods(timeSpan);
	break;
    case 'day':
	return generateDayPeriods(timeSpan);
	break;
    default:
	alert("Unknown time step: "+timeStep);
	return [undefined, undefined];
    }
}
function generateYearPeriods(timeSpan)
{
    var result = [];

    for ( var y = timeSpan.startYear; y <= timeSpan.endYear; y++)
    {
	result.push(y.toString());
    }

    return [result, result];
}
function generateQuarterPeriods(timeSpan)
{
    var periods;
    var categories;

    var y = timeSpan.startYear;
    var q = timeSpan.startQuarter;

    while(true)
    {
	var startMonth = 1+((q-1)*3);
	var endMonth = q*3;
	var endDay;
	switch(q)
	{
	case 1:
	case 4:
	    endDay = 31;
	    break;
	case 2:
	case 3:
	    endDay = 30;
	    break;
	}

	periods.push(y+"/"+startMonth+"/01 - "+y+"/"+endMonth+"/"+endDay);
	categories.push("Q"+q+" "+y);
	if((y < timeSpan.endYear && q < 4) || (y == timeSpan.endYear && q < timeSpan.endQuarter)) { q++; }
	else if (y < timeSpan.endYear && q == 4) { q = 1; y++; }
	else if (y >= timeSpan.endYear && q >= timeSpan.endQuarter) { break; }
    }

    return [periods, categories];
}
function generateMonthPeriods(timeSpan)
{
    var periods = [];
    var categories = [];

    var y = timeSpan.startYear;
    var m = timeSpan.startMonth;

    while(true)
    {
	periods.push(y+"/"+m);
	categories.push(m+"/"+y);
	if((y < timeSpan.endYear && m < 12) || (y == timeSpan.endYear && m < timeSpan.endMonth)) { m = m+1; }
	else if (y < timeSpan.endYear && m == 12) { m = 1; y = y+1; }
	else if (y >= timeSpan.endYear && m >= timeSpan.endMonth) { break; }
    }

    return [periods,categories];
}

function generateWeekPeriods(timeSpan) // I so dont want to implement this!
{
    return [[],[]];
}

function generateDayPeriods(timeSpan)
{
    var periods = [];
    var categories = [];

    var currentDate = new Date(timeSpan.startYear, timeSpan.startMonth-1, timeSpan.startDay);
    var endDate = new Date(timeSpan.endYear, timeSpan.endMonth-1, timeSpan.endDay);

    while(currentDate <= endDate)
    {
	periods.push(currentDate.getFullYear()+"/"+(currentDate.getMonth()+1)+"/"+currentDate.getDate());
	categories.push(currentDate.getDate()+"."+(currentDate.getMonth()+1)+"."+currentDate.getFullYear());
	currentDate.setTime(currentDate.getTime()+86400000);
    }

    return [periods,categories];
}
