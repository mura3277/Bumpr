$(document).ready(function() {
    setModelValues($("#dynamic-brand-field").val());
    $("#dynamic-brand-field").change(function () {
        setModelValues($(this).val());
    });
});

var setModelValues = function(id) {
    //Url must be updated in production
    $.getJSON("http://127.0.0.1:5000/api/models/" + id, function(data) {
        $("#dynamic-model-field").empty();
        $.each(data, function(index, value) {
            $("#dynamic-model-field").append('<option>'+value+'</option>');
        });
    });
}