$(document).ready(function() {

  $('button[type=submit]').on('click', function() {
    var limit = $('[name=limit]').val(),
        skip  = $('[name=skip]').val();

    $.ajax('https://www.apitite.net/api/mongodb-webinar/get-all-orders/json?' + $.param({ limit: limit, skip: skip }), {
      type: 'GET',
      success: function(result) {
        $('#results').text(JSON.stringify(result, null, 2));
      }
    });

    return false;
  });

});