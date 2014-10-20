(function () {
        var app = angular.module("BookingApp");

        app.value("merchants", [
            {
                "id": 24,
                "name": "Amazon Mkt",
                "use": true
            },
            {
                "id": 323,
                "name": "Alibris",
                "use": true
            },
            {
                "id": 2022,
                "name": "eCampus AbeBooks",
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
                var url = "booksList.php";
                return {
                    searchBookPrices: function (isbn, callback) {
                        return $http.get(url, {
                            params: {
                                isbn: isbn,
                            }
                        }).then(function (data) {
                        console.log(data);
                        callback(data);
                    });

                }
            }
        }]);
})()