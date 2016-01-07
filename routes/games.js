/*
 * Project: 
 * Skyware NOSQL FussballProjekt
 * Autoren:
 * Marc Misoch
 * Chris Denneberg
 */

var express = require('express');
var router = express.Router();
var dateOfMatchdayFirstHalf = new Date(2015, 7, 15, 15, 30);
var dateOfMatchdaySecondHalf = new Date(2016, 1, 23, 15, 30);

//GET home page
router.get('/', function (req, res, next) {
    res.render('games', {title: 'Spiele'});
});

//Delete all games in Database
router.delete('/', function (req, res, next) {
    var db = req.db;
    var collection = db.get('games');
    collection.drop();
    res.send("Games erfolgreich gelöscht");
});

// Database 1
//team1 team2 ort saison spieltag datum toreteam1 toreteam2
router.put('/write/fillDB', function (req, res) {
    var db = req.db;
    var collection = db.get('teams');
    var gamesCollection = db.get('games');
    gamesCollection.find({}, function(err, games){
        if(games.length === 0){
            collection.find({}, function (err, teams) {
                if(teams.length !== 0){
                    fillDatabaseWithRandomGames(teams);
                }else{
                    console.log('Insert teams first!');
                }
            });   
        }else{
            console.log('Games were already generated!');
        }
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

//writes games to the db
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
    for (var i = 0; i < arrayWithTeams.length; i++)
    {
        if (arrayWithTeams[i].league === 1)
        {
            teamsLeagueOne.push(arrayWithTeams[i]);
        } else if (arrayWithTeams[i].league === 2)
        {
            teamsLeagueTwo.push(arrayWithTeams[i]);
        }
    }
    var allGamesLeagueOne = getMatchdayGames(teamsLeagueOne, matchday, part);
    var allGamesLeagueTwo = getMatchdayGames(teamsLeagueTwo, matchday, part);
    var allgames = allGamesLeagueOne.concat(allGamesLeagueTwo);
    //set the new date for the next matchday
    if (part === 1)
    {
        dateOfMatchdayFirstHalf.setDate((dateOfMatchdayFirstHalf.getDate() + 7));
    } else
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


    if (part === 1)
    {
        var team1 = arrayWithTeams[matchday - 1];
        var team2 = arrayWithTeams[n];
        var date = dateOfMatchdayFirstHalf.toString();
    } else
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

        if (part === 1)
        {
            var team1 = arrayWithTeams[teamA - 1];
            var team2 = arrayWithTeams[teamB - 1];
        } else
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
    return jsonArr;
}

//returns a random number between 0 and max(including both)
function getRandomNumber(max)
{
    return Math.floor((Math.random() * max));
}

/* GET simulate Matchday */
router.put('/simulate', function (req, res) {
    var db = req.db;
    var collection = db.get('games');
    collection.find({}, {}, function (e, everyMatchdayGames) {
        updateGames(everyMatchdayGames, req, res);
    });
});

//updates the games of the first unplayed matchday if its date passed
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

    if (new Date(gamesOrderedByMatchday[actualMatchDay - 1].games[0].date) < new Date())
    {
        var db = req.db;

        db.get('games').update({matchday: actualMatchDay}, {"$set": {played: 1}});

        //update Matches with random results
        for (var i = 0; i < gamesOrderedByMatchday[0].games.length; i++)
        {
            var query1 = {};
            var name1 = "games." + i + ".goalsTeam1";
            query1[name1] = getRandomNumber(5);

            var query2 = {};
            var name2 = "games." + i + ".goalsTeam2";
            query2[name2] = getRandomNumber(5);

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

        //update goals of players
        db.get('games').find({matchday: actualMatchDay}, function (e, games) {
            var matchdayGames = games[0].games;
            for (var i = 0; i < matchdayGames.length; i++)
            {

                writeGoalsInDB(matchdayGames[i], db);
            }
        });


        console.log("Erfolgreich geändert");
        res.send("");
    } else
    {
        console.log("Datum noch nicht erreicht");
                res.send("");
    }


}

//generate a more realistic way of giving goals to players and write them into the db
function writeGoalsInDB(oneOfMatchdayGames, db)
{
    var game = oneOfMatchdayGames;
    var goalsTeam1OfGame = game.goalsTeam1;
    var goalsTeam2OfGame = game.goalsTeam2;
    for (var k = 0; k < goalsTeam1OfGame; k++)
    {
        db.get('teams').find({teamname: game.team1}, function (e, teams)
        {
            var players = teams[0].players;
            var probability = getRandomNumber(9);
            var playerWithGoal;
            if (probability <= 1)
            {
                var backfieldPlayers = getIndicesOfPosition("Verteidiger", players);
                playerWithGoal = getRandomNumber(backfieldPlayers.length - 1);
                var query = {};
                var player = "players." + backfieldPlayers[playerWithGoal] + ".score";
                query[player] = 1;
                db.get('teams').update({teamname: game.team1}, {"$inc": query});

            } else if (probability <= 4)
            {
                var midfieldPlayers = getIndicesOfPosition("Mittelfeld", players);
                playerWithGoal = getRandomNumber(midfieldPlayers.length - 1);
                var query = {};
                var player = "players." + midfieldPlayers[playerWithGoal] + ".score";
                query[player] = 1;
                db.get('teams').update({teamname: game.team1}, {"$inc": query});
            } else
            {
                var forwardPlayers = getIndicesOfPosition("Stürmer", players);
                playerWithGoal = getRandomNumber(forwardPlayers.length - 1);
                var query = {};
                var player = "players." + forwardPlayers[playerWithGoal] + ".score";
                query[player] = 1;
                db.get('teams').update({teamname: game.team1}, {"$inc": query});
            }
        });
    }

    for (var k = 0; k < goalsTeam2OfGame; k++)
    {
        db.get('teams').find({teamname: game.team2}, function (e, teams)
        {
            var players = teams[0].players;
            var probability = getRandomNumber(9);
            var playerWithGoal;
            if (probability <= 1)
            {
                var backfieldPlayers = getIndicesOfPosition("Verteidiger", players);
                playerWithGoal = getRandomNumber(backfieldPlayers.length - 1);
                var query = {};
                var player = "players." + backfieldPlayers[playerWithGoal] + ".score";
                query[player] = 1;
                db.get('teams').update({teamname: game.team2}, {"$inc": query});

            } else if (probability <= 4)
            {
                var midfieldPlayers = getIndicesOfPosition("Mittelfeld", players);
                playerWithGoal = getRandomNumber(midfieldPlayers.length - 1);
                var query = {};
                var player = "players." + midfieldPlayers[playerWithGoal] + ".score";
                query[player] = 1;
                db.get('teams').update({teamname: game.team2}, {"$inc": query});
            } else
            {
                var forwardPlayers = getIndicesOfPosition("Stürmer", players);
                playerWithGoal = getRandomNumber(forwardPlayers.length - 1);
                var query = {};
                var player = "players." + forwardPlayers[playerWithGoal] + ".score";
                query[player] = 1;
                db.get('teams').update({teamname: game.team2}, {"$inc": query});
            }
        });
    }
}

//returns the indices of the players in 'players' with the position 'position'
function getIndicesOfPosition(position, players)
{
    var indicesOfPosition = [];
    for (var i = 0; i < players.length; i++)
    {
        if (players[i].position === position)
        {
            indicesOfPosition.push(i);
        }
    }
    return indicesOfPosition;
}

//will be called by a timer so it will be automatically
function updateAllPassedGames()
{
    var db = require('monk')('mongodb://localhost:27017/fussballApp');
    var gamesCollection = db.get('games');
    gamesCollection.find().then(function(games){
        //check every matchday
        for(var i = 0; i < games.length; i++){
            //date already passed
            if(new Date(games[i].games[0].date) < new Date() && games[i].played === 0){
                db.get('games').update({matchday: games[i].matchday}, {"$set": {played: 1}});
                //update Matches with random results
                for (var j = 0; j < games[i].games.length; j++)
                {
                    var query1 = {};
                    var name1 = "games." + j + ".goalsTeam1";
                    games[i].games[j].goalsTeam1 = getRandomNumber(5);
                    query1[name1] = games[i].games[j].goalsTeam1;

                    var query2 = {};
                    var name2 = "games." + j + ".goalsTeam2";
                    games[i].games[j].goalsTeam2 = getRandomNumber(5);
                    query2[name2] = games[i].games[j].goalsTeam2;

                    db.get('games').update({matchday: games[i].matchday}, {"$set": query1});
                    db.get('games').update({matchday: games[i].matchday}, {"$set": query2});
                }
                //update points per team
                var matchdayGames = games[i].games;
                for (var j = 0; j < matchdayGames.length; j++)
                {
                    if (matchdayGames[j].goalsTeam1 > matchdayGames[j].goalsTeam2)
                    {
                        db.get('teams').update({teamname: matchdayGames[j].team1}, {"$inc": {points: 3}});
                    } else if (matchdayGames[j].goalsTeam1 < matchdayGames[j].goalsTeam2)
                    {
                        db.get('teams').update({teamname: matchdayGames[j].team2}, {"$inc": {points: 3}});
                    } else if (matchdayGames[j].goalsTeam1 === matchdayGames[j].goalsTeam2)
                    {
                        db.get('teams').update({teamname: matchdayGames[j].team1}, {"$inc": {points: 1}});
                        db.get('teams').update({teamname: matchdayGames[j].team2}, {"$inc": {points: 1}});
                    }
                }

                //update goals of players
                for (var j = 0; j < matchdayGames.length; j++)
                {
                    writeGoalsInDB(matchdayGames[j], db);
                }
            }
        }
    });
}

//check every hour if an game passed and results should be generated
setInterval(updateAllPassedGames, 360000);


module.exports = router;