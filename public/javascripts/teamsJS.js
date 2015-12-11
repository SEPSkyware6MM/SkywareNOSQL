$(document).ready(function() {
    populateTable();
});

function showteamdetails(shortname)
{
    $.ajax({
        url: "/teams/" + shortname,
        type: "GET",
        dataType: 'json'
    }).done(function(data){
        var players = data[0].players;

    });;
}

// Fill table with data
function populateTable() {

    // Empty content string
    var tableContent = '';

    // jQuery AJAX call for JSON
    $.getJSON( '/teams/list', function( data ) {

        // For each item in our JSON, add a table row and cells to the content string
        $.each(data, function(){
            tableContent += '<tr>';
            tableContent += '<td><img src="' + this.icon + '"></td>';
            tableContent += '<td onclick=showteamdetails(' + "'" + this.shortname + "'" +')>' + this.teamname + '</td>';
            tableContent += '</tr>';
        });

        // Inject the whole content string into our existing HTML table
        $('#teamtable table tbody').html(tableContent);
    });
};