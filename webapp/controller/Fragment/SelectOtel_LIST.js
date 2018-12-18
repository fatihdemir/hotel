sap.ui.define([
	"com/havelsan/HOTEL/controller/BaseController",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"com/havelsan/HOTEL/model/formatter"
], function(BaseController, Filter, FilterOperator, formatter) {
	"use strict";

	return BaseController.extend("com.havelsan.HOTEL.controller.Fragment.SelectOtel_LIST", {
		formatter: formatter,
		_getDialog: function() {
			if (!this.oCreateDialog) {
				this.oCreateDialog = sap.ui.xmlfragment("com.havelsan.HOTEL.view.Fragment.Dialog_SelectOtel", this);
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
		
		onItemSelect : function(oEvent){
			var oObj = oEvent.oSource.getBindingContext().getObject();
			var otelNo = parseInt(oObj.OtelNo);
			var otelAdi = oObj.OtelAdi;
			sap.ui.getCore().byId("oda_otelNo").setValue(otelNo+' - '+otelAdi);
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
		}
	});

});