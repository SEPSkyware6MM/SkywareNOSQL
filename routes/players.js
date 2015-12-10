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

// Database 1
router.get('/fillDB', function(req, res){
    var mongo = require('mongodb').MongoClient;
    mongo.connect('mongodb://localhost:27017/fussballApp', function(err, db){
        console.log("Connected properly.");
        var col = db.collection('players');
        col.insert(
                [
                    {name:"Misoch", vorname:"Marc",score:37},
                    {name:"Denneberg", vorname:"Chris",score:20}
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
