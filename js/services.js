(function () {
        var app = angular.module("BookingApp");

        app.value("merchants", [
            {
                "id": 24,
                "name": "Amazon Mkt",
                "use": true
            },
            {
                "id": 23,
                "name": "Alibris.com",
                "use": true
            },
            {
                "id": 2022,
                "name": "AbeBooks.com",
                "use": true
            },
            {
                "id": 19,
                "name": "Half.com",
                "use": true
            },
            {
                "id": 30,
                "name": "Barnes & Noble Marketplace",
                "use": true
            },
        ]);

        app.factory("campusbookService", ["$http",
        function ($http) {
                var url = "getBooksList.php";
                return {
                    searchBookPrices: function (isbn, callback) {
                        return $http.get(url, {
                            params: {
                                isbn: isbn,
                            }
                        }).then(function (resp) {
                        callback(resp.data);
                    });

                }
            }
        }]);
    
    app.factory("loggingService", ["$http", function($http) {
        return {
            
        }    
    }]);
})()