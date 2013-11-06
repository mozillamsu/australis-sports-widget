var AustralisWidget = require("./xul-manager/australis-widget").AustralisWidget;
var SportsWidget = require("./sports-widget").SportsWidget;

var sportsWidget = new SportsWidget();
var australisWidget = new AustralisWidget(sportsWidget);
