var express = require('express');
var router = express.Router();
var dateOfMatchdayFirstHalf = new Date(2015, 7, 15, 15, 30);
var dateOfMatchdaySecondHalf = new Date(2016, 1, 23, 15, 30);

//GET home page
router.get('/', function (req, res, next) {
    res.render('games', {title: 'Spiele'});
});

// Database 1
//team1 team2 ort saison spieltag datum toreteam1 toreteam2
router.get('/write/fillDB', function (req, res) {
    var db = req.db;
    var collection = db.get('teams');
    collection.find({}, function (err, teams) {
        fillDatabaseWithRandomGames(teams);
    });
    res.send("DB erfolgreich gefüllt");
});

/* GET game listing. */
router.get('/list', function (req, res) {
    var db = req.db;
    var collection = db.get('games');
    collection.find({}, {}, function (e, docs) {
        res.json(docs);
    });
});

function fillDatabaseWithRandomGames(arrayWithTeams)
{
    var mongo = require('mongodb').MongoClient;
    mongo.connect('mongodb://localhost:27017/fussballApp', function (err, db) {
        console.log("Connected properly.");
        var col = db.collection('games');

        //first half of the season
        for (var matchday = 1; matchday <= 17; matchday++)
        {
            col.insert(
                    [
                        {
                            matchday: matchday,
                            played: 0,
                            games: getGamesJson(arrayWithTeams, matchday, 1)
                        }
                    ],
                    function (err, data) {
                        //handle error
                    }
            );
        }
        //second half of the saison
        for (var matchday = 1; matchday <= 17; matchday++)
        {
            col.insert(
                    [
                        {
                            matchday: matchday + 17,
                            played: 0,
                            games: getGamesJson(arrayWithTeams, matchday, 2)
                        }
                    ],
                    function (err, data) {
                        //handle error
                    }
            );
        }



        db.close();
    });
    console.log('Erfolgreich eingefügt');
}

//divides the array into teams of league one and teams of league two and calls the function, that gets the games of this matchday
function getGamesJson(arrayWithTeams, matchday, part)
{
    var teamsLeagueOne = [];
    var teamsLeagueTwo = [];
    for(var i = 0; i < arrayWithTeams.length; i++)
    {
        if(arrayWithTeams[i].league === 1)
        {
            teamsLeagueOne.push(arrayWithTeams[i]);
        }
        else if(arrayWithTeams[i].league === 2)
        {
            teamsLeagueTwo.push(arrayWithTeams[i]);
        }
    }
    var allGamesLeagueOne = getMatchdayGames(teamsLeagueOne, matchday, part);
    var allGamesLeagueTwo = getMatchdayGames(teamsLeagueTwo, matchday, part);
    var allgames = allGamesLeagueOne.concat(allGamesLeagueTwo);
    //set the new date for the next matchday
    if(part === 1)
    {
        dateOfMatchdayFirstHalf.setDate((dateOfMatchdayFirstHalf.getDate() + 7));  
    }
    else
    {
        dateOfMatchdaySecondHalf.setDate((dateOfMatchdaySecondHalf.getDate() + 7));
    }
    return allgames;
}


