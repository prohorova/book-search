<?php
DEFINE('CAMPUSBOOK_KEY','DBi9MNAuErUoyW6sGEst');

$isbn = $_GET['isbn'];
$url = "http://api2.campusbooks.com/12/rest/prices?key=" . CAMPUSBOOK_KEY . "&isbn=" . $isbn;
$response = simplexml_load_file($url);
$out = array();
switch((string) $response['status']) {
	case "ok": 
		$out["status"] = "ok";
		foreach($response->page->offers->condition as $condition) {
			if ($condition['name'] == "Used") {
				foreach($condition->offer as $offer) {
					echo $key;
					echo $offer->isbn13;
				}
			}
		}
		break;
	case "error":
		$out["status"] = "error";
		$out["errors"] = array();
		foreach($response->errors->error as $error) {
			array_push($out["errors"], (string)$error);
		}
		break;	
}
echo json_encode($out);


?>