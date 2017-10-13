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

      if (firstVal) {
        $(it).prepend(`<option value=""></option>`);
      }

      const val = prevVal || (optLength === 1 ? firstVal : '');
      $(it).val(val);

      $(it).selectize({ placeholder: 'Choose one...' });
    });
}

function savePreset() {
  const preset = [];
  $('form#cra-form tbody tr:not(:first, :last)').each(function(i, line) {
    const presetLine = {};
    $(line)
      .find('select')
      .each(function(ii, select) {
        presetLine[$(select).attr('name')] = $(select).val();
      });
    preset[i] = presetLine;
  });

  const name = prompt('Name ?');

  const presets = loadPresets();
  presets.set(name, preset);
  return savePresets(presets);
}

function removePreset(name) {
  const presets = loadPresets();
  if (!presets.has(name)) {
    console.warn(`Preset ${name} not found`);
    return false;
  }
  const deleted = presets.delete(name);
  const saved = savePresets(presets);
  return deleted && saved;
}

function loadPreset(name) {
  const presets = loadPresets();
  if (!presets.has(name)) {
    console.warn(`Preset ${name} not found`);
  }
  const preset = presets.get(name);
  const lines = preset.length;
  const max = 8;
  let i = 1;
  while ($('form#cra-form tbody tr').length - 2 < lines && i < max) {
    $('form#cra-form #cra-add-button button').click();
    i++;
  }
  preset.forEach(function(presetLine, index) {
    const line = $('form#cra-form tbody tr').get(index + 1);
    for (var prop in presetLine) {
      console.debug(`Set value ${presetLine[prop]} for ${prop}`);
      const select = $(line).find(`select[name="${prop}"]`);
      const selectize = $(select).selectize()[0].selectize;
      selectize.setValue(presetLine[prop]);
    }
  });
}

function loadPresets() {
  const presets = localStorage.getItem('presets');
  return presets ? new Map(JSON.parse(presets)) : new Map();
}

function savePresets(presets = new Map()) {
  try {
    localStorage.setItem(
      'presets',
      JSON.stringify(Array.from(presets.entries()))
    );
    return true;
  } catch (e) {
    console.warn(e);
    return false;
  }
}

function injectPresetsControls(modalId) {
  console.log('inject preset controls');
  const presets = loadPresets();

  const loadSelect = $('<select>')
    .attr('id', `loadPreset-${modalId}`)
    .attr('placeholder', 'Choose one...')
    .append(
      $('<option>')
        .attr('value', '')
        .text('')
    );
  for (const key of presets.keys()) {
    loadSelect.append(
      $('<option>')
        .attr('value', key)
        .text(key)
    );
  }

  const saveButton = $('<button>')
    .attr('id', `savePreset-${modalId}`)
    .attr('type', 'button')
    .attr('class', 'btn')
    .attr('onclick', 'savePreset()')
    .html('<i class="fa fa-bookmark" /> Save');

  const cardTitle = $('<h4>')
    .attr('class', 'card-title')
    .text('Presets');
  const blabla1 = $('<p>')
    .attr('class', 'card-text')
    .text('Click save to add the current selection to your presets.');
  const blabla2 = $('<p>')
    .attr('class', 'card-text')
    .text('Choose a preset in the list to replace the current selection.');

  $(`div#${modalId} form#cra-form`).before(
    $('<div>')
      .attr('class', 'card')
      .append(
        $('<div>')
          .attr('class', 'card-body')
          .append(cardTitle)
          .append(blabla1)
          .append(blabla2)
          .append(
            $('<div>')
              .attr('class', 'row')
              .append(
                $('<div>')
                  .attr('class', 'col-xs-4')
                  .append(saveButton)
              )
              .append(
                $('<div>')
                  .attr('class', 'col-xs-8')
                  .append(loadSelect)
              )
          )
      )
  );

  $(`select#loadPreset-${modalId}`).selectize({
    onChange: function(val) {
      if (val) {
        loadPreset(val);
      }
    }
  });
}

function overloadCraAddForm() {
  $('#cra-modal').off('click', '.cra-add-form');
  $('#cra-modal').on('click', '.cra-add-form', function() {
    // Clone line like before
    const newRowIndex = craCloneRow();
    // Add missing options to selects
    $('#cra-form #cra-form-table > tbody > tr.cra-form-val')
      .find('select')
      .each(function() {
        if ($(this)[0].selectize) {
          const name = $(this).attr('name');
          const options = $(this)[0].selectize.options;
          const optionsArray = Object.keys(options).map(key => options[key]);
          const newName = name.replace('form[0]', `form[${newRowIndex}]`);

          $(`select[name="${newName}"]`)
            .next('div')
            .remove();
          $(`select[name="${newName}"]`).removeClass('selectized');
          $(`select[name="${newName}"]`).selectize({
            placeholder: 'Choose one...',
            options: optionsArray
          });
        }
      });
  });
}

function craCloneRow() {
  if (view_mode == 0) return;
  var str = 'form\\[0]';
  var re = new RegExp(str, 'g');
  var form_count = $('#cra-form-table > tbody > tr').length - 2;
  var text =
    '<tr>' +
    $('.cra-form-val')
      .eq(0)
      .html()
      .replace('cra-form-delete', 'cra-form-delete fa fa-times text-danger')
      .replace(re, 'form[' + form_count + ']') +
    '</tr>';
  $(text)
    .insertBefore('#cra-add-button')
    .find('.cra-ia-id')
    .remove();
  return form_count;
}

$(document).ajaxComplete(function(event, xhr, settings) {
  selectize();
  if (settings.url === '../assets/srm_cra_calendar.php') {
    injectPresetsControls('cra-modal');
    overloadCraAddForm();
  }
});
