$(document).ready(function() {
    populateTable(1);
});

function showteamdetails(shortname)
{
    $.ajax({
        url: "/teams/" + shortname,
        type: "GET",
        dataType: 'json'
    }).done(function(data){
        var players = data[0].players;
        var playersOrdered = players.sort(function(a,b)
        {
            return b.score - a.score;
        });
        $('#playerTableHeader').html("Spieler von " + data[0].teamname);
        var tableContent = '';
        //Clear the table before injecting the new players
        $('#playertable table tbody').html(tableContent);
        // For each item in our JSON, add a table row and cells to the content string
        $.each(playersOrdered, function(){
            tableContent += '<tr>';
            tableContent += '<td>' + this.firstname + '</td>';
            tableContent += '<td>' + this.lastname + '</td>';
            tableContent += '<td>' + this.score + '</td>';
            tableContent += '</tr>';
        });

        // Inject the whole content string into our existing HTML table
        $('#playertable table tbody').html(tableContent);    
    });;
}

// Fill table with data
function populateTable(searchedleague) {

    // Empty content string
    var tableContent = '';

    // jQuery AJAX call for JSON
    $.getJSON( '/teams/list', function( data ) {
        
        var teamsOfRightLeague = [];
        //we only need league one or two
        $.each(data, function(){
            if(this.league === searchedleague)
            {
                teamsOfRightLeague.push(this);
            }
        });
        

        var teamsOrdered = teamsOfRightLeague.sort(function(a,b)
        {
            return b.points - a.points;
        });
        
        // For each item in our JSON, add a table row and cells to the content string
        $.each(teamsOrdered, function(){
            tableContent += '<tr>';
            tableContent += '<td><img src="' + this.icon + '"></td>';
            tableContent += '<td onclick=showteamdetails(' + "'" + this.shortname + "'" +')>' + this.teamname + '</td>';
            tableContent += '<td>' + this.points + '</td>';
            tableContent += '</tr>';
        });

        // Inject the whole content string into our existing HTML table
        $('#teamtable table tbody').html(tableContent);
    });
};