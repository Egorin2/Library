function editPlace(eve){
  let active = $(".active-Edit-place");
  if (eve.which == 13){
    active.removeClass("active-Edit-place");
    return;
  }
  if (eve.which == 8){
    console.log("Очистка");
  }
  let span = active.children("span")
  span.text(span.text() + eve.key);
}
$(document).keydown(function(e){editPlace(e)});
