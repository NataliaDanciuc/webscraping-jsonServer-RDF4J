<?php

use EasyRdf\Graph;
use EasyRdf\Literal;
use EasyRdf\RdfNamespace;
use EasyRdf\Sparql\Http;

require_once "vendor/autoload.php";

$symbols = $_POST["symbol"];
$names = $_POST["name"];

$graph = new Graph();


RdfNamespace::set('ex', 'http://example.org/');


foreach ($symbols as $key => $symbol) {
    $name = $names[$key];
    $monedeUri = "http://example.org/coin/" . urlencode($symbol);
    $graph->addResource($monedeUri, "rdf:type", "ex:Monede");
    $graph->addLiteral($monedeUri, "ex:symbol", new Literal($symbol));
    $graph->addLiteral($monedeUri, "ex:name", new Literal($name));
}


$repository = new EasyRdf\Sparql\Client("http://localhost:8080/rdf4j-server/repositories/grafexamen/statements");
$repository->insert($graph->serialise("turtle"));


echo "Datele au fost adăugate cu succes în RDF4J!";
?>