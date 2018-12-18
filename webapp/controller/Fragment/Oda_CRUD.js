sap.ui.define([
	"com/havelsan/HOTEL/controller/BaseController",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"com/havelsan/HOTEL/model/formatter"
], function(BaseController, Filter, FilterOperator, formatter) {
	"use strict";

	return BaseController.extend("com.havelsan.HOTEL.controller.Fragment.Oda_CRUD", {
		formatter: formatter,
		_getDialog: function() {
			if (!this.oCreateDialog) {
				this.oCreateDialog = sap.ui.xmlfragment("com.havelsan.HOTEL.view.Fragment.Dialog_Oda", this);
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
			sap.ui.getCore().byId("odaCreateButton").setVisible(true);
		},
		onPressCreateButton: function(oEvent) {
			var that = this;
			var otelno = this.OtelNo;
			var odano = sap.ui.getCore().byId("odaNo").getValue();
			var odakat = sap.ui.getCore().byId("odaKat").getValue();
			var odasigara = sap.ui.getCore().byId("odaSigara").getSelectedIndex();

			if (sap.ui.getCore().byId("evet").getSelected()) {
				odasigara = "X";
			} else {
				odasigara = "-";
			}
			var odatipi = sap.ui.getCore().byId("odaTipi").getSelectedKey();

			var oEntry = {};
			oEntry.OtelNo = parseInt(otelno).toString();
			oEntry.OdaNo = odano;
			oEntry.OdaKat = parseInt(odakat).toString();
			oEntry.SigaraIcilir = odasigara;
			oEntry.OdaTipi = odatipi;

			if ( 0 >= odano || odano == "0") {
				that.showBoxMessage("errTitle", "Oda Numarası 0 olamaz !", "E");
				return false;
			}

			var serviceUrl = this.oController.getOwnerComponent().getMetadata().getManifestEntry("sap.app").dataSources["mainService"].uri;
			var oModel = new sap.ui.model.odata.v2.ODataModel(serviceUrl);
			var sMessage = this.getView().getModel("i18n").getResourceBundle().getText("successCreatedOda");
			var sPath = "/OdaSet(OtelNo='" + oEntry.OtelNo + "',OdaNo='" + odano + "')";
			oModel.create("/OdaSet", oEntry, {
				success: function(oData, oResponse) {
					sap.ui.getCore().byId("createOdaDialog").setBusy(false);
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
					sap.ui.getCore().byId("createOdaDialog").setBusy(false);
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
			var selectedItem = that.getView().byId("oda_table").getSelectedItem();
			if (selectedItem == null) {
				var sMessage = this.UpdateThat.getView().getModel("i18n").getResourceBundle().getText("noSelectedHotel");
				this.UpdateoController.showBoxMessage("succTitle", sMessage, "W");
				return false;
			} else {
				var oObject = selectedItem.getBindingContext().getObject();
				this.UpdateOtelNo = oObject.OtelNo;
				var OdaNoText = oObject.OdaNo;
				var OdaKatText = oObject.OdaKat;
				var SigaraIcilirText = oObject.SigaraIcilir;
				if (SigaraIcilirText == 'X') {
					SigaraIcilirText = 0;
				} else {
					SigaraIcilirText = 1;
				}
				var OdaTipiText = oObject.OdaTipi;
			}
			var oDialog = this._getDialog();
			jQuery.sap.syncStyleClass(that.getOwnerComponent().getContentDensityClass(), oView, oDialog);
			oController.getView().addDependent(oDialog);
			oDialog.open();
			sap.ui.getCore().byId("createOdaDialog").setTitle("Oda Bilgilerini Düzenle");
			sap.ui.getCore().byId("odaNo").setProperty("editable", false);

			sap.ui.getCore().byId("odaNo").setValue(OdaNoText);
			sap.ui.getCore().byId("odaKat").setValue(parseInt(OdaKatText));
			sap.ui.getCore().byId("odaSigara").setSelectedIndex(SigaraIcilirText);
			sap.ui.getCore().byId("odaTipi").setSelectedKey(OdaTipiText);
			sap.ui.getCore().byId("odaUpdateButton").setVisible(true);

		},
		onPressUpdateButton: function(oEvent) {
			var that = this;
			var thats = this.oController;
			var OdaNo = sap.ui.getCore().byId("odaNo").getValue();
			var OdaKat = sap.ui.getCore().byId("odaKat").getValue();
			var SigaraIcilir = sap.ui.getCore().byId("odaSigara").getSelectedIndex();
			var OdaTipi = sap.ui.getCore().byId("odaTipi").getSelectedKey();

			if (0 >= OdaNo || OdaNo == "0") {
				that.UpdateoController.showBoxMessage("errTitle", "Oda Numarası 0 olamaz !", "E");
				return false;
			}

			var oEntry = {};
			oEntry.OdaNo = OdaNo;
			oEntry.OdaKat = OdaKat;
			oEntry.SigaraIcilir = SigaraIcilir;
			if (oEntry.SigaraIcilir == 0) {
				oEntry.SigaraIcilir = 'X';
			} else {
				oEntry.SigaraIcilir = '-';
			}
			oEntry.OdaTipi = OdaTipi;
			var serviceUrl = this.UpdateoController.getOwnerComponent().getMetadata().getManifestEntry("sap.app").dataSources["mainService"].uri;
			var oModel = new sap.ui.model.odata.v2.ODataModel(serviceUrl);
			var sPath = "/OdaSet(OtelNo='" + this.UpdateOtelNo + "',OdaNo='" + OdaNo + "')";
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
			var OtelNo = that.OtelNo;
			var selectedItem = that.getView().byId("oda_table").getSelectedItem();
			if (selectedItem == null) {
				var sMessage = that.getView().getModel("i18n").getResourceBundle().getText("noSelectedHotel");
				oController.showBoxMessage("succTitle", sMessage, "W");
				return false;
			} else {
				var oObject = selectedItem.getBindingContext().getObject();
				var OdaNo = oObject.OdaNo;
			}

			var serviceUrl = that.getOwnerComponent().getMetadata().getManifestEntry("sap.app").dataSources["mainService"].uri;
			var oModel = new sap.ui.model.odata.v2.ODataModel(serviceUrl);
			var sPath = "/OdaSet(OtelNo='" + OtelNo + "',OdaNo='" + OdaNo + "')";
			oModel.remove(sPath, {
				success: function(data) {
					sap.m.MessageBox.show("Silme işlemi başarılı..");
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
		openSelectedOtel: function(oEvent) {
			var oSource = oEvent.getSource();
			this.oController.getOwnerComponent().oSelectOtel_LIST.open(this.oView, this.oController, oSource);
		}
	});

});