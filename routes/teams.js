var express = require('express');
var router = express.Router();


//GET home page
router.get('/', function(req,res,next){
    res.render('teams', {title: 'teams'});
})

/* GET player listing. */
router.get('/list', function(req, res) {
    var db = req.db;
    var collection = db.get('teams');
    collection.find({},{},function(e,docs){
        res.json(docs);
    });
});

// Database 1
router.get('/fillDB', function(req, res){
    var mongo = require('mongodb').MongoClient;
    mongo.connect('mongodb://localhost:27017/fussballApp', function(err, db){
        console.log("Connected properly.");
        var col = db.collection('teams');
        col.insert(
                [
                    {teamname:"TSG 1899 Hoffenheim",icon:"http://www.openligadb.de/images/teamicons/TSG_Hoffenheim.gif"},
                    {teamname:"Eintracht Frankfurt",icon:"http://www.openligadb.de/images/teamicons/Eintracht_Frankfurt.gif"},
                    {teamname:"Hertha BSC",icon:"http://www.openligadb.de/images/teamicons/Hertha_BSC.gif"},
                    {teamname:"Borussia Dortmund",icon:"http://www.openligadb.de/images/teamicons/Borussia_Dortmund.gif"},
                    {teamname:"Werder Bremen",icon:"http://www.openligadb.de/images/teamicons/werder_bremen.gif"},
                    {teamname:"Hannover 96",icon:"http://www.openligadb.de/images/teamicons/Hannover_96.gif"},
                    {teamname:"SC Freiburg",icon:"http://www.openligadb.de/images/teamicons/SC_Freiburg.gif"},
                    {teamname:"Hamburger SV",icon:"http://www.openligadb.de/images/teamicons/Hamburger_SV.gif"},
                    {teamname:"FC Schalke 04",icon:"http://www.openligadb.de/images/teamicons/FC_Schalke_04.gif"},
                    {teamname:"1. FC Köln",icon:"http://www.openligadb.de/images/teamicons/1_FC_Koeln.gif"},
                    {teamname:"FC Augsburg",icon:"http://www.openligadb.de/images/teamicons/FC_Augsburg.gif"},
                    {teamname:"Bayern München",icon:"http://www.openligadb.de/images/teamicons/Bayern_Muenchen.gif"},
                    {teamname:"1. FSV Mainz 05",icon:"http://www.openligadb.de/images/teamicons/1_FSV_Mainz_05.gif"},
                    {teamname:"VfB Stuttgart",icon:"http://www.openligadb.de/images/teamicons/VfB_Stuttgart.gif"},
                    {teamname:"Bayer 04 Leverkusen",icon:"http://www.openligadb.de/images/teamicons/Bayer_Leverkusen.gif"},
                    {teamname:"Borussia Mönchengladbach",icon:"http://www.openligadb.de/images/teamicons/Bor_Moenchengladbach.gif"},
                    {teamname:"VfL Wolfsburg",icon:"http://www.openligadb.de/images/teamicons/VfL_Wolfsburg.gif"},
                    {teamname:"SC Paderborn 07",icon:"http://www.openligadb.de/images/teamicons/SC_Paderborn_07.gif"}
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
