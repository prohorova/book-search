<?php
DEFINE('CAMPUSBOOK_KEY','DBi9MNAuErUoyW6sGEst');

$isbn = $_GET['isbn'];
$url = "http://api2.campusbooks.com/12/rest/bookprices?key=" . CAMPUSBOOK_KEY . "&isbn=" . $isbn;
$response = simplexml_load_file($url);
$out = array();
switch((string) $response['status']) {
	case "ok": 
		$out["success"] = true;
        $out["isbn13"] = (string) $response->page->book->isbn13;
        $out["title"] = (string) $response->page->book->title;
		foreach($response->page->offers->condition as $condition) {
			if ($condition['name'] == "Used") {
                $out["offers"] = array();
				foreach($condition->offer as $offer) {
					$offerArray = array();
                    $offerArray['merchant_id'] = (string)$offer->merchant_id;
                    $offerArray['merchant_name'] = (string)$offer->merchant_name;
                    $offerArray['price'] = (float)$offer->price;
                    array_push($out["offers"], $offerArray);
				}
			}
		}
		break;
	case "error":
		$out["success"] = false;
		$out["errors"] = array();
		foreach($response->errors->error as $error) {
			array_push($out["errors"], (string)$error);
		}
		break;	
}
echo json_encode($out);
?>