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
                        return $http.post(url, {
                            params: {
                                isbn: isbn,
                            },

                            transformResponse: function (data) {
                                // convert the data to JSON and provide
                                // it to the success function below
                                var x2js = new X2JS();
                                var json = x2js.xml_str2json(data);
                                return json;
                            }
                        }).then(function (data) {
                        console.log(data);
                        callback(data);
                    });

                }
            }
        }]);
})()