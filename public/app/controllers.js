(function () {
    angular.module("BookingApp")

    .controller("MainController", ["$scope", "merchants", "campusbookService", "$filter", "$rootScope",

        function ($scope, merchants, campusbookService, $filter, $rootScope) {

            $scope.mainModel = {
                isbn: undefined,
                isbn13: undefined,
                title: undefined,
                minimalPriceToPrint: 5,
                enteredPrice: undefined,
                automaticPrint: false,
                requestProcessing: false,
                maxPrice: undefined,
                offers: [],
                errors: []
            };

            $scope.merchants = merchants;

            $scope.searchBooks = searchBooks;

            $scope.setMinimalPrice = setMinimalPrice;

            $scope.showResults = showResults;

            $scope.getFormattedIsbn = getFormattedIsbn;

            $scope.printOnStart = printOnStart;

            function getFormattedIsbn() {
                return $filter("isbn")($scope.mainModel.isbn13);
            }

            function resetErrors() {
                $scope.mainModel.errors = [];
            }

            function resetOffers() {
                $scope.mainModel.offers = [];
            }

            function printOnStart() {
                return ($scope.mainModel.maxPrice >= $scope.mainModel.minimalPriceToPrint) && $scope.mainModel.automaticPrint;
            }

            function processResponse(data) {
                var merchant, i, l;

                $scope.mainModel.requestProcessing = false;

                if (data.success) {
                    if (data.isbn13 && data.title) {
                        $scope.mainModel.isbn13 = data.isbn13;
                        $scope.mainModel.title = data.title;
                    } else {
                        $scope.mainModel.errors.push("Couldn't retrieve book information");
                        return;
                    };
                    if (data.offers.length) {
                        $scope.mainModel.offers = _.filter(data.offers, function (offer) {
                            return _.find(merchants, function (merchant) {
                                return merchant.id == offer.merchant_id && merchant.use;
                            })
                        })
                        if (!$scope.mainModel.offers.length) {
                            $scope.mainModel.errors.push("No results found");
                            return;
                        }
                        $scope.mainModel.maxPrice = _.max($scope.mainModel.offers, function (offer) {
                            return offer.price
                        }).price;
                    } else {
                        $scope.mainModel.errors.push("No results found");
                    };
                    $rootScope.$broadcast("searchFinished", $scope.mainModel.isbn13, $scope.mainModel.title, $scope.mainModel.offers, $scope.printOnStart());
                } else {
                    if (data.errors.length) {
                        $scope.mainModel.errors = data.errors;
                    } else {
                        $scope.mainModel.errors.push("Unknown error occured");
                    }
                };
            }

            function searchBooks(isbn) {
                var INTEGER_REGEXP = /^\-?\d+$/;
                resetErrors();
                if (isbn && INTEGER_REGEXP.test(isbn) && (isbn.length === 10 || isbn.length === 13)) {
                    resetOffers();
                    $scope.mainModel.requestProcessing = true;
                    campusbookService.searchBookPrices($scope.mainModel.isbn, processResponse);
                } else {
                    $scope.mainModel.errors.push("Isbn must contain 10 or 13 digits");
                };
            }

            function setMinimalPrice(price) {
                $scope.mainModel.minimalPriceToPrint = price;
            }

            function showResults() {
                return !!$scope.mainModel.offers.length;
            }
    }])

    .controller("logsController", ["$scope", "loggingService", "logsOnPage",
        function ($scope, loggingService, logsOnPage) {
            var offset = 0,
                count = logsOnPage;

            $scope.logsModel = {
                logs: [],
                total: 0,
                moreLogsAvailable: false,
                requestProcessing: false
            };

            $scope.getMoreLogs = getMoreLogs;

            $scope.noLogs = noLogs;

            activate();

            function activate() {
                loggingService.getLogs(offset, count, processLogsListResponse);

                $scope.$on("searchFinished", function (event, isbn, title, offers, isPrintedOnStart) {
                    loggingService.createLogEntry(isbn, title, offers, isPrintedOnStart, processLogEntryCreationResponse);
                });
            }

            function checkIfMoreLogsAvailable() {
                $scope.logsModel.moreLogsAvailable = $scope.logsModel.logs.length < $scope.logsModel.total;
            }

            function getMoreLogs() {
                $scope.logsModel.requestProcessing = true,
                loggingService.getLogs(offset, count, processLogsListResponse);
            };

            function noLogs() {
                return !($scope.logsModel.logs && $scope.logsModel.logs.length);
            }

            function processLogsListResponse(data) {
                $scope.logsModel.requestProcessing = false
                if (data.logs) {
                    $scope.logsModel.logs = $scope.logsModel.logs.concat(data.logs);
                }
                offset = $scope.logsModel.logs.length;
                $scope.logsModel.total = data.total;
                checkIfMoreLogsAvailable();
            }

            function processLogEntryCreationResponse(data) {
                if (data.newFile) {
                    $scope.logsModel.logs.pop();
                    $scope.logsModel.logs.unshift(data.newFile);
                    $scope.logsModel.total++;
                    checkIfMoreLogsAvailable();
                }
            }
    }]);
})();