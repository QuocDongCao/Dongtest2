
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
    accessKeyId:"access123",
    secretAccessKey:"sa123",
    endpoint: "http://localhost:8000"
});

var docClient = new AWS.DynamoDB.DocumentClient();

console.log("Importing movies into DynamoDB. Please wait.");

var allMovies = JSON.parse(fs.readFileSync('MOCK_DATA.json', 'utf8'));
allMovies.forEach(function(sp) {
    var params = {
        TableName: "SanPham",
        Item: {
            "Masanpham":sp.Masanpham,
            "Tensanpham": sp.Tensanpham,
            "Gia":  sp.Gia,
            "Thongtin":sp.Thongtin,
            "Hinh":sp.Hinh
        }
    };

    docClient.put(params, function(err, data) {
        if (err) {
            console.error("Unable to add movie", sp.Tensanpham, ". Error JSON:", JSON.stringify(err, null, 2));
        } else {
            console.log("PutItem succeeded:", sp.Masanpham);
        }
    });
});

var all = JSON.parse(fs.readFileSync('user.json', 'utf8'));
all.forEach(function(us) {
    var params1 = {
        TableName: "Nguoidung",
        Item: {
            "name":us.name,
            "phone":us.phone,
            "id":us.id,
            "email":us.email,
            "pass":us.pass

        }
    };

    docClient.put(params1, function(err, data) {
        if (err) {
            console.error("Unable to add movie", us.email, ". Error JSON:", JSON.stringify(err, null, 2));
        } else {
            console.log("PutItem succeeded:",us.pass);
        }
    });
});
