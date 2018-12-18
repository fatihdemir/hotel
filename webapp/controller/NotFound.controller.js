sap.ui.define([
		"com/havelsan/HOTEL/controller/BaseController"
	], function (BaseController) {
		"use strict";

		return BaseController.extend("com.havelsan.HOTEL.controller.NotFound", {

			/**
			 * Navigates to the worklist when the link is pressed
			 * @public
			 */
			onLinkPressed : function () {
				this.getRouter().navTo("worklist");
			}

		});

	}
);