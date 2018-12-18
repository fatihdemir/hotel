sap.ui.define([
	"com/havelsan/HOTEL/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"com/havelsan/HOTEL/model/formatter",
	"sap/ui/model/Filter",
	"sap/ui/model/Sorter"
], function(BaseController, JSONModel, formatter, Filter, Sorter) {
	"use strict";

	return BaseController.extend("com.havelsan.HOTEL.controller.LiveChangeFilter", {

		formatter: formatter,

		onReset: function(oEvent) {
			this.bGrouped = false;
			this.bDescending = false;
			this.sSearchQuery = 0;
			this.byId(this.searchId).setValue("");
			this.fnApplyFiltersAndOrdering();
		},

		onSort: function(oEvent) {
			this.bDescending = !this.bDescending;
			this.fnApplyFiltersAndOrdering();
		},

		onFilter: function(oEvent, that, tableId, searchId, filterEntry, sorterEntry) {
			this.that = that;
			this.tableId = tableId;
			this.searchId = searchId;
			this.filterEntry = filterEntry;
			this.sorterEntry = sorterEntry;

			this.sSearchQuery = oEvent.getSource().getValue();
			this.fnApplyFiltersAndOrdering();
		},

		fnApplyFiltersAndOrdering: function(oEvent) {
			var aFilters = [],
				aSorters = [];

			if (this.bGrouped) {
				aSorters.push(new Sorter(this.sorterEntry, this.bDescending, this._fnGroup));
			} else {
				aSorters.push(new Sorter(this.sorterEntry, this.bDescending));
			}

			if (this.sSearchQuery) {
				var oFilter = new Filter(this.filterEntry, sap.ui.model.FilterOperator.Contains, this.sSearchQuery);
				aFilters.push(oFilter);
			}
			this.that.byId(this.tableId).getBinding("items").filter(aFilters).sort(aSorters);
		}

	});

});