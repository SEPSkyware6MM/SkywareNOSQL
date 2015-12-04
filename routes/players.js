var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/list', function(req, res) {
    var db = req.db;
    var collection = db.get('userlist');
    collection.find({},{},function(e,docs){
        res.json(docs);
    });
});

// Database 1
router.get('/fillDB', function(req, res){
    var mongo = require('mongodb').MongoClient;
    mongo.connect('mongodb://localhost:27017/players', function(err, db){
        console.log("Connected properly.");
        var col = db.collection('players');
        col.insert(
                [
                    {name:"Marc",score:37},
                    {name:"Chris",score:20}
                ],
                    function(err,data){
                        //handle error
                    }
                );
        db.close();
    });
    res.send('Erfolg! DB gefüllt.');
});

module.exports = router;
