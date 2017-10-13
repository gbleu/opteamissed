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

$(document).ajaxComplete(function(event, xhr, settings) {
  selectize();
  if (settings.url === '../assets/srm_cra_calendar.php') {
    injectPresetsControls('cra-modal');
  }
});
