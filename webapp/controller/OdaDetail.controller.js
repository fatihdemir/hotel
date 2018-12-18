/*global location*/
sap.ui.define([
	"com/havelsan/HOTEL/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"com/havelsan/HOTEL/model/formatter"
], function(BaseController, JSONModel, formatter) {
	"use strict";

	return BaseController.extend("com.havelsan.HOTEL.controller.OdaDetail", {

		formatter: formatter,

		onInit: function() {
			var iOriginalBusyDelay,
				oViewModel = new JSONModel({
					busy: true,
					delay: 0
				});
			this.getRouter().getRoute("odaDetail").attachPatternMatched(this._onObjectMatched, this);
			iOriginalBusyDelay = this.getView().getBusyIndicatorDelay();
			this.setModel(oViewModel, "odaDetailView");
			this.getOwnerComponent().getModel().metadataLoaded().then(function() {
				oViewModel.setProperty("/delay", iOriginalBusyDelay);
			});
		},

		_onObjectMatched: function(oEvent) {
			var sObject = oEvent.getParameter("arguments");
			this.getModel().metadataLoaded().then(function() {
				var sObjectPath = this.getModel().createKey("OdaSet", {
					OtelNo: sObject.otelid,
					OdaNo: sObject.odaid
				});
				this._bindView("/" + sObjectPath);
			}.bind(this));
		},

		_bindView: function(sObjectPath) {
			this.OtelNo = sObjectPath.split('\'')[1];
			this.OdaNo = sObjectPath.split('\'')[3];
			var oViewModel = this.getModel("odaDetailView"),
				oDataModel = this.getModel();
			this.getView().bindElement({
				path: sObjectPath,
				parameters: {
					expand: 'Rezervasyonlar'
				},
				events: {
					change: this._onBindingChange.bind(this),
					dataRequested: function() {
						oDataModel.metadataLoaded().then(function() {
							oViewModel.setProperty("/busy", true);
						});
					},
					dataReceived: function() {
						oViewModel.setProperty("/busy", false);
					}
				}
			});
		},

		_onBindingChange: function() {
			var oView = this.getView(),
				oViewModel = this.getModel("odaDetailView"),
				oElementBinding = oView.getElementBinding();

			if (!oElementBinding.getBoundContext()) {
				this.getRouter().getTargets().display("objectNotFound");
				return;
			}

			var oResourceBundle = this.getResourceBundle(),
				oObject = oView.getBindingContext().getObject(),
				sObjectId = oObject.OtelNo,
				sObjectName = oObject.OtelAdi;

			oViewModel.setProperty("/busy", false);
			oViewModel.setProperty("/shareSendEmailSubject",
				oResourceBundle.getText("shareSendEmailObjectSubject", [sObjectId]));
			oViewModel.setProperty("/shareSendEmailMessage",
				oResourceBundle.getText("shareSendEmailObjectMessage", [sObjectName, sObjectId, location.href]));
		},

		rezervasyonCreate: function(oEvent) {
			var oSource = oEvent.getSource();
			this.oView.oController.getOwnerComponent().oRezervasyon_CRUD.create(this.oView, this.oView.oController, oSource);
		},

		rezervasyonUpdate: function(oEvent) {
			var that = this;
			var oView = that.oView;
			var oController = this.oView.oController;
			var oSource = oEvent.getSource();
			oController.getOwnerComponent().oRezervasyon_CRUD.update(oEvent, that, oView, oController, oSource);
		},

		rezervasyonDelete: function(oEvent) {
			var that = this;
			var oView = that.oView;
			var oController = this.oView.oController;
			this.oView.oController.getOwnerComponent().oRezervasyon_CRUD.delete(that, oView, oController);
		}

	});

});