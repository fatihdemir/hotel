sap.ui.define([], function() {
	"use strict";

	return {

		/**
		 * Rounds the number unit value to 2 digits
		 * @public
		 * @param {string} sValue the number string to be rounded
		 * @returns {string} sValue with 2 digits rounded
		 */
		numberUnit: function(sValue) {
			if (!sValue) {
				return "";
			}
			return parseFloat(sValue).toFixed(2);
		},
		zeroClear: function(num) {
			var editNum = parseInt(num);
			return editNum;
		},

		smallCaps: function(texts) {
			var small = texts.toLowerCase();
			return small;
		},

		SmokeStatus: function(evt) {
			if (evt == "X") {
				return "Evet";
			} else {
				return "Hayır";
			}
		},

		formatDateValue: function(pDate) {
			var oDateFormat = sap.ui.core.format.DateFormat
				.getDateTimeInstance({
					pattern: "dd.MM.yyyy" /*  - hh:mm */
				});
			pDate = oDateFormat.format(new Date(pDate));
			return pDate;
		},

		saveFormatDateValue: function(pDate) {
			var oDateFormat = sap.ui.core.format.DateFormat
				.getDateTimeInstance({
					pattern: "yyyy-MM-ddThh:mm:ss"
				});
			pDate = oDateFormat.format(new Date(pDate));
			return pDate;
		},

		OdaType: function(evt) {
			var oBundle = this.getView().getModel("i18n").getResourceBundle();
			switch (evt) {
				case "A":
					return oBundle.getText("oda_type_A");
					break;
				case "B":
					return oBundle.getText("oda_type_B");
					break;
				case "C":
					return oBundle.getText("oda_type_C");
					break;
				case "D":
					return oBundle.getText("oda_type_D");
					break;
				case "E":
					return oBundle.getText("oda_type_E");
					break;
				case "F":
					return oBundle.getText("oda_type_F");
					break;
				default:
					return "Hatalı Değer";

			}
		}

	};

});