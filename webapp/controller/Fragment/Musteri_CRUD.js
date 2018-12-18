sap.ui.define([
	"com/havelsan/HOTEL/controller/BaseController",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"com/havelsan/HOTEL/model/formatter"
], function(BaseController, Filter, FilterOperator, formatter) {
	"use strict";

	return BaseController.extend("com.havelsan.HOTEL.controller.Fragment.Musteri_CRUD", {
		formatter: formatter,
		_getDialog: function() {
			if (!this.oCreateDialog) {
				this.oCreateDialog = sap.ui.xmlfragment("com.havelsan.HOTEL.view.Fragment.Dialog_Musteri", this);
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
			sap.ui.getCore().byId("musteriCreateButton").setVisible(true);
		},
		onPressCreateButton: function(oEvent) {
			var that = this;
			var MusteriNo = sap.ui.getCore().byId("musteriNo").getValue();
			var MusteriAdi = sap.ui.getCore().byId("musteriAdi").getValue();
			var MusteriSoyadi = sap.ui.getCore().byId("musteriSoyadi").getValue();
			var MusteriAdres = sap.ui.getCore().byId("musteriAdres").getValue();
			var MusteriTelefon = sap.ui.getCore().byId("musteriTelefon").getValue();
			var MusteriEmail = sap.ui.getCore().byId("musteriEmail").getValue();

			var oEntry = {};
			oEntry.MusteriNo = MusteriNo;
			oEntry.MusteriAdi = MusteriAdi;
			oEntry.MusteriSoyadi = MusteriSoyadi;
			oEntry.MusteriAdres = MusteriAdres;
			oEntry.MusteriTelefon = MusteriTelefon;
			oEntry.MusteriEmail = MusteriEmail;

			var serviceUrl = this.oController.getOwnerComponent().getMetadata().getManifestEntry("sap.app").dataSources["mainService"].uri;
			var oModel = new sap.ui.model.odata.v2.ODataModel(serviceUrl);
			var sMessage = this.getView().getModel("i18n").getResourceBundle().getText("successCreatedOda");
			oModel.create("/MusteriSet", oEntry, {
				success: function(oData, oResponse) {
					sap.ui.getCore().byId("createMusteriDialog").setBusy(false);
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
					sap.ui.getCore().byId("createMusteriDialog").setBusy(false);
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
			var selectedItem = this.UpdateoView.byId("musteri_table").getSelectedItem();
			if (selectedItem == null) {
				var sMessage = this.UpdateThat.getView().getModel("i18n").getResourceBundle().getText("noSelectedMusteri");
				this.UpdateoController.showBoxMessage("succTitle", sMessage, "W");
				return false;
			} else {
				var oObject = selectedItem.getBindingContext().getObject();
				this.UpdateMusteriNo	= oObject.MusteriNo;
				var MusteriAdiText		= oObject.MusteriAdi;
				var MusteriSoyadiText	= oObject.MusteriSoyadi;
				var MusteriTelefonText	= oObject.MusteriTelefon;
				var MusteriEmailText	= oObject.MusteriEmail;
				var MusteriAdresText	= oObject.MusteriAdres;

			}
			var oDialog = this._getDialog();
			jQuery.sap.syncStyleClass(this.UpdateoView.getOwnerComponent().getContentDensityClass(), oView, oDialog);
			oController.getView().addDependent(oDialog);
			oDialog.open();
			sap.ui.getCore().byId("createMusteriDialog").setTitle("Müşteri Bilgilerini Düzenle");

			sap.ui.getCore().byId("musteriNo").setValue(this.UpdateMusteriNo);
			sap.ui.getCore().byId("musteriAdi").setValue(MusteriAdiText);
			sap.ui.getCore().byId("musteriSoyadi").setValue(MusteriSoyadiText);
			sap.ui.getCore().byId("musteriAdres").setValue(MusteriAdresText);
			sap.ui.getCore().byId("musteriTelefon").setValue(MusteriTelefonText);
			sap.ui.getCore().byId("musteriEmail").setValue(MusteriEmailText);
			sap.ui.getCore().byId("createMusteriDialog").setTitle("Müşteri Bilgilerini Düzenle");
			sap.ui.getCore().byId("updateButton").setVisible(true);
		},
		onPressUpdateButton: function(oEvent) {
			var that = this;
			var MusteriAdi = sap.ui.getCore().byId("musteriAdi").getValue();
			var MusteriSoyadi = sap.ui.getCore().byId("musteriSoyadi").getValue();
			var MusteriAdres = sap.ui.getCore().byId("musteriAdres").getValue();
			var MusteriTelefon = sap.ui.getCore().byId("musteriTelefon").getValue();
			var MusteriEmail = sap.ui.getCore().byId("musteriEmail").getValue();

			var oEntry = {};
			oEntry.MusteriNo = this.UpdateMusteriNo;
			oEntry.MusteriAdi = MusteriAdi;
			oEntry.MusteriSoyadi = MusteriSoyadi;
			oEntry.MusteriAdres = MusteriAdres;
			oEntry.MusteriTelefon = MusteriTelefon;
			oEntry.MusteriEmail = MusteriEmail;
			var serviceUrl = this.UpdateoController.getOwnerComponent().getMetadata().getManifestEntry("sap.app").dataSources["mainService"].uri;
			var oModel = new sap.ui.model.odata.v2.ODataModel(serviceUrl);
			var sPath = "/MusteriSet(MusteriNo='" + oEntry.MusteriNo + "', OdaNo='" + oEntry.OdaNo + "')";
			oModel.update(sPath, oEntry, {
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
		delete: function(that, oController) {
			var selectedItem = that.getView().byId("musteri_table").getSelectedItem();
			var oObject = selectedItem.getBindingContext().getObject();
			this.DeleteMusteriNo = oObject.MusteriNo;

			var serviceUrl = oController.getOwnerComponent().getMetadata().getManifestEntry("sap.app").dataSources["mainService"].uri;
			var oModel = new sap.ui.model.odata.v2.ODataModel(serviceUrl);
			var sPath = "/MusteriSet(MusteriNo='" + oObject.MusteriNo + "',OdaNo='" + oObject.OdaNo + "')";
			oModel.remove(sPath, {
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
		},
		openSelectedMusteri: function(oEvent) {
			var oSource = oEvent.getSource();
			this.oController.getOwnerComponent().oSelectMusteri_LIST.open(this.oView, this.oController, oSource);
		}
	});

});