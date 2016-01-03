var express = require('express');
var router = express.Router();

/* GET player listing. */
router.get('/list', function(req, res) {
    var db = req.db;
    var collection = db.get('players');
    collection.find({},{},function(e,docs){
        res.json(docs);
    });
});
 
 //Für Testzwecke hier wird erst die team id von meier geholt, und danach in allen teams geschaut die diese nummer als punktzalh haben
 //proof of concept für zb erst spiele holen und danach die manschaften die darin gespielt haben
router.get('/test', function(req,res)
{
    var db = req.db;
    var testteamid;
    var team;
    var collection = db.get('players');
    collection.find({name: "Meier"}, function(err, cursor){
        testteamid = cursor[0].teamid;
        team = getTeam(testteamid, req, res);
    });
});

function getTeam(testteamid, req, res)
{
    var db = req.db;
    var collection = db.get('teams');
    collection.find({points: testteamid}, function(err, teams){
        res.json(teams);
    });
}

// Database 1
router.put('/write/fillDB', function(req, res){
    var mongo = require('mongodb').MongoClient;
    mongo.connect('mongodb://localhost:27017/fussballApp', function(err, db){
        console.log("Connected properly.");
        var col = db.collection('players');
        col.insert(
                [
                    {name:"Volland", vorname:"Kevin",score:0, teamid:1},
                    {name:"Meier", vorname:"Max",score:20, teamid:2},
                    {name:"Kraft", vorname:"Thomas",score:20, teamid:3},
                    {name:"Reus", vorname:"Marco",score:20, teamid:4},
                    {name:"Pizarro", vorname:"Claudio",score:20, teamid:5},
                    {name:"Zieler", vorname:"Ron-Robert",score:20, teamid:6},
                    {name:"Petersen", vorname:"Nils",score:20, teamid:7},
                    {name:"Holtby", vorname:"Lewis",score:20, teamid:8},
                    {name:"Huntelaar", vorname:"Klaas-Jan",score:20, teamid:9},
                    {name:"Hector", vorname:"Jonas",score:20, teamid:10},
                    {name:"Hitz", vorname:"Marvin",score:20, teamid:11},
                    {name:"Robben", vorname:"Arjen",score:20, teamid:12},
                    {name:"Malli", vorname:"Jonus",score:20, teamid:13},
                    {name:"Harnik", vorname:"Martin",score:20, teamid:14},
                    {name:"Kiesling", vorname:"Stefan",score:20, teamid:15},
                    {name:"Sommer", vorname:"Jan",score:20, teamid:16},
                    {name:"Benaglio", vorname:"Diego",score:20, teamid:17},
                    {name:"Kruse", vorname:"Lukas",score:20, teamid:18}
                    
                ],
                    function(err,data){
                        //handle error
                    }
                );
        db.close();
    });
    console.log('Erfolgreich eingefügt');
    res.send('Erfolg! DB gefüllt.');
});

module.exports = router;
