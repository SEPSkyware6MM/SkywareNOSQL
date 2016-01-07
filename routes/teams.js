/*
 * Project: 
 * Skyware NOSQL FussballProjekt
 * Autoren:
 * Marc Misoch
 * Chris Denneberg
 */

var express = require('express');
var router = express.Router();
var http = require('http');


//GET home page
router.get('/', function (req, res, next) {
    res.render('teams', {title: 'Teams'});
});

//Delete all Teams in Database
router.delete('/', function (req, res, next) {
    var db = req.db;
    var collection = db.get('teams');
    collection.drop();
    res.send("Teams erfolgreich gelöscht");
});


/* GET team listing. */
router.get('/list', function (req, res) {
    var db = req.db;
    var collection = db.get('teams');
    collection.find({}, {}, function (e, docs) {
        res.json(docs);
    });
});


//Get Team by Name
router.get('/:shortname', function (req, res) {
    var db = req.db;
    var collection = db.get('teams');
    var teamToFind = req.params.shortname;
    collection.find({"shortname": teamToFind}, function (e, docs)
    {
        res.json(docs);
    });
});

// Database 1
router.put('/write/fillDB', function (req, res) {
    getBundesliga(394, 1);
    getBundesliga(395, 2);
});

//394: 1st bundesliga
//395: 2nd bundesliga
function getBundesliga(apiLeagueCode, ourLeagueCode) {
    var options = {
        host: 'api.football-data.org',
        path: '/alpha/soccerseasons/' + apiLeagueCode + '/teams',
        method: 'GET',
        headers: {
            "X-Auth-Token": "a82824561ee84c5a80980c1c6c2f8b48"
        }

    };

    http.get(options, function (res) {
        var response = "";
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
            response += chunk;
        });
        res.on("end", function ()
        {
            var bundesliga = JSON.parse(response);
            for (var i = 0; i < bundesliga.teams.length; i++) {
                insertTeam(bundesliga.teams[i].name, bundesliga.teams[i].code, bundesliga.teams[i].crestUrl, bundesliga.teams[i]._links.players.href, bundesliga.teams[i].shortName, ourLeagueCode);
            }
        });
    });
}

function insertTeam(name, shortname, icon, link, city, ourLeagueCode) {
    var jsonArr;
    var firstPartOfLink = link.split('/')[2];
    var options = {
        host: firstPartOfLink,
        path: link.replace('http://'+firstPartOfLink, ''),
        method: 'GET',
        headers: {
            "X-Auth-Token": "a82824561ee84c5a80980c1c6c2f8b48"
        }

    };

    http.get(options, function (res) {
        var response = "";
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
            response += chunk;
        });
        res.on("end", function ()
        {
            var team = JSON.parse(response);
            var players = team.players;
            jsonArr = [];
            for (var j = 0; j < players.length; j++)
            {
                var names = players[j].name.split(' ');
                var firstname = "";
                for (var i = 0; i < names.length - 1; i++)
                {
                    if (i !== 0)
                    {
                        firstname += " " + names[i];
                    }
                    else
                    {
                        firstname += names[i];
                    }
                }
                
                var position = "default";
                if(players[j].position === "Keeper")
                {
                    position = "Torwart";
                }
                else if(players[j].position.includes("Back"))
                {
                    position = "Verteidiger";
                }
                else if(players[j].position.includes("Midfield") || players[j].position.includes("Wing"))
                {
                    position = "Mittelfeld";
                }
                else if(players[j].position.includes("Forward") || players[j].position.includes("Striker"))
                {
                    position = "Stürmer";
                }
                
                
                jsonArr.push(
                        {
                            firstname: firstname,
                            lastname: names[names.length - 1],
                            score: 0,
                            position: position
                        });
            };
            
            if(shortname === null)
            {
                shortname = "placeholder";
            }
            var mongo = require('mongodb').MongoClient;
            mongo.connect('mongodb://localhost:27017/fussballApp', function (err, db) {
                var col = db.collection('teams');
                col.insert(
                        [
                            {teamname: name, shortname: shortname, icon: icon, players: jsonArr, league: ourLeagueCode, points: 0, location: city}
                        ],
                        function (err, data) {
                            //handle error
                        }
                );
                db.close();
            });
        });
    });
}

module.exports = router;
