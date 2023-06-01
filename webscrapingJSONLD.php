<?php

require "vendor/autoload.php";

use GuzzleHttp\Client;

$client = new Client();

$headers = ["headers" => [
    "User-Agent" => "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36 Edg/113.0.1774.42"
]];

$request = $client->getAsync("https://www.imdb.com/title/tt5433140/?ref_=fn_al_tt_1", $headers);

$request->then(function ($response) {
    $responseBody = $response->getBody();
    libxml_use_internal_errors(true);
    $document = new DOMDocument();
    $document->loadHTML($responseBody);
    $xpath = new DOMXPath($document);
    $results = $xpath->query("//script[@type='application/ld+json']");
    $jsonGraph = $results[0]->nodeValue;
    $data = json_decode($jsonGraph);
    $actors = array();
    if (isset($data->actor)) {
        foreach ($data->actor as $actor) {
            $actors[] = $actor->name;
        }
    }
    header('Content-Type: application/json');
    echo json_encode($actors);
})->wait();



