$(document).ready(function() {

  var ctx = $('#chart')[0].getContext('2d');

  $('button[type=submit]').on('click', function() {
    var month = $('[name=month]').val(),
        firstYear = $('[name=first-year]').val(),
        secondYear = $('[name=second-year]').val();

    var firstYearStart = firstYear + '-' + month + '-01';
    var firstYearEnd;
    if (parseInt(month, 10) < 12) {
      firstYearEnd = firstYear + '-' + (parseInt(month, 10) + 1) + '-01';
    } else {
      firstYearEnd = (parseInt(firstYear, 10) + 1) + '-01-01';
    }

    var secondYearStart = secondYear + '-' + month + '-01';
    var secondYearEnd;
    if (parseInt(month, 10) < 12) {
      secondYearEnd = secondYear + '-' + (parseInt(month, 10) + 1) + '-01';
    } else {
      secondYearEnd = (parseInt(secondYear, 10) + 1) + '-01-01';
    }

    var firstYearResults = null;
    var secondYearResults = null;
    
    $.ajax('https://www.apitite.net/api/mongodb-webinar/orders-grouped-by-day/json?' + $.param({ start: firstYearStart, end: firstYearEnd }), {
      type: 'GET',
      success: function(result) {
        firstYearResults = result;
        if (firstYearResults && secondYearResults) {
          drawChart(firstYear, firstYearResults, secondYear, secondYearResults);
        }
      }
    });

    $.ajax('https://www.apitite.net/api/mongodb-webinar/orders-grouped-by-day/json?' + $.param({ start: secondYearStart, end: secondYearEnd }), {
      type: 'GET',
      success: function(result) {
        secondYearResults = result;
        if (firstYearResults && secondYearResults) {
          drawChart(firstYearResults, secondYearResults);
        }
      }
    });

    return false;
  });

  var drawChart = function(firstYear, firstYearResults, secondYear, secondYearResults) {

    var firstYearData = _.pluck(firstYearResults, 'orders');
    var secondYearData = _.pluck(secondYearResults, 'orders');
    
    var data = {
      labels: _.range(1, firstYearResults.length + 1),
      datasets: [
        {
          label: firstYear,
          fillColor: "rgba(220,220,220,0.2)",
          strokeColor: "rgba(220,220,220,1)",
          pointColor: "rgba(220,220,220,1)",
          pointStrokeColor: "#fff",
          pointHighlightFill: "#fff",
          pointHighlightStroke: "rgba(220,220,220,1)",
          data: firstYearData
        },
        {
          label: secondYear,
          fillColor: "rgba(151,187,205,0.2)",
          strokeColor: "rgba(151,187,205,1)",
          pointColor: "rgba(151,187,205,1)",
          pointStrokeColor: "#fff",
          pointHighlightFill: "#fff",
          pointHighlightStroke: "rgba(151,187,205,1)",
          data: secondYearData
        }
      ]
    };

    var chart = new Chart(ctx).Line(data);

  };

});