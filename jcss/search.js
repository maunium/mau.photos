function hideOrDeleteImage(action, image, hide){
  var payload = {
    "username": $("#uploader").val(),
    "auth-token": $("#authToken").val(),
    "image-name": image,
    "hidden": hide
  };

  $.ajax({
    type: "POST",
    url: "/" + action,
    data: JSON.stringify(payload),
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    success: function(data){
      $("#" + image + "-alert").remove();
      if(data == null) {
        showErr("Failed to " + action + " image.", image);
      } else {
        if (data["success"]) {
          if (action == "delete") {
            $("#" + image).remove();
          } else {
            $("#hide-" + image).attr('onClick', sprintf('hideOrDeleteImage(\'hide\', \'%s\', %s)', image, !hide));
            $("#hide-" + image).text(hide ? "Unhide" : "Hide");
            if (hide) $("#" + image).addClass("imghidden");
            else $("#" + image).removeClass("imghidden");
          }
        } else {
          showErr(data["status-humanreadable"], image);
        }
      }
      fixFooter();
    },
    error: function(jqXHR, textStatus, errorThrown) {
      var message = sprintf("Failed to %s image: %s", action, errorThrown);
      if(jqXHR.responseJSON) {
        message = jqXHR.responseJSON["status-humanreadable"];
      }
      $("#" + image + "-alert").remove();
      showErr(message, image);
      logErr(jqXHR, textStatus, errorThrown);
      fixFooter();
    }
  });
}

function search(){
  var payload = {
    "image-format": $("#format").val() == "Select Format" ? "" : $("#format").val(),
    "adder": $("#uploader").val(),
    "client-name": $("#client").val(),
    "uploaded-after": $("#timeRange").val() == "" ? 0 : window.minTime,
    "uploaded-before": $("#timeRange").val() == "" ? 0 : window.maxTime,
    "auth-token": $("#authToken").val()
  };

  $.ajax({
    type: "POST",
    url: "/search",
    data: JSON.stringify(payload),
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    success: function(data){
      $("#results").empty();
      if(!data.success || !data.results || data.results.length == 0) showErr(data.success ? "No images found" : data["status-humanreadable"], "results");
      else showSearchResults(data);
      fixFooter();
    },
    error: function(jqXHR, textStatus, errorThrown) {
      $("#results").empty();
      showErr(sprintf('Search failed: %s (HTTP %d)', jqXHR.responseJSON ? jqXHR.responseJSON["status-humanreadable"] : errorThrown, jqXHR.status), "results")
      logErr(jqXHR, textStatus, errorThrown);
      fixFooter();
    }
  });
}

function showSearchResults(data){
  data.results.sort(function(a, b){
    if(a.timestamp < b.timestamp) return 1;
    else if(a.timestamp > b.timestamp) return -1;
    else if (a.id < b.id) return 1;
    else if (a.id > b.id) return -1;
    else return 0;
  });

  var letManage = $("#authToken").val() != "";

  for (var i = 0; i < data.results.length; i++) {
    $("#results").append(sprintf('\
      <div class="card %6$s" id="%1$s"> \
        <a href="%1$s.%5$s"><img class="card-img-top img-fluid" src="%1$s.%5$s" alt="Image %1$s"></a> \
        <div class="card-block"> \
          <p class="card-text">Image %1$s uploaded by %2$s at %3$s using %4$s    %7$s</p> \
        </div> \
      </div>',
      data.results[i]["image-name"],
      data.results[i]["adder"],
      moment(data.results[i]["timestamp"] * 1000).format("HH:mm DD.MM.YYYY"),
      data.results[i]["client-name"],
      data.results[i]["image-format"],
      data.results[i]["hidden"] ? "imghidden" : "",
      !letManage ? "" : sprintf('\
        <span class="btn-group pull-xs-right" role="group" id="management" aria-label="Management"> \
          <button id="delete-%1$s" type="button" class="btn btn-management" onClick="hideOrDeleteImage(\'delete\', \'%1$s\', false)">Delete</button> \
          <button id="hide-%1$s" type="button" class="btn btn-management" onClick="hideOrDeleteImage(\'hide\', \'%1$s\', %2$s)">%3$s</button> \
        </span>',
        data.results[i]["image-name"],
        !data.results[i]["hidden"],
        data.results[i]["hidden"] ? "Unhide" : "Hide"
      )
    ));
  }
}

function showErr(errorMsg, image) {
  var alertId = image == "results" ? "error-alert" : image + "-alert";
  $("#" + image).append(sprintf('\
    <div class="alert alert-danger alert-dismissible fade in" id="%2$s" role="alert"> \
      <button type="button" class="close" data-dismiss="alert" aria-label="Close"> \
        <span aria-hidden="true">&times;</span> \
      </button> \
      %3$s \
    </div>',
    image,
    alertId,
    errorMsg
  ));
  $('#' + alertId).on('closed.bs.alert', fixFooter);
}

function logErr(jqXHR, textStatus, errorThrown) {
  console.log("--------------------- ERROR ---------------------");
  console.log(jqXHR);
  console.log(textStatus);
  console.log(errorThrown);
  console.log("--------------------- ^^^^^ ---------------------");
}

$('#timeRange').daterangepicker({
  "showDropdowns": true,
  "timePicker": true,
  "timePicker24Hour": true,
  "autoUpdateInput": false,
  "startDate": moment().day(1).hour(0).minute(0).second(0).format("HH:mm DD.MM.YYYY"),
  "endDate": moment().day(7).hour(0).minute(0).second(0).format("HH:mm DD.MM.YYYY"),
  "applyClass": "btn-apply",
  "cancelClass": "btn-cancel",
  "locale": {
    "format": "HH:mm DD.MM.YYYY",
    "separator": " - ",
    "applyLabel": "Apply",
    "cancelLabel": "Cancel",
    "fromLabel": "From",
    "toLabel": "To",
    "customRangeLabel": "Custom",
    "daysOfWeek": [
      "Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"
    ],
    "monthNames": [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ],
    "firstDay": 1
  }
}, function(start, end, label) {
  $("#timeRange").val(start.format('HH:mm DD.MM.YYYY') + " - " + end.format('HH:mm DD.MM.YYYY'));
  window.minTime = start._d.getTime() / 1000;
  window.maxTime = end._d.getTime() / 1000;
});

$("#timeRange").val("");
