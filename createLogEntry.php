<?php

$json = file_get_contents('php://input'); 
$obj = json_decode($json, true);

$isbn = $obj["isbn"];
$title = $obj["title"];
$offers = $obj["offers"];
$isPrinted = $obj["isPrinted"];
$dir = $obj['logsDir'];

$filename = date("n-j-Y").'.csv';
$file = $dir . "/" . $filename;
$out = array();

if (!file_exists($dir)) {
	mkdir($dir, 0777);
}

if (!file_exists($file)) {
    $out["newFile"] = $filename;
}
$logPrices = "\"";
foreach($offers as $key => $offer) {
    $logPrices .= $offer['merchant_name'] . ":" . $offer['price'];
    if ($key < count($offers) -1) {
         $logPrices .= ",";
    } else {
        $logPrices .= "\"";
    }
}
$logPrinted = $isPrinted == "true" ? "yes" : "no";
$logEntry = $isbn . "," . $title . "," . $logPrices . "," . $logPrinted . "\r\n";
file_put_contents($file, $logEntry, FILE_APPEND);

echo json_encode($out);
?>