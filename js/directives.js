(function () {
        var app = angular.module("BookingApp");

        app.directive("barcode", [function() {
            return function(scope, element, attrs) {
                var options = {
                    "barWidth": 1,
                    "barHeight": 30,
                    "fontSize": 12,
                    "output": "css"
                }
                element.barcode(attrs.isbnNumber, "ean13", options);
                scope.$watch(attrs.isbnNumber, function() {
                    element.barcode(attrs.isbnNumber, "ean13", options);        
                })
            }        
        }]);
})();