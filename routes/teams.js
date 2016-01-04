var express = require('express');
var router = express.Router();


//GET home page
router.get('/', function(req,res,next){
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
router.put('/write/fillDB', function(req, res){
    var mongo = require('mongodb').MongoClient;
    mongo.connect('mongodb://localhost:27017/fussballApp', function(err, db){
        console.log("Connected properly.");
        var col = db.collection('teams');
        col.insert(
                [
                    {teamname:"TSG 1899 Hoffenheim",shortname:"HOF",icon:"/images/TSG_Hoffenheim.gif",players:getRandomTeamMembers(), league:1, points:0, location:"Hoffenheim"},
                    {teamname:"Eintracht Frankfurt",shortname:"EFR",icon:"images/Eintracht_Frankfurt.gif",players: getRandomTeamMembers(), league:1, points:0, location:"Frankfurt"},
                    {teamname:"Hertha BSC",shortname:"BSC",icon:"images/Hertha_BSC.gif",players: getRandomTeamMembers(), league:1, points:0, location:"Berlin"},
                    {teamname:"Borussia Dortmund",shortname:"BOR",icon:"images/Borussia_Dortmund.gif", players: getRandomTeamMembers(), league:1, points:0, location:"Dortmund"},
                    {teamname:"Werder Bremen",shortname:"WBR",icon:"images/werder_bremen.gif", players: getRandomTeamMembers(), league:1, points:0, location:"Bremen"},
                    {teamname:"Hannover 96",shortname:"H69",icon:"images/Hannover_96.gif", players: getRandomTeamMembers(), league:1, points:0, location:"Hannover"},
                    {teamname:"FC Ingolstadt",shortname:"FCI",icon:"images/20px-FC-Ingolstadt_logo.svg.png", players: getRandomTeamMembers(), league:1, points:0, location:"Ingolstadt"},
                    {teamname:"Hamburger SV",shortname:"HSV",icon:"images/Hamburger_SV.gif", players: getRandomTeamMembers(), league:1, points:0, location:"Hamburg"},
                    {teamname:"FC Schalke 04",shortname:"S04",icon:"images/FC_Schalke_04.gif", players: getRandomTeamMembers(), league:1, points:0, location:"Gelsenkirchen"},
                    {teamname:"1. FC Köln",shortname:"1FC",icon:"images/1_FC_Koeln.gif", players: getRandomTeamMembers(), league:1, points:0, location:"Köln"},
                    {teamname:"FC Augsburg",shortname:"FCA",icon:"images/FC_Augsburg.gif", players: getRandomTeamMembers(), league:1, points:0, location:"Augsburg"},
                    {teamname:"Bayern München",shortname:"BAY",icon:"images/Bayern_Muenchen.gif", players: getRandomTeamMembers(), league:1, points:0, location:"München"},
                    {teamname:"1. FSV Mainz 05",shortname:"FSV",icon:"images/1_FSV_Mainz_05.gif", players: getRandomTeamMembers(), league:1, points:0, location:"Mainz"},
                    {teamname:"VfB Stuttgart",shortname:"VFB",icon:"images/VfB_Stuttgart.gif", players: getRandomTeamMembers(), league:1, points:0, location:"Stuttgart"},
                    {teamname:"Bayer 04 Leverkusen",shortname:"B04",icon:"images/Bayer_Leverkusen.gif", players: getRandomTeamMembers(), league:1, points:0, location:"Leverkusen"},
                    {teamname:"Borussia Mönchengladbach",shortname:"MGL",icon:"images/Bor_Moenchengladbach.gif", players: getRandomTeamMembers(), league:1, points:0, location:"Mönchengladbach"},
                    {teamname:"VfL Wolfsburg",shortname:"VFL",icon:"images/VfL_Wolfsburg.gif", players: getRandomTeamMembers(), league:1, points:0, location:"Wolfsburg"},
                    {teamname:"SV Darmstadt 98",shortname:"SVD",icon:"images/SV_Darmstadt_98.gif", players: getRandomTeamMembers(), league:1, points:0, location:"Darmstadt"},
                    {teamname:"Karslruher SC",shortname:"KSC",icon:"images/Karlsruher_SC.gif",players:getRandomTeamMembers(), league:2, points:0, location:"Karlsruhe"},
                    {teamname:"SV Sandhausen",shortname:"SVS",icon:"images/SV_Sandhausen.svg.png",players: getRandomTeamMembers(), league:2, points:0, location:"Sandhausen"},
                    {teamname:"VFL Bochum",shortname:"VFB",icon:"images/VfL_Bochum.gif",players: getRandomTeamMembers(), league:2, points:0, location:"Bochum"},
                    {teamname:"FC Union Berlin",shortname:"FCU",icon:"images/1_FC_Union_Berlin.gif", players: getRandomTeamMembers(), league:2, points:0, location:"Berlin"},
                    {teamname:"Arminia Bielefeld",shortname:"ARM",icon:"images/Arminia_Bielefeld.gif", players: getRandomTeamMembers(), league:2, points:0, location:"Bilefeld"},
                    {teamname:"Red Bull Leipzig",shortname:"RBL",icon:"images/1583.png", players: getRandomTeamMembers(), league:2, points:0, location:"Leipzig"},
                    {teamname:"TSV 1860 München",shortname:"1860",icon:"images/TSV_1860_Muenchen.gif", players: getRandomTeamMembers(), league:2, points:0, location:"München"},
                    {teamname:"FC St Pauli",shortname:"STP",icon:"images/FC_St_Pauli.gif", players: getRandomTeamMembers(), league:2, points:0, location:"Hamburg"},
                    {teamname:"SC Freiburg",shortname:"SCF",icon:"images/SC_Freiburg.gif", players: getRandomTeamMembers(), league:2, points:0, location:"Freiburg"},
                    {teamname:"SC Paderborn",shortname:"SCP",icon:"images/SC_Paderborn_07.gif", players: getRandomTeamMembers(), league:2, points:0, location:"Paderborn"},
                    {teamname:"1 FC Heidenheim",shortname:"FCH",icon:"images/1-fc-heidenheim.png", players: getRandomTeamMembers(), league:2, points:0, location:"Heidenheim"},
                    {teamname:"SpVgg Greuther Fürth",shortname:"GRF",icon:"images/SpVgg_Greuther_Fuerth.gif", players: getRandomTeamMembers(), league:2, points:0, location:"Greuther Fürth"},
                    {teamname:"1. FC Kaiserslautern",shortname:"FSV",icon:"images/1_FC_Kaiserslautern.gif", players: getRandomTeamMembers(), league:2, points:0, location:"Kaiserslautern"},
                    {teamname:"FSV Frankfurt",shortname:"FSV",icon:"images/20px-FSV_Frankfurt_1899.svg.png", players: getRandomTeamMembers(), league:2, points:0, location:"Frankfurt"},
                    {teamname:"1 FC Nürnberg",shortname:"FCN",icon:"images/1_FC_Nuernberg.gif", players: getRandomTeamMembers(), league:2, points:0, location:"Nürnberg"},
                    {teamname:"Eintracht Braunschweig",shortname:"EBR",icon:"images/Eintracht_Braunschweig.gif", players: getRandomTeamMembers(), league:2, points:0, location:"Braunschweig"},
                    {teamname:"Fortuna Düsseldorf",shortname:"FOR",icon:"images/20x20_fortuna-duesseldorf.png", players: getRandomTeamMembers(), league:2, points:0, location:"Düsseldorf"},
                    {teamname:"MSV Duisburg",shortname:"MSV",icon:"images/MSV_Duisburg.gif", players: getRandomTeamMembers(), league:2, points:0, location:"Duisburg"}
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
            firstname: getRandomString(),
            lastname: getRandomString(),
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
