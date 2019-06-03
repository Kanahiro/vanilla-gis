var L.control.layers.customLayers = L.control.layers.extend({
    _addItem: function(obj){
        var label = document.createElement('label'),
        checked = this._map.hasLayer(obj.layer),
        input;

    if (obj.overlay) {
        input = document.createElement('input');
        input.type = 'checkbox';
        input.className = 'leaflet-control-layers-selector';
        input.defaultChecked = checked;
    } else {
        input = this._createRadioElement('leaflet-base-layers_' + Util.stamp(this), checked);
    }

    this._layerControlInputs.push(input);
    input.layerId = Util.stamp(obj.layer);

    DomEvent.on(input, 'click', this._onInputClick, this);

    var name = document.createElement('span');
    name.innerHTML = ' ' + obj.name;

    // Helps from preventing layer control flicker when checkboxes are disabled
    // https://github.com/Leaflet/Leaflet/issues/2771
    var holder = document.createElement('div');

    label.appendChild(holder);
    holder.appendChild(input);
    holder.appendChild(name);
    holder.appendChild(name);

    var container = obj.overlay ? this._overlaysList : this._baseLayersList;
    container.appendChild(label);

    this._checkDisabledLayers();
    return label;
    }
};