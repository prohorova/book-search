(function () {
    var app = angular.module("BookingApp");

    app.controller("MainController", ["$scope", "merchants", "campusbookService", "$filter", "$rootScope",

        function ($scope, merchants, campusbookService, $filter, $rootScope) {
                                      
            $scope.model = {
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
                $scope.model.errors = [];
            };
    
            var resetOffers = function() {
                $scope.model.offers = [];
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
                
                $scope.model.requestProcessing = false;
                $rootScope.$broadcast("searchFinished");
                if (data.success) {
                    if (data.isbn13 && data.title) {
                        $scope.model.isbn13 = data.isbn13;
                        $scope.model.title = data.title;    
                    }
                    else {
                        $scope.model.errors.push("Couldn't retrieve book information");  
                        return;
                    }
                    if (data.offers.length) {
                        _.forEach(data.offers, function(offer) {
                            merchant = findMerchant(offer["merchant_id"]);
                            if (merchant && merchant.use) {
                                $scope.model.offers.push(offer);   
                            }
                        });   
                        if (!$scope.model.offers.length) {
                            $scope.model.errors.push("No results found"); 
                            return;
                        }
                        $scope.model.maxPrice = _.max($scope.model.offers, function(offer){ return offer.price }).price; 
                    } else {
                        $scope.model.errors.push("No results found");     
                    }
                } else {
                    if (data.errors.length) {
                        $scope.model.errors = data.errors;        
                    } else {
                        $scope.model.errors.push("Unknown error occured");
                    } 
                }    
            };
    
            $scope.setMinimalPrice = function (price) {
                $scope.model.minimalPriceToPrint = price;
            };

            $scope.searchBooks = function (isbn) {
                var INTEGER_REGEXP = /^\-?\d+$/;
                
                resetErrors();
                if (isbn && INTEGER_REGEXP.test(isbn) && (isbn.length === 10 || isbn.length === 13)) { 
                    resetOffers(); 
                    $scope.model.requestProcessing = true;
                    campusbookService.searchBookPrices($scope.model.isbn, processResponse);
                } else {
                    $scope.model.errors.push("Isbn must contain 10 or 13 digits");
                }
            };
            
            $scope.showResults = function() {
                return !!$scope.model.offers.length;
            };
            
            $scope.getFormattedIsbn = function() {
                return $filter("isbn")($scope.model.isbn13);   
            };
            
            $scope.printOnStart = function() {
                return ($scope.model.maxPrice >= $scope.model.minimalPriceToPrint) && $scope.model.automaticPrint;    
            };
    }]);
})()