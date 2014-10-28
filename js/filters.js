(function () {
    var app = angular.module("BookingApp");

    app.filter("isbn", function () {
        return function (input) {
            return input.substr(0, 3) + "-" + input.substr(3, 1) + "-" + input.substr(4, 4) + "-" + input.substr(8, 4) + "-" + input.substr(12, 1);
        }
    });
    
    app.filter("bookTitle", function() {
        return function(input) {
            if (input.length > 25) {
                return input.substr(0, 22) + "...";    
            } else {
                return input;
            }   
        }    
    });
})();