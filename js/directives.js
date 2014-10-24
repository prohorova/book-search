(function () {
    var app = angular.module("BookingApp");

    app.directive("dirBarcode", function () {
        return function (scope, element, attrs) {
            var options = {
                "barWidth": 1,
                "barHeight": 30,
                "fontSize": 12,
                "output": "css"
            }
            element.barcode(attrs.isbnNumber, "ean13", options);
            scope.$watch(attrs.isbnNumber, function () {
                element.barcode(attrs.isbnNumber, "ean13", options);
            })
        }
    });

    app.directive("dirPrint", ["$rootScope", "$timeout",
        function ($rootScope, $timeout) {
            var printSection = document.getElementById('printSection');
            // if there is no printing section, create one
            if (!printSection) {
                printSection = document.createElement('div');
                printSection.height = "120px";
                printSection.width = "216px";
                printSection.id = 'printSection';
                document.body.appendChild(printSection);
            };

            function print(elementId) {
                var elemToPrint = document.getElementById(elementId);
                if (elemToPrint) {
                    printElement(elemToPrint);
                }
            };

            function link(scope, element, attrs) {
                function printLabel() {
                    if (attrs.printOnStart === "true") {
                        print(attrs.printElementId);
                    }
                    element.on('click', function () {
                        print(attrs.printElementId);
                    });
                    window.onafterprint = function () {
                        $rootScope.$broadcast("printingFinished");
                        // clean the print section before adding new content
                        printSection.innerHTML = '';
                    }
                }
                $timeout(printLabel, 0);
            };

            function printElement(elem) {
                // clones the element you want to print
                var domClone = elem.cloneNode(true);
                printSection.innerHTML = '';
                printSection.appendChild(domClone);
                window.print();
            };
            return {
                link: link,
                restrict: 'A'
            };

    }]);

    app.directive("dirFocus", function ($rootScope) {
        return function (scope, element) {
            scope.$on("searchFinished", function () {
                element.focus();
            });
            scope.$on("printingFinished", function () {
                element.focus();
            });
        };
    });
})();