//Returns one Matchday of Games
function getMatchdayGames(arrayWithTeams, matchday, part)
{
    var jsonArr = [];
    if (matchday === 1 && part === 1)
    {
        dateOfMatchdayFirstHalf = new Date(2015, 7, 15, 15, 30);
        dateOfMatchdaySecondHalf = new Date(2016, 1, 23, 15, 30);
    }
    var n = arrayWithTeams.length - 1;
    
    
    if(part === 1)
    {
        var team1 = arrayWithTeams[matchday - 1];
        var team2 = arrayWithTeams[n];
        var date = dateOfMatchdayFirstHalf.toString();    
    }
    else
    {
        var team2 = arrayWithTeams[matchday - 1];
        var team1 = arrayWithTeams[n];
        var date = dateOfMatchdaySecondHalf.toString();
    }
    
    if (matchday % 2 === 0) {
        jsonArr.push(
                {
                    team1: team1.teamname,
                    team2: team2.teamname,
                    location: team1.location,
                    saison: dateOfMatchdayFirstHalf.getFullYear() + "/" + dateOfMatchdaySecondHalf.getFullYear(),
                    date: date,
                    goalsTeam1: -1,
                    goalsTeam2: -1
                });
    } else {
        jsonArr.push(
                {
                    team1: team2.teamname,
                    team2: team1.teamname,
                    location: team2.location,
                    saison: dateOfMatchdayFirstHalf.getFullYear() + "/" + dateOfMatchdaySecondHalf.getFullYear(),
                    date: date,
                    goalsTeam1: -1,
                    goalsTeam2: -1
                });
    }
    for (var k = 1; k < (n + 1) / 2; k++) {
        
        var tmp = (matchday + k) % n;
        var teamA = tmp === 0 ? n : tmp;
        tmp = ((matchday - k % n) + n) % n;
        var teamB = tmp === 0 ? n : tmp;
        
        if(part === 1)
        {
            var team1 = arrayWithTeams[teamA - 1];
            var team2 = arrayWithTeams[teamB - 1];
        }
        else
        {
            var team2 = arrayWithTeams[teamA - 1];
            var team1 = arrayWithTeams[teamB - 1];
        }
        
        if (k % 2 !== 0) {
            jsonArr.push(
                    {
                        team1: team1.teamname,
                        team2: team2.teamname,
                        location: team1.location,
                        saison: dateOfMatchdayFirstHalf.getFullYear() + "/" + dateOfMatchdaySecondHalf.getFullYear(),
                        date: date,
                        goalsTeam1: -1,
                        goalsTeam2: -1
                    });
        } else {
            jsonArr.push(
                    {
                        team1: team2.teamname,
                        team2: team1.teamname,
                        location: team2.location,
                        saison: dateOfMatchdayFirstHalf.getFullYear() + "/" + dateOfMatchdaySecondHalf.getFullYear(),
                        date: date,
                        goalsTeam1: -1,
                        goalsTeam2: -1
                    });
        }

    }

//    if (matchday <= 17)
//    {
//        for (var i = 0; i < 36; i += 2)
//        {
//            //Hinspiele
//            jsonArr.push(
//                    {                 
//                        team1: arrayWithTeams[i].teamname,
//                        team2: arrayWithTeams[(i + matchday) % 36].teamname,
//                        location: arrayWithTeams[i].location,
//                        saison: dateOfMatchdayFirstHalf.getFullYear() + "/" + dateOfMatchdaySecondHalf.getFullYear(),
//                        date: dateOfMatchdayFirstHalf.toString(),
//                        goalsTeam1: -1,
//                        goalsTeam2: -1
//                    });
//        }
//        //add one week after all matches are played
//        dateOfMatchdayFirstHalf.setDate((dateOfMatchdayFirstHalf.getDate() + 7));
//    }
//    else if(matchday > 18)
//    {      
//        for (var i = 0; i < 36; i += 2)
//        {
//        //Rückspiel
//        jsonArr.push(
//                {                 
//                    team1: arrayWithTeams[(i + matchday) % 36].teamname,
//                    team2: arrayWithTeams[i].teamname,
//                    location: arrayWithTeams[(i + matchday) % 36].location,
//                    saison: dateOfMatchdayFirstHalf.getFullYear() + "/" + dateOfMatchdaySecondHalf.getFullYear(),
//                    date: dateOfMatchdaySecondHalf.toString(),
//                    goalsTeam1: -1,
//                    goalsTeam2: -1
//                });
//        } 
//        //add one week after all matches are played
//        dateOfMatchdaySecondHalf.setDate((dateOfMatchdaySecondHalf.getDate() + 7));
//    }
    return jsonArr;
}

function getRandomResult()
{
    return Math.floor((Math.random() * 5));
}

/* GET simulate Matchday */
router.get('/simulate', function (req, res) {
    var db = req.db;
    var collection = db.get('games');
    collection.find({}, {}, function (e, everyMatchdayGames) {
        updateGames(everyMatchdayGames, req, res);
    });
});

function updateGames(everyMatchdayGames, req, res)
{
    var gamesOrderedByMatchday = everyMatchdayGames.sort(function (a, b)
    {
        return a.matchday - b.matchday;
    });

    var actualMatchDay = 0;
    matchDayFound = false;
    var i = 0;
    while (i < 34 && !matchDayFound)
    {
        //which matchday has to be simulated next
        if (gamesOrderedByMatchday[i].played === 0)
        {
            actualMatchDay = gamesOrderedByMatchday[i].matchday;
            matchDayFound = true;
        }
        i++;
    }

    var db = req.db;

    db.get('games').update({matchday: actualMatchDay}, {"$set": {played: 1}});

    //update Matches with random results
    for (var i = 0; i < gamesOrderedByMatchday[0].games.length; i++)
    {
        var query1 = {};
        var name1 = "games." + i + ".goalsTeam1";
        query1[name1] = getRandomResult();

        var query2 = {};
        var name2 = "games." + i + ".goalsTeam2";
        query2[name2] = getRandomResult();

        db.get('games').update({matchday: actualMatchDay}, {"$set": query1});
        db.get('games').update({matchday: actualMatchDay}, {"$set": query2});

    }
    //update points per team
    db.get('games').find({matchday: actualMatchDay}, function (e, games) {
        var matchdayGames = games[0].games;
        for (var i = 0; i < matchdayGames.length; i++)
        {
            if (matchdayGames[i].goalsTeam1 > matchdayGames[i].goalsTeam2)
            {
                db.get('teams').update({teamname: matchdayGames[i].team1}, {"$inc": {points: 3}});
            } else if (matchdayGames[i].goalsTeam1 < matchdayGames[i].goalsTeam2)
            {
                db.get('teams').update({teamname: matchdayGames[i].team2}, {"$inc": {points: 3}});
            } else if (matchdayGames[i].goalsTeam1 === matchdayGames[i].goalsTeam2)
            {
                db.get('teams').update({teamname: matchdayGames[i].team1}, {"$inc": {points: 1}});
                db.get('teams').update({teamname: matchdayGames[i].team2}, {"$inc": {points: 1}});
            }
        }
    });


    res.send("Erfolgreich geändert");
}

module.exports = router;