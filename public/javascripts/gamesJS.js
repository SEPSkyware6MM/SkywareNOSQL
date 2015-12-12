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
        var games = data[0].games;
        var gamesOrderedByMatchday = games.sort(function(a,b)
        {
            return b.matchday - a.matchday;
        });
        var tableContent = '';
        //Clear the table before injecting the new players
        $('#gamestable table tbody').html(tableContent);
        // For each item in our JSON, add a table row and cells to the content string
        var i = 0;
        var matchday = 1;
        $.each(gamesOrderedByMatchday, function(){
            if(i % 9 === 0)
            {
                tableContent += '<tr><th class="middleTh"> Spieltag:' + matchday + '</th></tr>';
                matchday++;
            }
            tableContent += '<tr>';
            tableContent += '<td>' + this.team1 + '</td>';
            tableContent += '<td>' + this.team2 + '</td>';
            tableContent += '<td>' + this.goalsTeam1 + ":" + this.goalsTeam2 + '</td>';
            tableContent += '</tr>';
            
            i++;
        });

        // Inject the whole content string into our existing HTML table
        $('#gamestable table tbody').html(tableContent);    
    });;
}