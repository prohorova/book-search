(function () {
        var app = angular.module("BookingApp");
        app.value("logsOnPage", 2);
        app.value("logsDir", "logs/");

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

        app.factory("loggingService", ["$http", "logsDir",
                function ($http, logsDir) {
                    var getLogsUrl = "getLogs.php",
                        createLogEntryUrl = "createLogEntry.php";
                    return {
                        getLogs: function (offset, count, callback) {
                            $http.get(getLogsUrl, {
                                params: {
                                    offset: offset,
                                    count: count,
                                    logsDir: logsDir
                                }
                            }).then(function (resp) {
                                callback(resp.data);
                            })
                        },
                        createLogEntry: function (isbn, title, offers, isPrinted, callback) {
                            $http.post(createLogEntryUrl, {
                                isbn: isbn,
                                title: title,
                                offers: offers,
                                isPrinted: isPrinted.toString(),
                                logsDir: logsDir
                            }).then(function (resp) {
                                callback(resp.data);
                            });
                        }
                    }
                }]);
        })()