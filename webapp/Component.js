/* global document */
sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/Device",
	"com/havelsan/HOTEL/model/models",
	"com/havelsan/HOTEL/controller/ErrorHandler",
	"com/havelsan/HOTEL/controller/LiveChangeFilter",
	"com/havelsan/HOTEL/controller/Fragment/Otel_CRUD",
	"com/havelsan/HOTEL/controller/Fragment/Oda_CRUD",
	"com/havelsan/HOTEL/controller/Fragment/Musteri_CRUD",
	"com/havelsan/HOTEL/controller/Fragment/Rezervasyon_CRUD",
	"com/havelsan/HOTEL/controller/Fragment/SelectMusteri_LIST",
	"com/havelsan/HOTEL/controller/Fragment/SelectOtel_LIST",
	"com/havelsan/HOTEL/controller/Fragment/Sehirler"
], function(UIComponent, Device, models, ErrorHandler, LiveChangeFilter, Otel_CRUD, Oda_CRUD, Musteri_CRUD, Rezervasyon_CRUD, SelectMusteri_LIST, SelectOtel_LIST, Sehirler) {
	"use strict";

	return UIComponent.extend("com.havelsan.HOTEL.Component", {

		metadata: {
			manifest: "json"
		},

		init: function() {
			this.oLiveChangeFilter = new LiveChangeFilter();
			this.oOtel_CRUD = new Otel_CRUD();
			this.oOda_CRUD = new Oda_CRUD();
			this.oMusteri_CRUD = new Musteri_CRUD();
			this.oRezervasyon_CRUD = new Rezervasyon_CRUD();
			this.oSelectMusteri_LIST = new SelectMusteri_LIST();
			this.oSelectOtel_LIST = new SelectOtel_LIST();
			this.oSehirler = new Sehirler();

			// call the base component's init function
			UIComponent.prototype.init.apply(this, arguments);

			// initialize the error handler with the component
			this._oErrorHandler = new ErrorHandler(this);

			// set the device model
			this.setModel(models.createDeviceModel(), "device");

			// create the views based on the url/hash
			this.getRouter().initialize();
		},
	

		/**
		 * The component is destroyed by UI5 automatically.
		 * In this method, the ErrorHandler is destroyed.
		 * @public
		 * @override
		 */
		destroy: function() {
			this._oErrorHandler.destroy();
			// call the base component's destroy function
			UIComponent.prototype.destroy.apply(this, arguments);
		},

		/**
		 * This method can be called to determine whether the sapUiSizeCompact or sapUiSizeCozy
		 * design mode class should be set, which influences the size appearance of some controls.
		 * @public
		 * @return {string} css class, either 'sapUiSizeCompact' or 'sapUiSizeCozy' - or an empty string if no css class should be set
		 */
		getContentDensityClass: function() {
			if (this._sContentDensityClass === undefined) {
				// check whether FLP has already set the content density class; do nothing in this case
				if (jQuery(document.body).hasClass("sapUiSizeCozy") || jQuery(document.body).hasClass("sapUiSizeCompact")) {
					this._sContentDensityClass = "";
				} else if (!Device.support.touch) { // apply "compact" mode if touch is not supported
					this._sContentDensityClass = "sapUiSizeCompact";
				} else {
					// "cozy" in case of touch support; default for most sap.m controls, but needed for desktop-first controls like sap.ui.table.Table
					this._sContentDensityClass = "sapUiSizeCozy";
				}
			}
			return this._sContentDensityClass;
		}

	});

});