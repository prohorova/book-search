<?php

$json = file_get_contents('php://input'); 
$obj = json_decode($json, true);

$isbn = $obj["isbn"];
$title = $obj["title"];
$offers = $obj["offers"];
$isPrinted = $obj["isPrinted"];
$dir = $obj['logsDir'];

$filename = date("n-j-Y").'.txt';
$file = $dir . $filename;
$out = array();

if (!file_exists($file)) {
    $out["newFile"] = $filename;
}
$logPrices = "";
foreach($offers as $offer) {
    $logPrices .= $offer['merchant_name'] . ": " . $offer['price'] . "\r\n";
}
$logPrinted = "Printed: " . ($isPrinted == "true" ? "yes" : "no");
$logEntry = "ISBN: " . $isbn . "\r\n" . "Title: " . $title . "\r\n" . $logPrices . $logPrinted . "\r\n\r\n";
file_put_contents($file, $logEntry, FILE_APPEND);

echo json_encode($out);
?>