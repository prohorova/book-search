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

$logEntry = "Isbn: " . $isbn . PHP_EOL . "Title: " . $title . PHP_EOL .  "Printed: " . $isPrinted . PHP_EOL . PHP_EOL;
file_put_contents($file, $logEntry, FILE_APPEND);

echo json_encode($out);
?>