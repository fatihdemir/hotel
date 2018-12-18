sap.ui.define([
	"com/havelsan/HOTEL/controller/BaseController",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"com/havelsan/HOTEL/model/formatter"
], function(BaseController, Filter, FilterOperator, formatter) {
	"use strict";

	return BaseController.extend("com.havelsan.HOTEL.controller.Fragment.Otel_CRUD", {
		formatter: formatter,
		_getDialog: function() {
			if (!this.oCreateDialog) {
				this.oCreateDialog = sap.ui.xmlfragment("com.havelsan.HOTEL.view.Fragment.Dialog_Otel", this);
			}
			return this.oCreateDialog;
		},

		/* ------------------------------------------------------ */
		/* ####################### CREATE ####################### */
		/* ------------------------------------------------------ */
		create: function(oView, oController, oSource, status) {
			var oDialog = this._getDialog();
			this.oView = oView;
			this.oController = oController;
			this.status = status;

			jQuery.sap.syncStyleClass(this.getOwnerComponent().getContentDensityClass(), oView, oDialog);
			oController.getView().addDependent(oDialog);
			oDialog.open();
			sap.ui.getCore().byId("createButton").setVisible(true);
		},
		onPressCreateButton: function(oEvent) {
			var that = this;
			var oteladi = sap.ui.getCore().byId("otelAdi").getValue();
			var oteltelefon = sap.ui.getCore().byId("otelTelefon").getValue();
			var otelurl = sap.ui.getCore().byId("otelUrl").getValue();
			var oteladres = sap.ui.getCore().byId("otelAdres").getValue();
			var otelsehri = sap.ui.getCore().byId("otelSehri").getValue();

			var oEntry = {};
			oEntry.OtelAdi = oteladi;
			oEntry.OtelAdresi = oteladres;
			oEntry.OtelSehri = otelsehri;
			oEntry.OtelUrl = otelurl;
			oEntry.OtelTelefon = oteltelefon;
			
			var serviceUrl = this.oController.getOwnerComponent().getMetadata().getManifestEntry("sap.app").dataSources["mainService"].uri;
			var oModel = new sap.ui.model.odata.v2.ODataModel(serviceUrl);
			var sMessage = this.getView().getModel("i18n").getResourceBundle().getText("successCreatedHotel");
			oModel.create("/MainSet", oEntry, {
				success: function(oData, oResponse) {
					sap.ui.getCore().byId("createOtelDialog").setBusy(false);
					var jsonStr = oResponse.headers["sap-message"];
					if (jsonStr) {
						var messageObj = JSON.parse(jsonStr);
						that.showBoxMessage("succTitle", messageObj.message, "I");
						return;
					}
					that.showBoxMessage("succTitle", sMessage, "S");
					that.getView().getModel().refresh(true);
					that._getDialog().close();
				},
				error: function(oError) {
					var sErrorMessage = JSON.parse(oError.responseText).error.message.value;
					that.showBoxMessage("errTitle", sErrorMessage, "E");
					sap.ui.getCore().byId("createOtelDialog").setBusy(false);
				}
			});

		},

		/* ------------------------------------------------------ */
		/* ####################### UPDATE ####################### */
		/* ------------------------------------------------------ */
		update: function(that, oView, oController, oSource, status) {
			this.UpdateoView = oView;
			this.UpdateoController = oController;
			this.UpdateThat = that;
			var selectedItem = that.getView().byId("tableHotel").getSelectedItem();
			if (selectedItem == null) {
				var sMessage = this.UpdateThat.getView().getModel("i18n").getResourceBundle().getText("noSelectedHotel");
				this.UpdateoController.showBoxMessage("succTitle", sMessage, "W");
				return false;
			} else {
				var oObject = selectedItem.getBindingContext().getObject();
				this.UpdateOtelNo = oObject.OtelNo;
				var OtelAdiText = oObject.OtelAdi;
				var OtelTelefonText = oObject.OtelTelefon;
				var OtelUrlText = oObject.OtelUrl;
				var OtelAdresText = oObject.OtelAdresi;
				var OtelSehriText = oObject.OtelSehri;
			}
			var oDialog = this._getDialog();
			jQuery.sap.syncStyleClass(that.getOwnerComponent().getContentDensityClass(), oView, oDialog);
			oController.getView().addDependent(oDialog);
			oDialog.open();
			sap.ui.getCore().byId("createOtelDialog").setTitle("Otel Bilgilerini Düzenle");

			sap.ui.getCore().byId("otelAdi").setValue(OtelAdiText);
			sap.ui.getCore().byId("otelTelefon").setValue(parseInt(OtelTelefonText));
			sap.ui.getCore().byId("otelUrl").setValue(OtelUrlText);
			sap.ui.getCore().byId("otelAdres").setValue(OtelAdresText);
			sap.ui.getCore().byId("otelSehri").setValue(OtelSehriText);
			sap.ui.getCore().byId("createOtelDialog").setTitle("Otel Bilgilerini Düzenle");
			sap.ui.getCore().byId("updateButton").setVisible(true);
		},
		onPressUpdateButton: function(oEvent) {
			var that = this;
			var oteladi = sap.ui.getCore().byId("otelAdi").getValue();
			var oteltelefon = sap.ui.getCore().byId("otelTelefon").getValue();
			var otelurl = sap.ui.getCore().byId("otelUrl").getValue();
			var oteladres = sap.ui.getCore().byId("otelAdres").getValue();
			var otelsehri = sap.ui.getCore().byId("otelSehri").getValue();

			var oEntry = {};
			oEntry.OtelNo = this.UpdateOtelNo;
			oEntry.OtelAdi = oteladi;
			oEntry.OtelAdresi = oteladres;
			oEntry.OtelSehri = otelsehri;
			oEntry.OtelUrl = otelurl;
			oEntry.OtelTelefon = oteltelefon;
			var serviceUrl = this.UpdateoController.getOwnerComponent().getMetadata().getManifestEntry("sap.app").dataSources["mainService"].uri;
			var oModel = new sap.ui.model.odata.v2.ODataModel(serviceUrl);
			oModel.update("/MainSet('" + this.UpdateOtelNo + "')", oEntry, {
				success: function(oData, oResponse) {
					//sap.ui.getCore().byId("editPrueflosDialog").setBusy(false);
					that.UpdateoController.showBoxMessage("errTitle", "sucsUpdated", "S");
					that.UpdateoController.getView().getModel().refresh(true);
					that.oCreateDialog.destroy();
					that.oCreateDialog = undefined;
					that._getDialog().close();
				},
				error: function(oError) {
					var sErrorMessage = JSON.parse(oError.responseText).error.message.value;
					that.showBoxMessage("errTitle", sErrorMessage, "E");
					//sap.ui.getCore().byId("editPrueflosDialog").setBusy(false);
				}
			});
		},

		/* ------------------------------------------------------ */
		/* ####################### DELETE ####################### */
		/* ------------------------------------------------------ */
		delete: function(oEvent, that, oView, oController, oSource) {
			var selectedItem = that.getView().byId("tableHotel").getSelectedItem();
			if (selectedItem == null) {
				var sMessage = that.getView().getModel("i18n").getResourceBundle().getText("noSelectedHotel");
				oController.showBoxMessage("succTitle", sMessage, "W");
				return false;
			} else {
				var oObject = selectedItem.getBindingContext().getObject();
				this.DeleteOtelNo = oObject.OtelNo;
			}

			var serviceUrl = oController.getOwnerComponent().getMetadata().getManifestEntry("sap.app").dataSources["mainService"].uri;
			var oModel = new sap.ui.model.odata.v2.ODataModel(serviceUrl);
			oModel.remove("/MainSet('" + this.DeleteOtelNo + "')", {
				success: function(data) {
					sap.m.MessageBox.show("Silme işlemi başarılı..");
					oController.getView().getModel().refresh(true);
				},
				error: function(err) {
					var mess = JSON.parse(err.responseText).error.message.value;
					sap.m.MessageBox.error(mess);
				}
			});
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