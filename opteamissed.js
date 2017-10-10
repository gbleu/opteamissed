function selectize() {
  console.log('selectize');
  $('select')
    .not('.selectized')
    .each(function(i, it) {
      const prevVal = $(it)
        .find('option[selected]')
        .val();
      const optLength = $(it).find('option').length;
      const firstVal = $(it)
        .find('option:first')
        .val();

      $(it).prepend(`<option value=""></option>`);
      const val = prevVal || (optLength === 1 ? firstVal : '');
      $(it).val(val);

      $(it).selectize({ placeholder: 'Choose one...' });
    });
}

$(document).ajaxComplete(function() {
  selectize();
});
