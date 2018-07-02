function upload() {
	var payload = {
    "image": window.btoa(/*TODO: image data*/),
		"image-format": "png",
    "client-name": "mauImages",
    "username": $("#username").val(),
		"auth-token": $("#authtoken").val()
  };

  $.ajax({
    type: "POST",
    url: "/insert",
    data: JSON.stringify(payload),
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    success: function(data){
      if (data.success) {
				console.log("Uploaded!", data["image-name"])
			} else {
				console.log(data["status-humanreadable"])
			}
    },
    error: function(jqXHR, textStatus, errorThrown) {

    }
  });
}

function login() {

}

$("#dragndrop").on('dragenter', function (e) {
  e.stopPropagation();
  e.preventDefault();
  $(this).css('border', '2px solid #0B85A1');
});

$("#dragndrop").on('dragover', function (e) {
	e.stopPropagation();
	e.preventDefault();
});

$("#dragndrop").on('drop', function (e) {
	$(this).css('border', '2px dotted #0B85A1');
	e.preventDefault();
	var files = e.originalEvent.dataTransfer.files;

	console.log(e.originalEvent.dataTransfer.files);
});

$("#dragndrop").on("dragend", function (e) {
	$("#dragndrop").css('border', '2px dotted #0B85A1');
});

$("#dragndrop").on("dragleave", function (e) {
	$("#dragndrop").css('border', '2px dotted #0B85A1');
});

$(document).on('dragenter', function (e) {
  e.stopPropagation();
  e.preventDefault();
});

$(document).on('dragover', function (e) {
  e.stopPropagation();
  e.preventDefault();
  $("#dragndrop").css('border', '2px dotted #0B85A1');
});

$(document).on('drop', function (e) {
  e.stopPropagation();
  e.preventDefault();
});

$("#name").val(window.localStorage.name)
$("#authtoken").val(window.localStorage.authtoken)
