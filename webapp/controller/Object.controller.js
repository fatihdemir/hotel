/*global location*/
sap.ui.define([
	"com/havelsan/HOTEL/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/routing/History",
	"com/havelsan/HOTEL/model/formatter",
	"sap/ui/model/Filter",
	"sap/ui/model/Sorter"
], function(BaseController, JSONModel, History, formatter, Filter, Sorter) {
	"use strict";

	return BaseController.extend("com.havelsan.HOTEL.controller.Object", {

		formatter: formatter,

		onInit: function() {
			var iOriginalBusyDelay,
				oViewModel = new JSONModel({
					busy: true,
					delay: 0
				});
			this.getRouter().getRoute("object").attachPatternMatched(this._onObjectMatched, this);
			iOriginalBusyDelay = this.getView().getBusyIndicatorDelay();
			this.setModel(oViewModel, "objectView");
			this.getOwnerComponent().getModel().metadataLoaded().then(function() {
				oViewModel.setProperty("/delay", iOriginalBusyDelay);
			});
		},

		_onObjectMatched: function(oEvent) {
			var sObjectId = oEvent.getParameter("arguments").objectId;
			this.getModel().metadataLoaded().then(function() {
				var sObjectPath = this.getModel().createKey("MainSet", {
					OtelNo: sObjectId
				});
				this._bindView("/" + sObjectPath);
			}.bind(this));
		},

		_bindView: function(sObjectPath) {
			this.OtelNo = sObjectPath;
			this.OtelNo = this.OtelNo.split('\'')[1];
			var oViewModel = this.getModel("objectView"),
				oDataModel = this.getModel();

			this.getView().bindElement({
				path: sObjectPath,
				parameters: {
					expand: 'Odalar'
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
				oViewModel = this.getModel("objectView"),
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
				oResourceBundle.getText("shareSendEmailObjectSubject", [sObjectId, sObjectName]));
		},

		onPress: function(oEvent) {
			this._showObject(oEvent.getSource());
		},

		_showObject: function(oItem) {
			this.getRouter().navTo("odaDetail", {
				otelid: oItem.getBindingContext().getProperty("OtelNo"),
				odaid: oItem.getBindingContext().getProperty("OdaNo")
			});
		},

		odaCreate: function(oEvent) {
			var oSource = oEvent.getSource();
			this.oView.oController.getOwnerComponent().oOda_CRUD.create(this.oView, this.oView.oController, oSource);
		},

		odaUpdate: function(oEvent) {
			var that = this;
			var oView = that.oView;
			var oController = this.oView.oController;
			var oSource = oEvent.getSource();
			oController.getOwnerComponent().oOda_CRUD.update(oEvent, that, oView, oController, oSource);
		},

		odaDelete: function(oEvent) {
			var that = this;
			var oView = that.oView;
			var oController = this.oView.oController;
			this.oView.oController.getOwnerComponent().oOda_CRUD.delete(that, oView, oController);
		},

		musteriCreate: function(oEvent) {
			var oSource = oEvent.getSource();
			this.oView.oController.getOwnerComponent().oMusteri_CRUD.create(this.oView, this.oView.oController, oSource);
		},

		musteriUpdate: function(oEvent) {
			var that = this;
			var oView = that.oView;
			var oController = this.oView.oController;
			var oSource = oEvent.getSource();
			oController.getOwnerComponent().oMusteri_CRUD.update(oEvent, that, oView, oController, oSource);
		},

		musteriDelete: function(oEvent) {
			var that = this;
			var oView = that.oView;
			var oController = this.oView.oController;
			this.oView.oController.getOwnerComponent().oMusteri_CRUD.delete(that, oView, oController);
		},

		oda_onFilter: function(oEvent) {
			var that = this;
			var tableId = "oda_table";
			var searchId = "oda_searchSorting";
			var filterEntry = "OdaNo";
			var sorterEntry = "OdaNo";
			this.oView.oController.getOwnerComponent().oLiveChangeFilter.onFilter(oEvent, that, tableId, searchId, filterEntry, sorterEntry);
		}

	});

});