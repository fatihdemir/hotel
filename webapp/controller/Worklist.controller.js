sap.ui.define([
	"com/havelsan/HOTEL/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"com/havelsan/HOTEL/model/formatter",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/model/Sorter"
], function(BaseController, JSONModel, formatter, Filter, FilterOperator, Sorter) {
	"use strict";

	return BaseController.extend("com.havelsan.HOTEL.controller.Worklist", {

		formatter: formatter,

		onInit: function() {
			var oViewModel,
				iOriginalBusyDelay,
				oTable = this.byId("tableHotel");

			iOriginalBusyDelay = oTable.getBusyIndicatorDelay();
			this._aTableSearchState = [];

			oViewModel = new JSONModel({
				worklistTableTitle: this.getResourceBundle().getText("worklistTableTitle"),
				shareOnJamTitle: this.getResourceBundle().getText("worklistTitle"),
				shareSendEmailSubject: this.getResourceBundle().getText("shareSendEmailWorklistSubject"),
				shareSendEmailMessage: this.getResourceBundle().getText("shareSendEmailWorklistMessage", [location.href]),
				tableNoDataText: this.getResourceBundle().getText("tableNoDataText"),
				tableBusyDelay: 0
			});
			this.setModel(oViewModel, "worklistView");
			oTable.attachEventOnce("updateFinished", function() {
				oViewModel.setProperty("/tableBusyDelay", iOriginalBusyDelay);
			});
		},
		onUpdateFinished: function(oEvent) {
			var sTitle,
				oTable = oEvent.getSource(),
				iTotalItems = oEvent.getParameter("total");
			if (iTotalItems && oTable.getBinding("items").isLengthFinal()) {
				sTitle = this.getResourceBundle().getText("worklistTableTitleCount", [iTotalItems]);
			} else {
				sTitle = this.getResourceBundle().getText("worklistTableTitle");
			}
			this.getModel("worklistView").setProperty("/worklistTableTitle", sTitle);
		},

		onPress: function(oEvent) {
			this._showObject(oEvent.getSource());
		},

		onRefresh: function() {
			var oTable = this.byId("tableHotel");
			oTable.getBinding("items").refresh();
		},

		_showObject: function(oItem) {
			this.getRouter().navTo("object", {
				objectId: oItem.getBindingContext().getProperty("OtelNo")
			});
		},

		sehirlerDialogOpen: function(oEvent) {
			var oSource = oEvent.getSource();
			this.getOwnerComponent().oSehirler.open(this.getView(), this, oSource);
		},

		otelCreate: function(oEvent) {
			var oSource = oEvent.getSource();
			this.oView.oController.getOwnerComponent().oOtel_CRUD.create(this.oView, this.oView.oController, oSource);
		},
		otelUpdate: function(oEvent) {
			var that = this;
			var oView = that.oView;
			var oController = this.oView.oController;
			var oSource = oEvent.getSource();
			oController.getOwnerComponent().oOtel_CRUD.update(that, oView, oController, oSource);
		},
		otelDelete: function(oEvent) {
			var that = this;
			var oView = that.oView;
			var oController = this.oView.oController;
			var oSource = oEvent.getSource();
			this.oView.oController.getOwnerComponent().oOtel_CRUD.delete(oEvent, that, oView, oController, oSource);
		},
		otel_onFilter: function(oEvent) {
			var that = this;
			var tableId = "tableHotel";
			var searchId = "otel_searchSorting";
			var filterEntry = "OtelAdi";
			var sorterEntry = "OtelAdi";
			this.oView.oController.getOwnerComponent().oLiveChangeFilter.onFilter(oEvent, that, tableId, searchId, filterEntry, sorterEntry);
		}
		
		

	});
});