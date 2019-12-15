
/**
 * Copyright 2010-2019 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *
 * This file is licensed under the Apache License, Version 2.0 (the "License").
 * You may not use this file except in compliance with the License. A copy of
 * the License is located at
 *
 * http://aws.amazon.com/apache2.0/
 *
 * This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
 * CONDITIONS OF ANY KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations under the License.
*/
var AWS = require("aws-sdk");
var fs = require('fs');
AWS.config.update({
  region: "us-west-2",
  endpoint: "http://localhost:8000",
  accessKeyId:"access123",
    secretAccessKey:"sa123"
});
var allMovies = JSON.parse(fs.readFileSync('MOCK_DATA.json', 'utf8'));
var docClient = new AWS.DynamoDB.DocumentClient();

console.log("Querying for movies from 1985.");
var min=4;
var max=5;
var total=Math.floor(Math.random() * (max - min)) + min
var email =2;
var params = {
    TableName : "SanPham",
    KeyConditionExpression: "#yr = :yyyy",
    ExpressionAttributeNames:{
        "#yr": "Masanpham"
    },
    ExpressionAttributeValues: {
        ":yyyy": email
    }
};


docClient.query(params, function(err, data) {
    if (err) {
        console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
    } else {
        console.log("Query succeeded.");
        console.log("HD"+total);
        data.Items.forEach(function(item) {
            
            console.log(item.Masanpham,item.Loai);
            console.log(data.Items);
            console.log(allMovies[0]);
        });
        
        
        
       
        
    }
    
});
