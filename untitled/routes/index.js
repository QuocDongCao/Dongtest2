var express = require('express');
var router = express.Router();
var AWS = require("aws-sdk");
var fs = require('fs');

AWS.config.update({
    region: "us-west-2",
    accessKeyId:"access123",
    secretAccessKey:"sa123",
    endpoint: "http://localhost:8000"
});
var docClient = new AWS.DynamoDB.DocumentClient();
/* GET home page. */
router.get('/', function(req, res, next) {
    var params = {
        TableName: "SanPham",
        ProjectionExpression: "Masanpham, Tensanpham, Gia, Hinh,Thongtin",
        FilterExpression: "#yr between :start_yr and :end_yr",
        ExpressionAttributeNames: {
            "#yr": "Masanpham",
        },
        ExpressionAttributeValues: {
            ":start_yr": 1,
            ":end_yr": 5
        }
    };

    console.log("Scanning Movies table.");
    docClient.scan(params, onScan);

    function onScan(err, data) {
        if (err) {
            console.error("Unable to scan the table. Error JSON:", JSON.stringify(err, null, 2));
        } else {
            // print all the movies
            console.log("Scan succeeded.");
            data.Items.forEach(function(sp) {
                console.log(
                    sp.Masanpham+ ": ",
                    sp.Tensanpham, "- Gia:", sp.Gia+ ": ",sp.Hinh+ ": "+sp.Thongtin

                );
                res.render('index', {list:data.Items});
            });

            // continue scanning if we have more movies, because
            // scan can retrieve a maximum of 1MB of data
            if (typeof data.LastEvaluatedKey != "undefined") {
                console.log("Scanning for more...");
                params.ExclusiveStartKey = data.LastEvaluatedKey;
                docClient.scan(params, onScan);
            }
        }
    }

});

router.get('/signin', function(req, res, next) {
  res.render('signin', { title: 'Express' });
});

router.get('/cart', function(req, res, next) {
    res.render('cart', { title: 'Express' });
});

router.get('/singleproduct/:Masanpham', function(req, res, next){
    var Masanpham=parseInt(req.params.Masanpham);
    console.log("Querying for movies from 1985.");
    var para = {
        TableName : "SanPham",
        KeyConditionExpression: "#yr = :yyyy",
        ExpressionAttributeNames:{
            "#yr": "Masanpham"
        },
        ExpressionAttributeValues: {
            ":yyyy": Masanpham
        }
    };

    docClient.query(para, function(err, data) {
        if (err) {
            console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
        } else {
            console.log("Query succeeded.");
            data.Items.forEach(function(item) {
                console.log(" -", item.Masanpham + ": " + item.Tensanpham );
            });
            res.render('singleproduct', {item: data.Items[0]});
            //res.send(data.Items[0]);
        }
    });
});

module.exports = router;
