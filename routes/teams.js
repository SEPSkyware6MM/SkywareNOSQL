var express = require('express');
var router = express.Router();


//GET home page
router.get('/', function(req,res,next){
    res.render('teams', {title: 'teams'});
});

/* GET team listing. */
router.get('/list', function(req, res) {
    var db = req.db;
    var collection = db.get('teams');
    collection.find({},{},function(e,docs){
        res.json(docs);
    });
});


//Get Team by Name
router.get('/:shortname',function(req, res){
    var db = req.db;
    var collection = db.get('teams');
    var teamToFind = req.params.shortname;
    collection.find({"shortname": teamToFind},function(e,docs)
    {
        res.json(docs);
    });
});

// Database 1
router.get('/write/fillDB', function(req, res){
    var mongo = require('mongodb').MongoClient;
    mongo.connect('mongodb://localhost:27017/fussballApp', function(err, db){
        console.log("Connected properly.");
        var col = db.collection('teams');
        col.insert(
                [
                    {teamname:"TSG 1899 Hoffenheim",shortname:"HOF",icon:"http://www.openligadb.de/images/teamicons/TSG_Hoffenheim.gif",players:getRandomTeamMembers(), liga:1, punkte:0},
                    {teamname:"Eintracht Frankfurt",shortname:"EFR",icon:"http://www.openligadb.de/images/teamicons/Eintracht_Frankfurt.gif",players: getRandomTeamMembers(), liga:1, punkte:0},
                    {teamname:"Hertha BSC",shortname:"BSC",icon:"http://www.openligadb.de/images/teamicons/Hertha_BSC.gif",players: getRandomTeamMembers(), liga:1, punkte:0},
                    {teamname:"Borussia Dortmund",shortname:"BOR",icon:"http://www.openligadb.de/images/teamicons/Borussia_Dortmund.gif", players: getRandomTeamMembers(), liga:1, punkte:0},
                    {teamname:"Werder Bremen",shortname:"WBR",icon:"http://www.openligadb.de/images/teamicons/werder_bremen.gif", players: getRandomTeamMembers(), liga:1, punkte:0},
                    {teamname:"Hannover 96",shortname:"H69",icon:"http://www.openligadb.de/images/teamicons/Hannover_96.gif", players: getRandomTeamMembers(), liga:1, punkte:0},
                    {teamname:"SC Freiburg",shortname:"SCF",icon:"http://www.openligadb.de/images/teamicons/SC_Freiburg.gif", players: getRandomTeamMembers(), liga:1, punkte:0},
                    {teamname:"Hamburger SV",shortname:"HSV",icon:"http://www.openligadb.de/images/teamicons/Hamburger_SV.gif", players: getRandomTeamMembers(), liga:1, punkte:0},
                    {teamname:"FC Schalke 04",shortname:"S04",icon:"http://www.openligadb.de/images/teamicons/FC_Schalke_04.gif", players: getRandomTeamMembers(), liga:1, punkte:0},
                    {teamname:"1. FC Köln",shortname:"1FC",icon:"http://www.openligadb.de/images/teamicons/1_FC_Koeln.gif", players: getRandomTeamMembers(), liga:1, punkte:0},
                    {teamname:"FC Augsburg",shortname:"FCA",icon:"http://www.openligadb.de/images/teamicons/FC_Augsburg.gif", players: getRandomTeamMembers(), liga:1, punkte:0},
                    {teamname:"Bayern München",shortname:"BAY",icon:"http://www.openligadb.de/images/teamicons/Bayern_Muenchen.gif", players: getRandomTeamMembers(), liga:1, punkte:0},
                    {teamname:"1. FSV Mainz 05",shortname:"FSV",icon:"http://www.openligadb.de/images/teamicons/1_FSV_Mainz_05.gif", players: getRandomTeamMembers(), liga:1, punkte:0},
                    {teamname:"VfB Stuttgart",shortname:"VFB",icon:"http://www.openligadb.de/images/teamicons/VfB_Stuttgart.gif", players: getRandomTeamMembers(), liga:1, punkte:0},
                    {teamname:"Bayer 04 Leverkusen",shortname:"B04",icon:"http://www.openligadb.de/images/teamicons/Bayer_Leverkusen.gif", players: getRandomTeamMembers(), liga:1, punkte:0},
                    {teamname:"Borussia Mönchengladbach",shortname:"MGL",icon:"http://www.openligadb.de/images/teamicons/Bor_Moenchengladbach.gif", players: getRandomTeamMembers(), liga:1, punkte:0},
                    {teamname:"VfL Wolfsburg",shortname:"VFL",icon:"http://www.openligadb.de/images/teamicons/VfL_Wolfsburg.gif", players: getRandomTeamMembers(), liga:1, punkte:0},
                    {teamname:"SC Paderborn 07",shortname:"SCP",icon:"http://www.openligadb.de/images/teamicons/SC_Paderborn_07.gif", players: getRandomTeamMembers(), liga:1, punkte:0}
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

function getRandomTeamMembers()
{
    var jsonArr = [];
    for(var i = 0; i < 20; i++)
    {
        jsonArr.push(
                {
            name: getRandomString(),
            vorname: getRandomString(),
            score: 0
                });           
    }    
    return jsonArr;  
}

function getRandomString()
{
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

    for( var i=0; i < 8; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

module.exports = router;
