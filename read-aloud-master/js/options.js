
$(function() {
  $("[data-i18n]").each(function() {
    var key = $(this).data("i18n");
    $(this).text(chrome.i18n.getMessage(key));
  });
  $(".slider").each(function() {
    $(this).slider({
      min: $(this).data("min"),
      max: $(this).data("max"),
      step: $(this).data("step")
    })
  });

  Promise.all([getSettings(), getVoices()]).then(spread(function(settings, voices) {
    voices.sort(function(a,b) {
      if (isRemoteVoice(a.voiceName)) {
        if (isRemoteVoice(b.voiceName)) return a.voiceName.localeCompare(b.voiceName);
        else return 1;
      }
      else {
        if (isRemoteVoice(b.voiceName)) return -1;
        else return a.voiceName.localeCompare(b.voiceName);
      }
    });
    voices.forEach(function(voice) {
      console.log(voice.voiceName);
      if(isGoogleNative(voice.voiceName)) {
          $("<option>")
              .val(voice.voiceName)
              .text(voice.voiceName)
              .prop("selected", voice.voiceName == settings.voiceName)
              .appendTo($("#voices"));
      }
    });
    //$("<option>").val("Phonetic").text("Phonetic").prop("selected", "Phonetic"==settings.voiceName).appendTo($("#voices"));
    $("#rate").slider("value", Math.log(settings.rate || defaults.rate) / Math.log($("#rate").data("pow")));
    $("#pitch").slider("value", settings.pitch || defaults.pitch);
    $("#volume").slider("value", settings.volume || defaults.volume);
    $("[name=highlighting]").prop("checked", false);
    $("[name=highlighting][value=" + (settings.showHighlighting != null ? settings.showHighlighting : defaults.showHighlighting) + "]").prop("checked", true);
    $("[name=phonetic]").prop("checked", false);
    $("[name=phonetic][value=" + (settings.playPhonetic != null ? settings.playPhonetic : defaults.playPhonetic) + "]").prop("checked", true);

  }));

  $("#save").click(function() {
    updateSettings({
      voiceName: $("#voices").val(),
      rate: Math.pow($("#rate").data("pow"), $("#rate").slider("value")),
      pitch: $("#pitch").slider("value"),
      volume: $("#volume").slider("value"),
      showHighlighting: Number($("[name=highlighting]:checked").val()),
      playPhonetic: Number($("[name=phonetic]:checked").val()),
    })
    .then(function() {
      $(".status.success").show().delay(3000).fadeOut();
    });
  });

  $("#reset").click(function() {
    clearSettings().then(() => location.reload());
  });
});
