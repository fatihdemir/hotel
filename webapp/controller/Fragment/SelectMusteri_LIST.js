sap.ui.define([
	"com/havelsan/HOTEL/controller/BaseController",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"com/havelsan/HOTEL/model/formatter"
], function(BaseController, Filter, FilterOperator, formatter) {
	"use strict";

	return BaseController.extend("com.havelsan.HOTEL.controller.Fragment.SelectMusteri_LIST", {
		formatter: formatter,
		_getDialog: function() {
			if (!this.oCreateDialog) {
				this.oCreateDialog = sap.ui.xmlfragment("com.havelsan.HOTEL.view.Fragment.Dialog_SelectMusteri", this);
			}
			return this.oCreateDialog;
		},

		open: function(oView, oController, oSource) {
			var oDialog = this._getDialog();
			this.oView = oView;
			this.oController = oController;

			jQuery.sap.syncStyleClass(this.getOwnerComponent().getContentDensityClass(), oView, oDialog);
			oController.getView().addDependent(oDialog);
			oDialog.open();
		},

		onItemSelect: function(oEvent) {
			var oObj = oEvent.oSource.getBindingContext().getObject();
			var otelNo = parseInt(oObj.OtelNo);
			var otelAdi = oObj.OtelAdi;
			sap.ui.getCore().byId("oda_otelNo").setValue(otelNo + ' - ' + otelAdi);
			this.onCloseDialog();
		},

		onCloseDialog: function() {
			this._getDialog().close();
			this.oCreateDialog.destroy();
			this.oCreateDialog = undefined;
		},
		onDialogAfterClose: function() {
			this.oCreateDialog.destroy();
			this.oCreateDialog = undefined;
		},

		formChange: function(evt) {
			evt.getSource().setValueState(sap.ui.core.ValueState.None);
		},

		handleMusteriHelp: function(oEvent) {
			var sInputValue = oEvent.getSource().getValue();
			this.inputId = oEvent.getSource().getId();
			if (!this._MusteriHelpDialog) {
				this._MusteriHelpDialog = sap.ui.xmlfragment(
					"com/havelsan/HOTEL.view.fragment.Dialog_SelectMusteri",
					this
				);
				this.getView().addDependent(this._MusteriHelpDialog);
			}
			this._MusteriHelpDialog.open(sInputValue);
		},

		_handleMusteriHelpSearch: function(evt) {
			var sValue = evt.getParameter("value");
			var Dialog = sap.ui.getCore().byId("searchField");
			var items = Dialog.getBinding("items");
			var oFilter = new Filter("MusteriAdi", sap.ui.model.FilterOperator.Contains, sValue);
			var oBinding = evt.getSource().getBinding("items");
			items.filter(oFilter);
		},

		_handleMusteriHelpClose: function(evt) {
			this.inputId = evt.getSource().getId();
			var oSelectedItem = evt.getParameter("selectedItem");
			if (oSelectedItem) {
				var InputId = sap.ui.getCore().byId(this.inputId);
				var title = oSelectedItem.getTitle();
				var subInputId = sap.ui.getCore().byId("musteriList");
				subInputId.setValue(title);
				subInputId.setValueState("None");
			}
		}

	});

});