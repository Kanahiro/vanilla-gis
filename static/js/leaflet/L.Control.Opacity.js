L.Control.Appearance = L.Control.extend({
	options: {
		collapsed: false,
		position: 'topright',
		label: null,
		radioCheckbox: true,
		layerName: true,
		opacity: false,
		remove: false
	},
	initialize: function (baseLayers, unremovableOverlays, overlays, options) {
		L.Util.setOptions(this, options);
		this._layerControlInputs = [];
		this._layers = [];
		this._lastZIndex = 0;
		this._handlingClick = false;

		for (var i in baseLayers) {
			this._addLayer(baseLayers[i], i);
		}
		for (var i in unremovableOverlays) {
			this._addLayer(unremovableOverlays[i], i, true, true);
		}
		for (var i in overlays) {
			this._addLayer(overlays[i], i, true);
		}
	},
	onAdd: function (map) {
		this._initLayout();
		this._update();

		return this._container;
	},
	// @method addOverlay(layer: Layer, name: String): this
	// Adds an overlay (checkbox entry) with the given name to the control.
	addOverlay: function (layer, name) {
		this._addLayer(layer, name, true);
		return (this._map) ? this._update() : this;
	},
	_onLayerChange: function (e) {
		if (!this._handlingClick) {
			this._update();
		}

		var obj = this._getLayer(Util.stamp(e.target));

		// @namespace Map
		// @section Layer events
		// @event baselayerchange: LayersControlEvent
		// Fired when the base layer is changed through the [layer control](#control-layers).
		// @event overlayadd: LayersControlEvent
		// Fired when an overlay is selected through the [layer control](#control-layers).
		// @event overlayremove: LayersControlEvent
		// Fired when an overlay is deselected through the [layer control](#control-layers).
		// @namespace Control.Layers
		var type = obj.overlay ?
			(e.type === 'add' ? 'overlayadd' : 'overlayremove') :
			(e.type === 'add' ? 'baselayerchange' : null);

		if (type) {
			this._map.fire(type, obj);
		}
	},
	expand: function () {
		L.DomUtil.addClass(this._container, 'leaflet-control-layers-expanded');
		this._form.style.height = null;
		var acceptableHeight = this._map.getSize().y - (this._container.offsetTop + 50);
		if (acceptableHeight < this._form.clientHeight) {
			L.DomUtil.addClass(this._form, 'leaflet-control-layers-scrollbar');
			this._form.style.height = acceptableHeight + 'px';
		} else {
			L.DomUtil.removeClass(this._form, 'leaflet-control-layers-scrollbar');
		}
		return this;
	},
	collapse: function () {
		L.DomUtil.removeClass(this._container, 'leaflet-control-layers-expanded');
		return this;
	},
	_initLayout: function () {
		var className = 'leaflet-control-layers',
		    container = this._container = L.DomUtil.create('div', className),
		    collapsed = this.options.collapsed;
		container.setAttribute('aria-haspopup', true);
		L.DomEvent.disableClickPropagation(container);
		L.DomEvent.disableScrollPropagation(container);
		if(this.options.label){
			var labelP = L.DomUtil.create('p', className + "-label");
			labelP.innerHTML = this.options.label;
			container.appendChild(labelP);
		}
		var form = this._form = L.DomUtil.create('form', className + '-list');
		if (collapsed) {
			this._map.on('click', this.collapse, this);
			if (!L.Browser.android) {
				L.DomEvent.on(container, {
					mouseenter: this.expand,
					mouseleave: this.collapse
				}, this);
			}
		}
		var link = this._layersLink = L.DomUtil.create('a', className + '-toggle', container);
		link.href = '#';
		link.title = 'Layers';
		if (L.Browser.touch) {
			L.DomEvent.on(link, 'click', L.DomEvent.stop);
			L.DomEvent.on(link, 'click', this.expand, this);
		} else {
			L.DomEvent.on(link, 'focus', this.expand, this);
		}
		if (!collapsed) {
			this.expand();
		}
		this._baseLayersList = L.DomUtil.create('div', className + '-base', form);
		this._separator = L.DomUtil.create('div', className + '-separator', form);
		this._overlaysList = L.DomUtil.create('div', className + '-overlays', form);
		container.appendChild(form);
	},
	_getLayer: function (id) {
		for (var i = 0; i < this._layers.length; i++) {
			if (this._layers[i] && L.Util.stamp(this._layers[i].layer) === id) {
				return this._layers[i];
			}
		}
	},
	_removeLayer: function (id) {
		for (var i = 0; i < this._layers.length; i++) {
			if (this._layers[i] && L.Util.stamp(this._layers[i].layer) === id) {
				this._layers.splice(i,1);
				break;
			}
		}
	},
	_addLayer: function (layer, name, overlay, unremovable) {
		this._layers.push({
			layer: layer,
			name: name,
			overlay: overlay,
			unremovable: unremovable
		});
	},
	_update: function () {
		if (!this._container) { return this; }
		L.DomUtil.empty(this._baseLayersList);
		L.DomUtil.empty(this._overlaysList);
		this._layerControlInputs = [];
		var baseLayersPresent, overlaysPresent, i, obj, baseLayersCount = 0;
		for (i = 0; i < this._layers.length; i++) {
			obj = this._layers[i];
			this._addItem(obj);
			overlaysPresent = overlaysPresent || obj.overlay;
			baseLayersPresent = baseLayersPresent || !obj.overlay;
			baseLayersCount += !obj.overlay ? 1 : 0;
		}
		this._separator.style.display = overlaysPresent && baseLayersPresent ? '' : 'none';
		return this;
	},
	_createRadioElement: function (name, checked) {

		var radioHtml = '<input type="radio" class="leaflet-control-layers-selector" name="' +
				name + '"' + (checked ? ' checked="checked"' : '') + '/>';

		var radioFragment = document.createElement('div');
		radioFragment.innerHTML = radioHtml;

		return radioFragment.firstChild;
	},
	_createRangeElement: function (name, opacity) {
		input = document.createElement('input');
		input.type = 'range';
		input.style.width = "70px";
		input.className = name;
		input.min = 0;
		input.max = 100;
		input.value = opacity * 100;
		return input;
	},
	_createCheckboxElement: function (name, checked) {
		input = document.createElement('input');
		input.type = 'checkbox';
		input.className = name;
		input.defaultChecked = checked;
		return input;
	},
	_createRemoveElement: function (name) {
		input = document.createElement('input');
		input.type = 'checkbox';
		input.value = '削除';
		input.className = name;
		input.defaultChecked = true;
		return input;
	},
	_testfunc: function(){
		console.log('clicked');
	},
	_addItem: function (obj) {
		var label = document.createElement('label'),
			checked = this._map.hasLayer(obj.layer),
			opacity = obj.layer.options.opacity,
			elements = [];
		var name = document.createElement('span');
		name.innerHTML = ' ' + obj.name;
		//HTML Elements for OVERLAY
		if (obj.overlay) {
			if (this.options.radioCheckbox){elements.push(this._createCheckboxElement('leaflet-control-layers-selector', checked))};
			if (this.options.layerName){elements.push(name)};
			if (this.options.opacity){elements.push(this._createRangeElement('leaflet-control-layers-range', opacity))};
			if (this.options.remove && !obj.unremovable){elements.push(this._createRemoveElement('leaflet-control-layers-remove'))};
		} else {
		//HTML Elements for BASELAYER
			if (this.options.radioCheckbox){elements.push(this._createRadioElement('leaflet-control-layers-selector', checked))};
			if (this.options.layerName){elements.push(name)};
		};
		var holder = document.createElement('div');
		label.appendChild(holder);
		for (var i = 0; i < elements.length; i++) {
			holder.appendChild(elements[i]);
			if (i == 1){continue};
			this._layerControlInputs.push(elements[i]);
			elements[i].layerId = L.Util.stamp(obj.layer);
			switch(elements[i].className){
				case "leaflet-control-layers-range":
					L.DomEvent.on(elements[i], 'change', this._onRangeClick, this);
					break;
				case "leaflet-control-layers-selector":
					L.DomEvent.on(elements[i], 'change', this._onRadioCheckboxClick, this);
					break;
				case "leaflet-control-layers-remove":
					L.DomEvent.on(elements[i], 'change', this._onRemoveClick, this);
					break;
			}
		};
		var container = obj.overlay ? this._overlaysList : this._baseLayersList;
		container.appendChild(label);
		return label;
	},
	_onRadioCheckboxClick: function () {
		var inputs = this._layerControlInputs,
		    input, layer;
		var addedLayers = [],
		    removedLayers = [];

		this._handlingClick = true;

		for (var i = inputs.length - 1; i >= 0; i--) {
			input = inputs[i];
			if (input.className != "leaflet-control-layers-selector"){continue};
			layer = this._getLayer(input.layerId).layer;

			if (input.checked) {
				addedLayers.push(layer);
			} else if (!input.checked) {
				removedLayers.push(layer);
			}
		}

		// Bugfix issue 2318: Should remove all old layers before readding new ones
		for (i = 0; i < removedLayers.length; i++) {
			if (this._map.hasLayer(removedLayers[i])) {
				this._map.removeLayer(removedLayers[i]);
			}
		}
		for (i = 0; i < addedLayers.length; i++) {
			if (!this._map.hasLayer(addedLayers[i])) {
				this._map.addLayer(addedLayers[i]);
			}
		}

		this._handlingClick = false;

		this._refocusOnMap();
	},
	_onRangeClick: function () {
		var inputs = this._layerControlInputs,
			input, layer;
			
		this._handlingClick = true;
		
		for (var i = inputs.length - 1; i >= 0; i--) {
			input = inputs[i];
			if (input.className != "leaflet-control-layers-range"){continue};
			layer = this._getLayer(input.layerId).layer;
			//undefined = overlay, not undefined = tilemap
			if( typeof layer._url === 'undefined'){
				var style = {"opacity":0.6,
							"fillOpacity":0.3};
				var rangeVal = parseFloat(parseInt(input.value / 10)/10);
				style.opacity = rangeVal;
				style.fillOpacity = rangeVal / 2;
				layer.setStyle(style);
				
			}else{
				layer.setOpacity(input.value / 100);
			}
		}

		this._handlingClick = false;
		this._refocusOnMap();
	},
	_onRemoveClick: function () {
		var inputs = this._layerControlInputs,
			input, layer;
			
		this._handlingClick = true;
		for (var i = 0; i < inputs.length; i++) {
			input = inputs[i];
			if (input.className != "leaflet-control-layers-remove"){continue};
			if (!input.checked){
				layer = this._getLayer(input.layerId).layer;
				this._map.removeLayer(layer);
				this._removeLayer(input.layerId);
				break;
			}
		}
		this._handlingClick = false;
		this._update();
		this._refocusOnMap();
	},
});

L.control.appearance = function (baseLayers, unremovableOverlays, overlays, options) {
        return new L.Control.Appearance(baseLayers, unremovableOverlays, overlays, options);
};