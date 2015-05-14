<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Arnold ISBNS</title>

    <link href="assets/css/bootstrap.min.css" rel="stylesheet">
    <link href="assets/css/style.css" rel="stylesheet">
    
    <script src="https://code.jquery.com/jquery-1.11.1.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.7.0/underscore-min.js"></script>
    <script src="assets/libs/jquery-barcode.min.js"></script>
    <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.3.0/angular.min.js"></script>
    <script src="app/app.js"></script>
    <script src="app/services.js"></script>
    <script src="app/controllers.js"></script>
    <script src="app/directives.js"></script>
    <script src="app/filters.js"></script>

    <!-- HTML5 Shim and Respond.js IE8 support of HTML5 elements and media queries -->
    <!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
    <!--[if lt IE 9]>
      <script src="https://oss.maxcdn.com/html5shiv/3.7.2/html5shiv.min.js"></script>
      <script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
    <![endif]-->
</head>

<body data-ng-app="BookingApp" >
    <div class="container" data-ng-controller="MainController" data-ng-cloak>
        <h1>Arnold isbns</h1>
        <div class="well">
            <form class="form-inline" name="search" data-ng-submit="searchBooks(mainModel.isbn)">
                <div data-ng-repeat="error in mainModel.errors">
                    <div class="alert alert-danger">{{error}}</div>
                </div>
                <div class="form-group">
                    <input type="text" name="isbn" class="form-control" placeholder="Enter ISBN number" data-ng-model="mainModel.isbn" data-ng-disabled="mainModel.requestProcessing" dir-focus/>
                </div>
                <button class="btn btn-primary" type="submit" data-ng-disabled="mainModel.requestProcessing">Search</button>
                <img src="assets/images/ajax_loader.GIF" data-ng-show="mainModel.requestProcessing"/>
            </form>
        </div>
        <div>
            <div data-ng-if="showResults()">
                <h2>Results</h2>
                <div class="well">
                    <div data-ng-repeat="offer in mainModel.offers">
                        <div class="row">
                            <div class="col-md-8">
                                {{offer.merchant_name}}:
                            </div>
                            <div class="col-md-4">
                                {{offer.price | currency}}
                            </div>
                        </div>
                    </div>
                    <div id="book-label-wrapper">
                        <div id="book-label-print-wrapper">
                            <div id="book-label">
                                <p class="book-title"><strong>{{mainModel.title | bookTitle}}</strong></p>
                                <p>ISBN {{getFormattedIsbn()}}</p>
                                <div class="isbn-number" data-dir-barcode data-isbn-number={{mainModel.isbn13}}></div>
                                <p><strong>{{mainModel.maxPrice | currency}}</strong></p>
                            </div>
                        </div>
                        <button class="btn btn-primary" data-dir-print data-print-element-id="book-label" data-print-on-start={{printOnStart()}}>print label</button>
                    </div>
                </div>
            </div>
            <div>
                <h2>Settings</h2>
                <div class="well">
                    <form class="form-inline" name="settings" novalidate>
                        <div id="price-checkbox" class="checkbox">
                            <label>
                                <input type="checkbox" data-ng-model="mainModel.automaticPrint" />automatically print label if price is above {{mainModel.minimalPriceToPrint | currency}}
                            </label>
                        </div>

                        <div class="form-group">
                            <input class="form-control" placeholder="select minimum price" data-ng-model="mainModel.enteredPrice" />
                            <button class="btn btn-primary" data-ng-click="setMinimalPrice(mainModel.enteredPrice)">set price</button>
                        </div>
                    </form>


                    <h4>Select merchants</h4>
                    <form name="merchantsList" novalidate>
                        <div class="checkbox" data-ng-repeat="merchant in merchants">
                            <label>
                                <input type="checkbox" data-ng-model="merchant.use" />{{merchant.name}}
                            </label>
                        </div>
                    </form>

                    <div data-ng-controller="logsController">
                        <h4>Download daily logs</h4>
                        <p data-ng-if="noLogs()">No logs exist yet</p>
                        <ul class="list-unstyled">
                            <li data-ng-repeat="log in logsModel.logs">
                                <a href="../logs/{{log}}" target="_blank" download>{{log}}</a>
                            </li>
                        </ul>
                        <div class="logs-button-wrapper">
                            <button  type="text" class="btn btn-primary" data-ng-show="logsModel.moreLogsAvailable" data-ng-click="getMoreLogs()" data-ng-disabled="logsModel.requestProcessing">get more logs</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>


    </div>

</body>

</html>