function selectize() {
  console.log('selectize');
  $('select').selectize();
}

$(document).ajaxComplete(function() {
  selectize();
});