(function () {
    var app = angular.module("BookingApp");

    app.controller("MainController", ["$scope", "merchants", "campusbookService",

        function ($scope, merchants, campusbookService) {
            $scope.model = {
                isbn: undefined,
                minimalPrice: 5,
                enteredPrice: undefined,
                automaticPrint: false,
                result: undefined,
            };
            $scope.merchants = merchants;

            $scope.setMinimalPrice = function (price) {
                $scope.model.minimalPrice = price;
            };

            $scope.searchBooks = function () {
                if ($scope.model.isbn) {
                    campusbookService.searchBookPrices($scope.model.isbn, function (data) {
                        $scope.result = data;
                    });
                }
            }
    }]);
})()