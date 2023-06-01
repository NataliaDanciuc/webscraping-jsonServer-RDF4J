<?php
$url = "https://www.curs-valutar.ro/";
$html = file_get_contents($url);

$dom = new DOMDocument();
@$dom->loadHTML($html);
$xpath = new DOMXPath($dom);


$nodes = $xpath->query("//*[@id='container1000']/div[3]/div[2]/table/tbody/tr[@class='culoare_bg']");


$data = array();


foreach ($nodes as $node) {
    $symbol = $xpath->query("./td[1]", $node)->item(0)->textContent;
    $name = $xpath->query("./td[2]", $node)->item(0)->textContent;
    
    
    $data[] = array(
        "symbol" => trim($symbol),
        "name" => trim($name)
    );
}

header('Content-Type: application/json');
echo json_encode($data);
?>













