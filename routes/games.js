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

        for (var i = 1; i <= 34; i++)
        {
            col.insert(
                    [
                        {
                            matchday: i,
                            played: 0,
                            games: getGamesJson(arrayWithTeams, i)
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

//Returns one Matchday of Games
function getGamesJson(arrayWithTeams, matchday)
{
 //TODO FUNKTIONIERT NICHT RICHTIG MUSS FÜR LIGA 2 NOCH GEMACHT WERDEN
    var jsonArr = [];
    if(matchday === 1)
    {
        dateOfMatchdayFirstHalf = new Date(2015, 7, 15, 15, 30);
        dateOfMatchdaySecondHalf = new Date(2016, 1, 23, 15, 30);
    }
    
    if (matchday <= 17)
    {
        for (var i = 0; i < 18; i += 2)
        {
            //Hinspiele
            jsonArr.push(
                    {                 
                        team1: arrayWithTeams[i].teamname,
                        team2: arrayWithTeams[(i + matchday) % 18].teamname,
                        location: arrayWithTeams[i].location,
                        saison: dateOfMatchdayFirstHalf.getFullYear() + "/" + dateOfMatchdaySecondHalf.getFullYear(),
                        date: dateOfMatchdayFirstHalf.toString(),
                        goalsTeam1: -1,
                        goalsTeam2: -1
                    });
        }
        //add one week after all matches are played
        dateOfMatchdayFirstHalf.setDate((dateOfMatchdayFirstHalf.getDate() + 7));
    }
    else if(matchday > 18)
    {      
        for (var i = 0; i < 18; i += 2)
        {
        //Rückspiel
        jsonArr.push(
                {                 
                    team1: arrayWithTeams[(i + matchday) % 18].teamname,
                    team2: arrayWithTeams[i].teamname,
                    location: arrayWithTeams[(i + matchday) % 18].location,
                    saison: dateOfMatchdayFirstHalf.getFullYear() + "/" + dateOfMatchdaySecondHalf.getFullYear(),
                    date: dateOfMatchdaySecondHalf.toString(),
                    goalsTeam1: -1,
                    goalsTeam2: -1
                });
        } 
        //add one week after all matches are played
        dateOfMatchdaySecondHalf.setDate((dateOfMatchdaySecondHalf.getDate() + 7));
    }
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
    
    db.get('games').update({ matchday: actualMatchDay }, { "$set": {played: 1} });
    
    //update Matches with random results
    for(var i = 0; i < 9; i++)
    {
        var query1= {};
        var name1 = "games." + i + ".goalsTeam1";
        query1[name1] = getRandomResult();
        
        var query2= {};
        var name2 = "games." + i + ".goalsTeam2";
        query2[name2] = getRandomResult();
        
        db.get('games').update({ matchday: actualMatchDay }, { "$set": query1 });
        db.get('games').update({ matchday: actualMatchDay }, { "$set": query2 });
        
    }
    //update points per team
    db.get('games').find({ matchday: actualMatchDay }, function (e, games) {
        var matchdayGames = games[0].games;
        for (var i = 0; i < matchdayGames.length; i++)
        {
            if (matchdayGames[i].goalsTeam1 > matchdayGames[i].goalsTeam2)
            {
                    db.get('teams').update({ teamname: matchdayGames[i].team1 }, { "$inc": { points: 3 } });
            }
            else if (matchdayGames[i].goalsTeam1 < matchdayGames[i].goalsTeam2)
            {
                    db.get('teams').update({ teamname: matchdayGames[i].team2 }, { "$inc": { points: 3 } });
            }
            else if (matchdayGames[i].goalsTeam1 === matchdayGames[i].goalsTeam2)
            {
                    db.get('teams').update({ teamname: matchdayGames[i].team1 }, { "$inc": { points: 1 } });
                    db.get('teams').update({ teamname: matchdayGames[i].team2 }, { "$inc": { points: 1 } });
            }	 
        }
    });
    
    
    res.send("Erfolgreich geändert");
}

module.exports = router;