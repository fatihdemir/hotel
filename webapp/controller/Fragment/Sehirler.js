sap.ui.define([
	"com/havelsan/HOTEL/controller/BaseController"
], function(BaseController) {
	"use strict";

	return BaseController.extend("com.havelsan.HOTEL.controller.Fragment.Sehirler", {

		_getDialog: function() {
			if (!this.oCreatePrueflos) {
				this.oCreatePrueflos = sap.ui.xmlfragment("com.havelsan.HOTEL.view.Fragment.Sehirler", this);
			}
			return this.oCreatePrueflos;
		},
		open: function(oView, oController) {
			var oDialog = this._getDialog();
			this.oView = oView;
			this.oController = oController;

			jQuery.sap.syncStyleClass(this.getOwnerComponent().getContentDensityClass(), oView, oDialog);
			oController.getView().addDependent(oDialog);

			oDialog.open();
		},
		onCloseDialog: function() {
			this._getDialog().close();
		},
		onDialogAfterClose: function() {
			this.oCreatePrueflos.destroy();
			this.oCreatePrueflos = undefined;
		},

		formChange: function(evt) {
			evt.getSource().setValueState(sap.ui.core.ValueState.None);
		},

		_bindDialog: function() {
			var aGlobalData = this.oController.getOwnerComponent().getModel("IsyeriModel").getData();
			sap.ui.getCore().byId("cpIsyeri").setText(aGlobalData);

			var sToday = new Date();
			sap.ui.getCore().byId("cpDatum").setDateValue(sToday);
		},

		_handleBolgeHelpSearch: function(evt) {
			var sValue = evt.getParameter("value");
			sValue = sValue.replace(/i/g, "İ").toUpperCase();
			var oFilter = new sap.ui.model.Filter("city", sap.ui.model.FilterOperator.Contains, sValue);
			evt.getSource().getBinding("items").filter([oFilter]);
		},

		_handleBolgeHelpClose: function(evt) {
			this.inputId = evt.getSource().getId();
			var oSelectedItem = evt.getParameter("selectedItem");
			if (oSelectedItem) {
				var InputId = sap.ui.getCore().byId(this.inputId);
				var title = oSelectedItem.getTitle();
				var viewInput = this.getView().byId("sehir");
				viewInput.setValue(title);
				viewInput.setValueState("None");
			}
		}

	});

});