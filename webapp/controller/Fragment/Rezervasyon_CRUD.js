sap.ui.define([
	"com/havelsan/HOTEL/controller/BaseController",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"com/havelsan/HOTEL/model/formatter"
], function(BaseController, Filter, FilterOperator, formatter) {
	"use strict";

	return BaseController.extend("com.havelsan.HOTEL.controller.Fragment.Rezervasyon_CRUD", {
		formatter: formatter,
		_getDialog: function() {
			if (!this.oCreateDialog) {
				this.oCreateDialog = sap.ui.xmlfragment("com.havelsan.HOTEL.view.Fragment.Dialog_Rezervasyon", this);
			}
			return this.oCreateDialog;
		},

		/* ------------------------------------------------------ */
		/* ####################### CREATE ####################### */
		/* ------------------------------------------------------ */
		create: function(oView, oController, oSource, status, OtelNo) {
			var oDialog = this._getDialog();
			this.oView = oView;
			this.oController = oController;
			this.status = status;
			this.OtelNo = oView.oController.OtelNo;

			jQuery.sap.syncStyleClass(this.getOwnerComponent().getContentDensityClass(), oView, oDialog);
			oController.getView().addDependent(oDialog);
			oDialog.open();
			sap.ui.getCore().byId("rezervasyonCreateButton").setVisible(true);
		},
		onPressCreateButton: function(oEvent) {
			var that = this;
			var otelno = this.oController.OtelNo;
			var odano = this.oController.OdaNo;
			var rezervasyonno = sap.ui.getCore().byId("rezervasyonNo").getValue();
			var musteri = sap.ui.getCore().byId("musteriList").getValue();
			musteri = musteri.split(" - ")[0];
			var rezervasyonbaslangic = sap.ui.getCore().byId("rezervasyon_start_date").getDateValue();
			var rezervasyonbitis = sap.ui.getCore().byId("rezervasyon_end_date").getDateValue();

			var startDate = formatter.saveFormatDateValue(rezervasyonbaslangic);
			var endDate = formatter.saveFormatDateValue(rezervasyonbitis);

			var oEntry = {};
			oEntry.OtelNo = parseInt(otelno).toString();
			oEntry.OdaNo = odano;
			oEntry.RezervNo = rezervasyonno;
			oEntry.MusteriNo = parseInt(musteri).toString();
			oEntry.Baslangic = startDate;
			oEntry.Bitis = endDate;

			if (0 >= oEntry.RezervNo || oEntry.RezervNo == "0") {
				that.showBoxMessage("errTitle", "Rezervasyon Numarası 0 olamaz !", "E");
				return false;
			}

			var serviceUrl = this.oController.getOwnerComponent().getMetadata().getManifestEntry("sap.app").dataSources["mainService"].uri;
			var oModel = new sap.ui.model.odata.v2.ODataModel(serviceUrl);
			var sMessage = this.getView().getModel("i18n").getResourceBundle().getText("successCreatedOda");
			//var sPath = "/RezervasyonSet(OtelNo='" + oEntry.OtelNo + "',OdaNo='" + odano + "', RezervNo='" + rezervasyonno + "')";
			oModel.create("/RezervasyonSet", oEntry, {
				success: function(oData, oResponse) {
					sap.ui.getCore().byId("createRezervasyonDialog").setBusy(false);
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
					sap.ui.getCore().byId("createRezervasyonDialog").setBusy(false);
				}
			});

		},

		/* ------------------------------------------------------ */
		/* ####################### UPDATE ####################### */
		/* ------------------------------------------------------ */
		update: function(oEvent, that, oView, oController) {
			this.UpdateoView = oView;
			this.UpdateoController = oController;
			this.UpdateThat = that;
			var selectedItem = that.getView().byId("rezervasyon_table").getSelectedItem();
			if (selectedItem == null) {
				var sMessage = this.UpdateThat.getView().getModel("i18n").getResourceBundle().getText("noSelectedRezervasyon");
				this.UpdateoController.showBoxMessage("succTitle", sMessage, "W");
				return false;
			} else {
				var oObject = selectedItem.getBindingContext().getObject();
				this.UpdateOtelNo = oObject.OtelNo;
				this.UpdateOdaNo = oObject.OdaNo;
				var MusteriNoText = oObject.MusteriNo;
				var RezervNoText = oObject.RezervNo;
				var BaslangicText = oObject.Baslangic;
				var BitisText = oObject.Bitis;
			}
			var oDialog = this._getDialog();
			jQuery.sap.syncStyleClass(that.getOwnerComponent().getContentDensityClass(), oView, oDialog);
			oController.getView().addDependent(oDialog);
			oDialog.open();
			sap.ui.getCore().byId("createRezervasyonDialog").setTitle("Rezervasyon Bilgilerini Düzenle");

			sap.ui.getCore().byId("rezervasyonNo").setValue(RezervNoText);
			sap.ui.getCore().byId("musteriList").setValue(parseInt(MusteriNoText));
			sap.ui.getCore().byId("rezervasyon_start_date").setValue(formatter.formatDateValue(BaslangicText));
			sap.ui.getCore().byId("rezervasyon_end_date").setValue(formatter.formatDateValue(BitisText));
			sap.ui.getCore().byId("rezervasyonUpdateButton").setVisible(true);
			sap.ui.getCore().byId("rezervasyonNo").setProperty("editable", false);
		},
		onPressUpdateButton: function(oEvent) {
			var that = this;
			var thats = this.oController;
			var RezervasyonNo = sap.ui.getCore().byId("rezervasyonNo").getValue();
			var MusteriNo = sap.ui.getCore().byId("musteriList").getValue();
			var Baslangic = sap.ui.getCore().byId("rezervasyon_start_date").getValue();
			var Bitis = sap.ui.getCore().byId("rezervasyon_end_date").getValue();
			

			if (0 >= RezervasyonNo || RezervasyonNo == "0") {
				that.UpdateoController.showBoxMessage("errTitle", "Rezervasyon Numarası 0 olamaz !", "E");
				return false;
			}
			// Tarih'i Database kaydederken uygun formata getiriyoruz.
			var BaslangicSplit = Baslangic.split(".");
			var Baslangic = BaslangicSplit[2] + "." + BaslangicSplit[1] + "." + BaslangicSplit[0];
			var BitisSplit = Bitis.split(".");
			var Bitis = BitisSplit[2] + "." + BitisSplit[1] + "." + BitisSplit[0];
			var Update_startDate = formatter.saveFormatDateValue(Baslangic);
			var Update_endDate = formatter.saveFormatDateValue(Bitis);

			var oEntry = {};
			oEntry.RezervNo = RezervasyonNo;
			oEntry.MusteriNo = parseInt(MusteriNo).toString();
			oEntry.Baslangic = Update_startDate;
			oEntry.Bitis = Update_endDate;

			var serviceUrl = this.UpdateoController.getOwnerComponent().getMetadata().getManifestEntry("sap.app").dataSources["mainService"].uri;
			var oModel = new sap.ui.model.odata.v2.ODataModel(serviceUrl);
			var sPath = "/RezervasyonSet(OtelNo='" + this.UpdateOtelNo + "',OdaNo='" + this.UpdateOdaNo + "',RezervNo='" + RezervasyonNo + "')";
			//	oModel.setUseBatch(false);
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
					that.UpdateoController.showBoxMessage("errTitle", sErrorMessage, "E");
					//sap.ui.getCore().byId("editPrueflosDialog").setBusy(false);
				}
			});
		},

		/* ------------------------------------------------------ */
		/* ####################### DELETE ####################### */
		/* ------------------------------------------------------ */
		delete: function(that, oController, oSource) {
			var selectedItem = that.getView().byId("rezervasyon_table").getSelectedItem();
			if (selectedItem == null) {
				var sMessage = that.getView().getModel("i18n").getResourceBundle().getText("noSelectedRezervasyon");
				oController.showBoxMessage("succTitle", sMessage, "W");
				return false;
			} else {
				var oObject = selectedItem.getBindingContext().getObject();
				var OtelNo = oObject.OtelNo.toString();
				var OdaNo = oObject.OdaNo.toString();
				var RezervasyonNo = oObject.RezervNo.toString();
			}

			var serviceUrl = that.getOwnerComponent().getMetadata().getManifestEntry("sap.app").dataSources["mainService"].uri;
			var oModel = new sap.ui.model.odata.v2.ODataModel(serviceUrl);
			var sPath = "/RezervasyonSet(OtelNo='" + OtelNo + "',OdaNo='" + OdaNo + "',RezervNo='" + RezervasyonNo + "')";
			oModel.remove(sPath, {
				success: function(data) {
					that.oView.oController.showBoxMessage("successMsg", "successDelete", "S");
					that.getView().getModel().refresh(true);
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

		musteriDialogOpen: function(oEvent) {
			var oSource = oEvent.getSource();
			this.oController.getOwnerComponent().oSelectMusteri_LIST.open(this.oView, this.oController, oSource);
		}
	});

});