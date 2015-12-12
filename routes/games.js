var express = require('express');
var router = express.Router();

//GET home page
router.get('/', function(req,res,next){
    res.render('games', {title: 'Spiele'});
});

// Database 1
//team1 team2 ort saison spieltag datum toreteam1 toreteam2
router.get('/write/fillDB', function(req, res){
    var db = req.db;
    var collection = db.get('teams');
    collection.find({league: 1}, function(err, teams){
        fillDatabaseWithRandomGames(teams);
        res.send("DB erfolgreich gefüllt");
    });

});

/* GET game listing. */
router.get('/list', function(req, res) {
    var db = req.db;
    var collection = db.get('games');
    collection.find({},{},function(e,docs){
        res.json(docs);
    });
});

function fillDatabaseWithRandomGames(arrayWithTeams)
{
    var mongo = require('mongodb').MongoClient;
    mongo.connect('mongodb://localhost:27017/fussballApp', function(err, db){
        console.log("Connected properly.");
        var col = db.collection('games');
        col.insert(
                [
                
                {games:getGamesJson(arrayWithTeams)}
                    
                ],
                    function(err,data){
                        //handle error
                    }
                );
        db.close();
    });
    console.log('Erfolgreich eingefügt');
}

function getGamesJson(arrayWithTeams)
{
    
    var jsonArr = [];
    
    for(var j = 1; j <= 17; j++)
    {
        for(var i = 0; i < 18; i += 2)
        {
        jsonArr.push(
                {
            team1: arrayWithTeams[i].teamname,
            team2: arrayWithTeams[(i+j) % 18].teamname,
            matchday: j,
            location: "ka",
            saison: "2015",
            date: "ka",
            goalsTeam1: getRandomResult(),
            goalsTeam2: getRandomResult()
                });  
        } 
    }
   
    return jsonArr;  
}

function getRandomResult()
{
    return Math.floor((Math.random() * 5) + 1);
}
module.exports = router;