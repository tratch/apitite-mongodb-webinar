$(document).ready(function() {

  var chart = null;

  var onSubmitClick = function() {

    var monthStr = $('[name=month]').val(),
        firstYearStr = $('[name=first-year]').val(),
        secondYearStr = $('[name=second-year]').val(),
        category = $('[name=category]:checked').val();

    var firstYearParams = $.param({
      start: getStart(firstYearStr, monthStr),
      end: getEnd(firstYearStr, monthStr)
    });

    var secondYearParams = $.param({
      start: getStart(secondYearStr, monthStr),
      end: getEnd(secondYearStr, monthStr)
    });

    var firstYearData = null,
        secondYearData = null;

    var firstDeferred = $.ajax('https://www.apitite.net/api/webinar-template/get-orders-by-day/json?' + firstYearParams);
    var secondDeferred = $.ajax('https://www.apitite.net/api/webinar-template/get-orders-by-day/json?' + secondYearParams);

    $.when(firstDeferred, secondDeferred).done(function(firstYearResults, secondYearResults) {
      var firstYearData = firstYearResults[0],
          secondYearData = secondYearResults[0];

      if (chart) {
        updateChart(category, firstYearStr, firstYearData, secondYearStr, secondYearData);
      } else {
        drawChart(category, firstYearStr, firstYearData, secondYearStr, secondYearData);
      }
    });

    return false;
  };

  var drawChart = function(category, firstYearStr, firstYearData, secondYearStr, secondYearData) {
    var ctx = $('#chart')[0].getContext('2d');
    
    var data = {
      labels: _.range(1, firstYearData.length + 1),
      datasets: [
        {
          label: firstYearStr,
          fillColor: "rgba(220,220,220,0.2)",
          strokeColor: "rgba(220,220,220,1)",
          pointColor: "rgba(220,220,220,1)",
          pointStrokeColor: "#fff",
          pointHighlightFill: "#fff",
          pointHighlightStroke: "rgba(220,220,220,1)",
          data: _.pluck(firstYearData, category)
        },
        {
          label: secondYearStr,
          fillColor: "rgba(151,187,205,0.2)",
          strokeColor: "rgba(151,187,205,1)",
          pointColor: "rgba(151,187,205,1)",
          pointStrokeColor: "#fff",
          pointHighlightFill: "#fff",
          pointHighlightStroke: "rgba(151,187,205,1)",
          data: _.pluck(secondYearData, category)
        }
      ]
    };

    chart = new Chart(ctx).Line(data);
  };

  var updateChart = function(category, firstYearStr, firstYearData, secondYearStr, secondYearData) {
    var firstYearValues = _.pluck(firstYearData, category);
    var secondYearValues = _.pluck(secondYearData, category);

    for (var i = 0; i < firstYearValues.length; i++) {
      chart.datasets[0].points[i].value = firstYearValues[i];
      chart.datasets[1].points[i].value = secondYearValues[i];
    }

    chart.update();
  };

  var getStart = function(yearStr, monthStr) {
    // return YYYY-MM-DD
    return yearStr + '-' + monthStr + '-01';
  };

  var getEnd = function(yearStr, monthStr) {
    var month = parseInt(monthStr, 10),
        year = parseInt(yearStr, 10);
    if (month < 12)
      return yearStr + '-' + ('0' + (month+1)).slice(-2) + '-01';
    else
      return (year+1) + '-01-01';
  };

  $('button[type=submit]').on('click', onSubmitClick);

});