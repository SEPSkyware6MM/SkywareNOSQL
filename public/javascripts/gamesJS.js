$(document).ready(function() {
    populateTable();
});

function populateTable()
{
        $.ajax({
        url: "/games/list",
        type: "GET",
        dataType: 'json'
    }).done(function(data){
        var allGames = [];
        
        var gamesOrderedByMatchday = data.sort(function(a,b)
        {
            return a.matchday - b.matchday;
        });

        var tableContent = '';
        //Clear the table before injecting the new players
        $('#gamestable table tbody').html(tableContent);
        // For each item in our JSON, add a table row and cells to the content string
        $.each(gamesOrderedByMatchday, function(){
            tableContent += '<tr><th class="middleTh"> Spieltag:' + this.matchday + '</th></tr>';

            $.each(this.games, function()
            {
            tableContent += '<tr>';
            tableContent += '<td>' + this.team1 + '</td>';
            tableContent += '<td>' + this.team2 + '</td>';
            if(this.goalsTeam1 === -1 ||this.goalsTeam2 === -1)
            {
                tableContent += '<td>' + "tbd" + ":" + "tbd" + '</td>';
            }
            else
            {
                tableContent += '<td>' + this.goalsTeam1 + ":" + this.goalsTeam2 + '</td>';
            }
            tableContent += '<td>' + this.location + '</td>';
            tableContent += '<td>' + this.date + '</td>';
            tableContent += '<td>' + this.saison + '</td>';
            tableContent += '</tr>';
            });         
        });

        // Inject the whole content string into our existing HTML table
        $('#gamestable table tbody').html(tableContent);    
    });;
}