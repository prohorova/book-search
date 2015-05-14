(function () {
    angular.module("BookingApp")
        .value("logsOnPage", 5)
        .value("logsDir", "logs")

    .value("merchants", [
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
    ])

    .factory("campusbookService", ["$http",
        function ($http) {
            var url = "../getBooksList.php";
        
            return {
                searchBookPrices: searchBookPrices
            };

            function searchBookPrices(isbn, callback) {
                return $http.get(url, {
                    params: {
                        isbn: isbn,
                    }
                }).then(function (resp) {
                    callback(resp.data);
                });
            }
    }])

    .factory("loggingService", ["$http", "logsDir",
                function ($http, logsDir) {
            var getLogsUrl = "../getLogs.php",
                createLogEntryUrl = "../createLogEntry.php";
                    
            return {
                getLogs: getLogs,
                createLogEntry: createLogEntry
            };

            function getLogs(offset, count, callback) {
                $http.get(getLogsUrl, {
                    params: {
                        offset: offset,
                        count: count,
                        logsDir: logsDir
                    }
                }).then(function (resp) {
                    callback(resp.data);
                });
            }

            function createLogEntry(isbn, title, offers, isPrinted, callback) {
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
    }]);
})();