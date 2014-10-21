(function () {
        var app = angular.module("BookingApp");

        app.filter("isbn", function() {
            return function(input) {
                return input.substr(0,3) + "-" + input.substr(3,1) + "-" + input.substr(4,4) + "-" + input.substr(8,4) + "-" + input.substr(12,1);
            }
        });
})()