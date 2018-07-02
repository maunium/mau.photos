function query(action){
  var payload = {
    "username": $("#username").val(),
    "password": $("#password").val(),
  };

  var name = "log in";
  if (action == "register") {
    name = "sign up";
  }

  $.ajax({
    type: "POST",
    url: "/auth/" + action,
    data: JSON.stringify(payload),
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    success: function(data){
      if(data == null || data.length == 0) {
        $("#main-alert").removeClass("hidden-xs-up");
        $("#main-alert").text("Failed to " + name + ": Unknown error");
      } else {
        if (data["success"]) {
          $("#main-alert").addClass("hidden-xs-up");
          $("#authtoken").text(data["auth-token"]);
        } else {
          $("#main-alert").removeClass("hidden-xs-up");
          $("#main-alert").text(data["error-humanreadable"]);
        }
      }
      fixFooter();
    },
    error: function(jqXHR, textStatus, errorThrown) {
      var message = "Failed to " + name + ": " + errorThrown + " (HTTP " + jqXHR.status + ")";
      if(jqXHR.responseJSON) {
        message = jqXHR.responseJSON["error-humanreadable"];
      }
      $("#main-alert").removeClass("hidden-xs-up");
      $("#main-alert").text(message);
      console.log("--------------------- ERROR ---------------------");
      console.log(jqXHR);
      console.log(textStatus);
      console.log(errorThrown);
      console.log("--------------------- ^^^^^ ---------------------");
      fixFooter();
    }
  });
}
