(function () {
    var app = angular.module("BookingApp");

    app.controller("MainController", ["$scope", "merchants", "campusbookService", "$filter", "$rootScope",

        function ($scope, merchants, campusbookService, $filter, $rootScope) {
                                      
            $scope.mainModel = {
                isbn: undefined,  
                isbn13: undefined,
                title: undefined,
                minimalPriceToPrint: 5,
                enteredPrice: undefined,
                automaticPrint: false,
                requestProcessing: false,
                maxPrice: 0,
                offers: [],
                errors: []
            };
            
            $scope.merchants = merchants;
                   
            var resetErrors = function() {
                $scope.mainModel.errors = [];
            };
    
            var resetOffers = function() {
                $scope.mainModel.offers = [];
            };
            
            var findMerchant = function(id) {
                var i, l, merchant;
                for (i = 0, l = $scope.merchants.length; i < l; i++) {
                    if ($scope.merchants[i]["id"] == id) {
                        merchant = $scope.merchants[i]; 
                        break;
                    }    
                }
                return merchant;
            };
            
            var processResponse = function(data) {
                var merchant, i, l;
                
                $scope.mainModel.requestProcessing = false;
                
                if (data.success) {
                    if (data.isbn13 && data.title) {
                        $scope.mainModel.isbn13 = data.isbn13;
                        $scope.mainModel.title = data.title;    
                    }
                    else {
                        $scope.mainModel.errors.push("Couldn't retrieve book information");  
                        return;
                    }
                    if (data.offers.length) {
                        _.forEach(data.offers, function(offer) {
                            merchant = findMerchant(offer["merchant_id"]);
                            if (merchant && merchant.use) {
                                $scope.mainModel.offers.push(offer);   
                            }
                        });   
                        if (!$scope.mainModel.offers.length) {
                            $scope.mainModel.errors.push("No results found"); 
                            return;
                        }
                        $scope.mainModel.maxPrice = _.max($scope.mainModel.offers, function(offer){ return offer.price }).price; 
                    } else {
                        $scope.mainModel.errors.push("No results found");     
                    }
                    $rootScope.$broadcast("searchFinished", $scope.mainModel.isbn13, $scope.mainModel.title, $scope.mainModel.offers, $scope.printOnStart());
                } else {
                    if (data.errors.length) {
                        $scope.mainModel.errors = data.errors;        
                    } else {
                        $scope.mainModel.errors.push("Unknown error occured");
                    } 
                }    
            };
    
            $scope.setMinimalPrice = function (price) {
                $scope.mainModel.minimalPriceToPrint = price;
            };

            $scope.searchBooks = function (isbn) {
                var INTEGER_REGEXP = /^\-?\d+$/;
                
                resetErrors();
                if (isbn && INTEGER_REGEXP.test(isbn) && (isbn.length === 10 || isbn.length === 13)) { 
                    resetOffers(); 
                    $scope.mainModel.requestProcessing = true;
                    campusbookService.searchBookPrices($scope.mainModel.isbn, processResponse);
                } else {
                    $scope.mainModel.errors.push("Isbn must contain 10 or 13 digits");
                }
            };
            
            $scope.showResults = function() {
                return !!$scope.mainModel.offers.length;
            };
            
            $scope.getFormattedIsbn = function() {
                return $filter("isbn")($scope.mainModel.isbn13);   
            };
            
            $scope.printOnStart = function() {
                return ($scope.mainModel.maxPrice >= $scope.mainModel.minimalPriceToPrint) && $scope.mainModel.automaticPrint;    
            };
    }]);
    
    app.controller("logsController", ["$scope", "loggingService", "logsOnPage", function($scope, loggingService, logsOnPage) {
        var offset = 0,
            count = logsOnPage;
        
        $scope.logsModel = {
            logs: [],
            moreLogsAvailable: false,
            requestProcessing: false
        };
        
        var processLogsListResponse = function(data) {
            $scope.logsModel.requestProcessing = false,
            $scope.logsModel.logs = $scope.logsModel.logs.concat(data.logs);
            offset = $scope.logsModel.logs.length;
            $scope.logsModel.moreLogsAvailable = $scope.logsModel.logs.length < data.total;
        }
        
        var processLogEntryCreationResponse = function() {
            
        }
        
        loggingService.getLogs(offset, count, processLogsListResponse); 
        
        $scope.getMoreLogs = function() {
            $scope.logsModel.requestProcessing = true,
            loggingService.getLogs(offset, count, processLogsListResponse);     
        }
        
        $scope.noLogs = function() {
            return !($scope.logsModel.logs && $scope.logsModel.logs.length);
        }
        
        $scope.$on("searchFinished", function(event, isbn, title, offers, isPrintedOnStart) {
            loggingService.createLogEntry(isbn, title, offers, isPrintedOnStart, processLogEntryCreationResponse);         
        })
    }]);
})()