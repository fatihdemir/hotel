sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/routing/History",
	"sap/m/MessageToast",
	'sap/m/MessageBox'
], function(Controller, History, MessageToast, MessageBox) {
	"use strict";

	return Controller.extend("com.havelsan.HOTEL.controller.BaseController", {
		/**
		 * Convenience method for accessing the router.
		 * @public
		 * @returns {sap.ui.core.routing.Router} the router for this component
		 */
		getRouter: function() {
			return sap.ui.core.UIComponent.getRouterFor(this);
		},

		/**
		 * Convenience method for getting the view model by name.
		 * @public
		 * @param {string} [sName] the model name
		 * @returns {sap.ui.model.Model} the model instance
		 */
		getModel: function(sName) {
			return this.getView().getModel(sName);
		},

		/**
		 * Convenience method for setting the view model.
		 * @public
		 * @param {sap.ui.model.Model} oModel the model instance
		 * @param {string} sName the model name
		 * @returns {sap.ui.mvc.View} the view instance
		 */
		setModel: function(oModel, sName) {
			return this.getView().setModel(oModel, sName);
		},

		/**
		 * Getter for the resource bundle.
		 * @public
		 * @returns {sap.ui.model.resource.ResourceModel} the resourceModel of the component
		 */
		getResourceBundle: function() {
			return this.getOwnerComponent().getModel("i18n").getResourceBundle();
		},

		onNavBack: function() {
			var sPreviousHash = History.getInstance().getPreviousHash();

			if (sPreviousHash !== undefined) {
				history.go(-1);
			} else {
				this.getRouter().navTo("master", {}, true);
			}
		},
		/**
		 * Event handler when the share by E-Mail button has been clicked
		 * @public
		 */
		onShareEmailPress: function() {
			var oViewModel = (this.getModel("objectView") || this.getModel("worklistView"));
			sap.m.URLHelper.triggerEmail(
				null,
				oViewModel.getProperty("/shareSendEmailSubject"),
				oViewModel.getProperty("/shareSendEmailMessage")
			);
		},

		showBoxMessage: function(pTitle, pMsg, pType) {
			var sMessage = this.getView().getModel("i18n").getResourceBundle().getText(pMsg);
			var sTitle = this.getView().getModel("i18n").getResourceBundle().getText(pTitle);
			var bCompact = this.getOwnerComponent().getContentDensityClass() === "sapUiSizeCompact";
			var oIcon;
			switch (pType) {
				case "S":
					oIcon = sap.m.MessageBox.Icon.SUCCESS;
					break;
				case "I":
					oIcon = sap.m.MessageBox.Icon.INFORMATION;
					break;
				case "E":
					oIcon = sap.m.MessageBox.Icon.ERROR;
					break;
				case "W":
					oIcon = sap.m.MessageBox.Icon.WARNING;
					break;
				default:
					break;
			}
			sap.m.MessageBox.show(sMessage, {
				styleClass: bCompact ? "sapUiSizeCompact" : "",
				icon: oIcon,
				title: sTitle,
				actions: [sap.m.MessageBox.Action.OK]
			});
		}
	});

});