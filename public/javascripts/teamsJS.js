$(document).ready(function() {
    populateTable();

});

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
            tableContent += '<td>' + this.teamname + '</td>';
            tableContent += '</tr>';
        });

        // Inject the whole content string into our existing HTML table
        $('#teamtable table tbody').html(tableContent);
    });
};