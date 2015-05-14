<?php

$dir = $_GET["logsDir"];
$offset = $_GET['offset'];
$count = $_GET['count'];

$logFilesListWithTime = array();
$out = array();
$out["logs"] = array();

if ($handle = opendir($dir)) {
    while (false !== ($entry = readdir($handle))) {
        if ($entry !== "." && $entry !== "..") {
            $logFilesList[$entry] = filectime($dir . "/" . $entry);
        }
    }
    arsort($logFilesList);
    $logFilesList = array_keys($logFilesList);
    closedir($handle);
}

$length = $count;
if ($offset + $count < count($logFilesList)) {
    $length = $offset + $count - count($logFilesList);
}

$out["total"] = count($logFilesList);
$out["logs"] = array_slice($logFilesList, $offset, $length);

echo json_encode($out);
?>