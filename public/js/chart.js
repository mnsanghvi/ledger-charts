var chartCashflow;
var numberRegexp = /^[-0-9.,]*$/

function getAmount(s)
{
    var parts = s.split(' ');
    for( var i in parts)
    {
	if(numberRegexp.test(parts[i]))
	{
	    return parseFloat(parts[i]);
	}
    }
}

$(document).ready(
    function()
    {
	chartCashflow = new Highcharts.Chart(
	    {
		chart:
		{
		    renderTo: 'chart-canvas',
		    type: 'column',
//		    events: { load: requestDataForCurrentYear }
		    events: { load: requestData(4, 2010, 3, 2012) }
		},
		title:
		{
		    text: 'Cashflow'
		},
		xAxis:
		{
		    categories: generateCategoriesForTimespan(4, 2010, 3, 2012),
		    labels: { rotation: -45, y: 30 }
		},
		yAxis:
		{
		    title: { text: 'Value' }
		},
		legend:
		{
		    enabled: false
		},
		series: 
		[
		    {
			name: 'Cashflow',
			data: []
		    }
		]
	    }
	);
    }
);

function generateCategoriesForTimespan(start_month, start_year, end_month, end_year)
{
    var categories = []
    
    var m = start_month, y = start_year;

    while(true)
    {
	categories.push(m+"/"+y);
	if((y < end_year && m < 12) || (y == end_year && m < end_month)) { m = m+1; }
	else if (y < end_year && m == 12) { m = 1; y = y+1; }
	else if (y >= end_year && m >= end_month) { break; }
    }

    return categories;
}

function requestDataForCurrentYear()
{
    var date = new Date();
    return requestData(1, date.getFullYear(), date.getMonth()+1, date.getFullYear());
}
function requestDataForYear(year)
{
    var date = new Date();
    return requestData(1, year, 12, year);
}

function requestData(month, year, end_month, end_year)
{
    $.ajax(
	{
	    type: 'POST',
	    url: '/balance',
	    data: 'query=-p '+year+'/'+month+' impuls',
	    success: function(msg)
	    {
		response = $.parseJSON(msg)
		if(response)
		{
		    var total = 0
		    if(!response.total)
		    {
			for( var account in response.accounts )
			{
			    if( typeof(response.accounts[account]) == "string")
			    {
				total = getAmount(response.accounts[account]);
				break;
			    }
			}
		    }
		    else
		    {
			total = getAmount(response.total);
		    }
		
		    chartCashflow.series[0].addPoint(total, true);
		}

		if((year < end_year && month < 12) || (year == end_year && month < end_month)) { requestData(month+1, year, end_month, end_year); }
		else if (year < end_year && month == 12) { requestData(1, year+1, end_month, end_year); }
	    }
	}
    );
}
