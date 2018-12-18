/*global QUnit*/

jQuery.sap.require("sap.ui.qunit.qunit-css");
jQuery.sap.require("sap.ui.thirdparty.qunit");
jQuery.sap.require("sap.ui.qunit.qunit-junit");
QUnit.config.autostart = false;

sap.ui.require([
	"sap/ui/test/Opa5",
	"com/havelsan/HOTEL/test/integration/pages/Common",
	"sap/ui/test/opaQunit",
	"com/havelsan/HOTEL/test/integration/pages/Worklist",
	"com/havelsan/HOTEL/test/integration/pages/Object",
	"com/havelsan/HOTEL/test/integration/pages/NotFound",
	"com/havelsan/HOTEL/test/integration/pages/Browser",
	"com/havelsan/HOTEL/test/integration/pages/App"
], function (Opa5, Common) {
	"use strict";
	Opa5.extendConfig({
		arrangements: new Common(),
		viewNamespace: "com.havelsan.HOTEL.view."
	});

	sap.ui.require([
		"com/havelsan/HOTEL/test/integration/WorklistJourney",
		"com/havelsan/HOTEL/test/integration/ObjectJourney",
		"com/havelsan/HOTEL/test/integration/NavigationJourney",
		"com/havelsan/HOTEL/test/integration/NotFoundJourney"
	], function () {
		QUnit.start();
	});
});