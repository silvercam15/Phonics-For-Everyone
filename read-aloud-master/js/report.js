$(function() {
  getState("lastUrl").then(function(url) {$("#txt-url").val(url)});
  $("#txt-comment").focus();
  $("#btn-submit").click(submit);
});

function submit() {
  $("#btn-submit").hide();
  $("#img-spinner").show();
  Promise.all([getBackgroundPage(), getSettings()])
    .then(spread(function(master, settings) {
      var url = $("#txt-url").val();
      var comment = $("#txt-comment").val();
      //TODO: actual reporting disabled b/c there is no server
      //return master.reportIssue(url + "\n" + JSON.stringify(settings), comment);
      return null
    }))
    .then(function() {
      $("#img-spinner").hide();
      $("#lbl-status").text("Issue has been reported, thank you!").toggleClass("error", false);
    })
    .catch(function() {
      $("#img-spinner").hide();
      $("#lbl-status").text("Server could not be contacted, please email me directly at ryanes@nd.edu. Thank you!").toggleClass("error", true);
    })
}
