let mydata = [];

$(document).ready(function() {
    $("#btnLoadData").click(function() {
        $.ajax({
            url: "webscaping.php",
            type: "GET",
            dataType: "json",
            success: function(data) {
                mydata = data;
                $("#tblData tbody").empty();
                
                $.each(mydata, function(index, row) {
                    $("#tblData tbody").append(
                        "<tr>" +
                        "<td>" + row.symbol + "</td>" +
                        "<td>" + row.name + "</td>" +
                        "</tr>"
                    );
                });
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log("Eroare: " + textStatus, errorThrown);
            }
        });
    });
});

function afiseazaJSONLDData() {
  $.ajax({
    url: "webscrapingJSONLD.php",
    type: "GET",
    dataType: "json",
    success: function(data) {
        $("#jsonldTable tbody").empty();
        $.each(data, function(index, row) {
            $("#jsonldTable tbody").append(
                "<tr>" +
                "<td>" + row + "</td>" +
                "</tr>"
            );
        });
    },
    error: function(jqXHR, textStatus, errorThrown) {
        console.log("Eroare: " + textStatus, errorThrown);
    }
});
    }

function insereazaJSONServer() {
    const url = "http://localhost:4000/monede";

  
    const newData = {
        symbol: document.getElementById("simbolInput").value,
        name: document.getElementById("numeInput").value
    };


    $.ajax({
        type: "POST",
        url: url,
        data: JSON.stringify([...mydata, newData]),
        dataType: "json",
        contentType: "application/json",
        success: function (data) {
            mydata = [...mydata, newData];
            console.log("Datele au fost adăugate cu succes în serverul JSON");
            console.log(mydata)
       
            fetchDataFromJSONServer();
        },
        error: function (xhr, status, error) {
            console.log("Eroare la adăugarea datelor în serverul JSON: " + error);
        }
    });
}
function fetchDataFromJSONServer() {
    const url = "http://localhost:4000/monede";
  
    $.get(url, function (response) {
      const dataTable = document.getElementById("jsonDataTable");
  
 
      while (dataTable.rows.length > 0) {
        dataTable.deleteRow(0);
      }
  

      const allData = response.concat(mydata);

      const headerRow = dataTable.insertRow();
        const headerCell1 = headerRow.insertCell();
        const headerCell2 = headerRow.insertCell();
        headerCell1.innerHTML = "Simbol";
        headerCell2.innerHTML = "Name";

      $.each(allData, function (index, obj) {
        
        const row = dataTable.insertRow();
        const cell1 = row.insertCell();
        const cell2 = row.insertCell();
        cell1.innerHTML = obj.symbol;
        cell2.innerHTML = obj.name;
      });
    });
  }
  function sendToRDF() {
    const formData = new FormData();
    const dataTable = document.getElementById("jsonDataTable");
    for (let i = 1; i < dataTable.rows.length; i++) {
      const symbol = dataTable.rows[i].cells[0].textContent;
      const name = dataTable.rows[i].cells[1].textContent;
      formData.append("symbol[]", symbol);
      formData.append("name[]", name);
    }
  

    $.ajax({
      type: "POST",
      url: "sendToRDF.php",
      data: formData,
      processData: false,
      contentType: false,
      success: function(response) {
        console.log(response);
        fetchDataFromRDF4J();
      },
      error: function(jqXHR, textStatus, errorThrown) {
        console.log("Eroare: " + textStatus, errorThrown);
      }
    });
  }


  function fetchDataFromRDF4J() {
 
    const query = encodeURIComponent(
      "PREFIX ex: <http://example.org/> " +
      "SELECT ?monede ?symbol ?name WHERE {?monede rdf:type ex:Monede; ex:symbol ?symbol; ex:name ?name }"
    );
    $.get("http://localhost:8080/rdf4j-server/repositories/grafexamen?query=" + query, procesareRaspuns, "json");
  }
  
  function procesareRaspuns(raspuns) {
    const date = raspuns.results.bindings;
  

    $("#rdfDataTable").empty();
    const antet = $("<tr><th>Simbol</th><th>Nume</th></tr>");
    $("#rdfDataTable").append(antet);
  

    for (let i = 0; i < date.length; i++) {
      const simbol = date[i].symbol.value;
      const nume = date[i].name.value;
      const linie = $("<tr><td>" + simbol + "</td><td>" + nume + "</td></tr>");
      $("#rdfDataTable").append(linie);
    }
  }

  function deleteFromRDF() {
    $.ajax({
      type: "POST",
      url: "http://localhost:8080/rdf4j-server/repositories/grafexamen/statements",
      data: {
        update: "PREFIX ex: <http://example.org/> " +
                "DELETE WHERE {?monede rdf:type ex:Monede; ex:symbol \"USD\"; ex:name \"Dolar American\" }"
      },
      success: function(response) {

        fetchDataFromRDFAfterDelete();
      },
      error: function(jqXHR, textStatus, errorThrown) {
        console.log("Error deleting records: " + textStatus + " - " + errorThrown);
      }
    });
  }
  
  function fetchDataFromRDFAfterDelete() {

    const query = encodeURIComponent(
      "PREFIX ex: <http://example.org/> " +
      "SELECT ?monede ?symbol ?name WHERE {?monede rdf:type ex:Monede; ex:symbol ?symbol; ex:name ?name }"
    );
    $.get("http://localhost:8080/rdf4j-server/repositories/grafexamen?query=" + query, procesareRaspunsAfterDelete, "json");
  }
  
  function procesareRaspunsAfterDelete(raspuns) {
    const date = raspuns.results.bindings;
  

    $("#rdfAfterDeleteTable").empty();
    const antet = $("<tr><th>Simbol</th><th>Nume</th></tr>");
    $("#rdfAfterDeleteTable").append(antet);
  

    for (let i = 0; i < date.length; i++) {
      const simbol = date[i].symbol.value;
      const nume = date[i].name.value;
      const linie = $("<tr><td>" + simbol + "</td><td>" + nume + "</td></tr>");
      $("#rdfAfterDeleteTable").append(linie);
    }
  }