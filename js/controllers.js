(function () {
    var app = angular.module("BookingApp");

    app.controller("MainController", ["$scope", "merchants", "campusbookService", "$filter",

        function ($scope, merchants, campusbookService, $filter) {
                                      
            $scope.model = {
                isbn: undefined,  
                isbn13: undefined,
                minimalPriceToPrint: 5,
                enteredPrice: undefined,
                automaticPrint: false,
                requestProcessing: false,
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
                if (data.success) {
                    if (data.offers.length) {
                        $scope.model.isbn13 = data.offers[0].isbn13;
                        angular.forEach(data.offers, function(offer) {
                            merchant = findMerchant(offer["merchant_id"]);
                            if (merchant && merchant.use) {
                                $scope.model.offers.push(offer);            
                            }
                        });    
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
                $scope.model.minimalPrice = price;
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
            
            $scope.getMaxPrice = function() {
                return _.max($scope.model.offers, function(offer){ return offer.price }).price;
            };
            
            $scope.getFormattedIsbn = function() {
                return $filter("isbn")($scope.model.isbn13);   
            };
            
            $scope.printLabel = function() {
                  var printContents = document.getElementById("book-label-print-wrapper").innerHTML;
                  var originalContents = document.body.innerHTML;        
                  var popupWin = window.open('', '_blank', 'width=216,height=120');
                  popupWin.document.open();
                  popupWin.document.write('<html><head><link rel="stylesheet" type="text/css" href="css/style.css" /></head><body onload="window.print()">' + printContents + '</html>');
                  popupWin.document.close();
                  window.onafterprint = function () {
                      alert("printed");
                      console.log("printed");
                // clean the print section before adding new content
                    popupWin.close();
                }
            };
    }]);
})()