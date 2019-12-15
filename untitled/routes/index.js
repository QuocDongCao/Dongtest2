var express = require('express');
var router = express.Router();
var AWS = require("aws-sdk");
var fs = require('fs');
var Cart=require('../models/cart');
var products = JSON.parse(fs.readFileSync('MOCK_DATA.json', 'utf8'));

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
            ":end_yr": 100000,
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

router.get('/add/:Masanpham', function(req, res, next) {

    var productId = parseInt(req.params.Masanpham);
    var cart = new Cart(req.session.cart ? req.session.cart : {});

    var params = {
        TableName : "SanPham",
        KeyConditionExpression: "#yr = :yyyy",
        ExpressionAttributeNames:{
            "#yr": "Masanpham"
        },
        ExpressionAttributeValues: {
            ":yyyy": productId
        }
    };
    
    
    docClient.query(params, function(err, data) {
        if (err) {
            console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
        } else {
            console.log("Query succeeded.");
            
            data.Items.forEach(function(item) {
                
                console.log(item.Masanpham);
                
            });
            cart.add(data.Items[0], productId);
            req.session.cart = cart;
            res.redirect('/cart');
            
   
        }
        
    });
    

    // var product = products.filter(function(item) {
    //   return item.Masanpham == productId;
    // });
    
    
   

    
  });

router.get('/cart', function(req, res, next) {
    console.log('im herre');

    if (!req.session.cart) {
        console.log('im herre 1');
        return res.render('cart', {
          list: null,
          products: null,
          totalPrice:null
        });
      }
      
      console.log('im herre');
      var cart = new Cart(req.session.cart);
      res.render('cart', {
        list: cart.getItems(),
        totalPrice: cart.totalPrice
      });
}); 

router.get('/remove/:Masanpham', function(req, res, next) {
    var productId = req.params.Masanpham;
    var cart = new Cart(req.session.cart ? req.session.cart : {});
  
    cart.remove(productId);
    req.session.cart = cart;
    res.redirect('/cart');
  });

  router.get('/update', function(req, res, next) {
    var productId = req.query.Masanpham;
    var quantity =req.query.quantity;
    console.log(productId +"-"+quantity);
    var cart = new Cart(req.session.cart ? req.session.cart : {});
  
    cart.update(productId,quantity);
    req.session.cart = cart;
    res.redirect('/cart');
   console.log(soluong);
  });


router.get('/check', function(req, res, next) {
    res.render('check', { title: 'Express' });
  });

  router.post('/check',function(req,res,next){
    var cart = new Cart(req.session.cart ? req.session.cart : {});
    var data = cart.getItems();
    var table = "Donhang";

    var min=10000;
    var max=90000;
var id=Math.floor(Math.random() * (max - min)) + min;
    var ten = req.body.ten;
    var ct = req.body.country;
    var dc = req.body.diachi;
    var sdt = req.body.dt;
    var email = req.body.dcemail;


var params = {
    TableName:table,
    Item:{
        "madonhang": id,
        "tenkhach":ten,
        "country":ct,
        "diachi":dc,
        "sdt":sdt,
        "email":email,
        "cart":data
       
    }
};

console.log("Adding a new item...");
docClient.put(params, function(err, data) {
    if (err) {
        console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
        console.log(id);
        console.log(ten);
        console.log(ct);
        console.log(dc);
        console.log(sdt);
        console.log(email);
        console.log(data);
    } else {
        console.log("Added item:", JSON.stringify(data, null, 2));
        req.session.cart = {};
        res.redirect('/');
        console.log(id);
        console.log(ten);
    }
});
  })
 ////Trang Admin
  router.get('/login', function(req, res, next) {
    res.render('admin/login',{ title: ' '  });
  });

  router.get('/admin', function(req, res, next) {
    res.render('admin/admin');
  });

  router.post('/login', function(req, res, next) {//phải dùng post để nó thao trên trang login 
    var email =req.body.email; //lấy từ input html <input name="">
    var pass=req.body.pass;//lấy từ input html  <input name="">
    var params = {
        TableName : "Nguoidung",
        KeyConditionExpression: "#yr = :yyyy and #xr = :xxxx",
        ExpressionAttributeNames:{
            "#yr": "email",
            "#xr": "pass"
        },
        ExpressionAttributeValues: {
            ":yyyy": email,
            ":xxxx": pass
        }
    };
    
    docClient.query(params, function(err, data) {
        if (err ) {
            console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
             
            }
            
        else {
            console.log("Query succeeded.");
            console.log(email);
            console.log(pass);
            if(data.Items.length!=0){//Tim xem doan nhập vô có trong data ko 
            data.Items.forEach(function(item) {
                console.log(" -", item.pass,item.email,item.id );
                res.redirect('admin');//có chuyển tới trang admin(trang quản lý)
                
        });
            }
            else{
                console.log("Không Thấy");
                res.redirect('login');//không thấy trở về login
                
            }
    }
        
    });
  });
  router.get('/listsp', function(req, res, next) {
    var params = {
        TableName: "SanPham",
        ProjectionExpression: "Masanpham, Tensanpham, Gia, Hinh,Thongtin",
        FilterExpression: "#yr between :start_yr and :end_yr",
        ExpressionAttributeNames: {
            "#yr": "Masanpham",
        },
        ExpressionAttributeValues: {
            ":start_yr": 1,
            ":end_yr": 100000
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
                res.render('admin/listsp', {ds:data.Items});
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
//Nhấn nút edit vào trang chi tiết sp
router.get('/chitietsp/:Masanpham', function(req, res, next) {
    var msp =parseInt(req.params.Masanpham); //lấy từ input html <input name="">
    
    //lấy từ input html  <input name="">
    var params = {
        TableName : "SanPham",
        KeyConditionExpression: "#yr = :yyyy ",
        ExpressionAttributeNames:{
            "#yr": "Masanpham"
            
            
        },
        ExpressionAttributeValues: {
            ":yyyy": msp,
            
        }
    };
    
    docClient.query(params, function(err, data) {
        if (err ) {
            console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
             
            }
            
        else {
            console.log("Query succeeded.");
            
            if(data.Items.length!=0){//Tim xem doan nhập vô có trong data ko 
            data.Items.forEach(function(item) {
                console.log(" -", item.Masanpham,item.Tensanpham );
                res.render('admin/chitietsp',{item:data.Items[0]});;//có chuyển tới trang admin(trang quản lý)
        });
            }
            
    }
        
    });
  });
//Sửa sản phẩm
  router.post('/chitietsp/:Masanpham', function(req, res, next) {

    var table = "SanPham";
    var msp=parseInt(req.body.msp);
    var tsp=req.body.tsp;

    var params = {
        TableName:table,
        Key:{
            "Masanpham": msp,
            "Tensanpham": tsp
        },
        UpdateExpression: "set Gia = :r,Hinh = :p , Thongtin=:a",
        ExpressionAttributeValues:{
            ":r":req.body.gia,
            ":p":req.body.hinh,
            ":a":req.body.thongtin
        },
        ReturnValues:"UPDATED_NEW"
    };
    console.log("Updating the item...");
docClient.update(params, function(err, data) {
    if (err) {
        console.error("Unable to update item. Error JSON:", JSON.stringify(err, null, 2));
        console.log(msp);
        console.log(tsp);
        
        console.log(req.body.hinh)
        console.log(req.body.thongtin)
    } else {
        console.log("UpdateItem succeeded:", JSON.stringify(data, null, 2));
        console.log(msp);
        console.log(tsp);
        console.log(req.body.hinh);
        console.log(tsp)
        console.log(tsp)
        res.redirect('/listsp')
    }
});


  });
//Thêm sản phẩm
  router.get('/themsp', function(req, res, next) {
    res.render('admin/themsp', { title: 'Express' });
  });

  router.post('/themsp', function(req, res, next) {
    var table = "SanPham";

    var min=10000;
    var max=90000;
var id=Math.floor(Math.random() * (max - min)) + min
    var sp = req.body.sp;

var params = {
    TableName:table,
    Item:{
        "Masanpham": id,
        "Tensanpham": sp
    }
};

console.log("Adding a new item...");
docClient.put(params, function(err, data) {
    if (err) {
        console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
        console.log(id);
        console.log(sp);
    } else {
        console.log("Added item:", JSON.stringify(data, null, 2));
        res.redirect('/listsp');
        console.log(id);
        console.log(sp);
    }
});
  });
  //Nhấn nút xóa sản phẩm
  router.get('/listsp/:Masanpham/:Tensanpham', function(req, res, next) {
    var table = "SanPham";
    var id=parseInt(req.params.Masanpham);
    var sp=req.params.Tensanpham;
var params = {
    TableName:table,
    Key:{
        "Masanpham": id,
        "Tensanpham": sp
    },
    
};
console.log("Attempting a conditional delete...");
docClient.delete(params, function(err, data) {
    if (err) {
        console.error("Unable to delete item. Error JSON:", JSON.stringify(err, null, 2));
        console.log(id);
        console.log(sp);
    } else {
        console.log("DeleteItem succeeded:", JSON.stringify(data, null, 2));
        res.redirect('/listsp');
    }
});
  });

  router.get('/donhang', function(req, res, next) {
    var params = {
        TableName: "Donhang",
        ProjectionExpression: "madonhang,tenkhach,country,sdt,cart",
        FilterExpression: "#yr between :start_yr and :end_yr",
        ExpressionAttributeNames: {
            "#yr": "madonhang",
        },
        ExpressionAttributeValues: {
            ":start_yr": 1,
            ":end_yr": 100000
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
                    sp.madonhang+ ": ",
                    sp.tenkhach, "- Gia:", sp.diachi+ ": ",sp.sdt+ ": "+sp.cart

                );
                res.render('admin/donhang', {ds:data.Items});
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

  router.get('/ttdonhang/:madonhang', function(req, res, next) {
    var msp =parseInt(req.params.madonhang); //lấy từ input html <input name="">
    
    //lấy từ input html  <input name="">
    var params = {
        TableName : "Donhang",
        KeyConditionExpression: "#yr = :yyyy ",
        ExpressionAttributeNames:{
            "#yr": "madonhang"
            
            
        },
        ExpressionAttributeValues: {
            ":yyyy": msp,
            
        }
    };
    
    docClient.query(params, function(err, data) {
        if (err ) {
            console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
             
            }
            
        else {
            console.log("Query succeeded.");
            
            if(data.Items.length!=0){//Tim xem doan nhập vô có trong data ko 
            data.Items.forEach(function(item) {
                console.log(" -", item.madonhang,item.tenkhach );
                res.render('admin/ttdonhang',{cart:data.Items});;//có chuyển tới trang admin(trang quản lý)
        });
            }
            
    }
        
    });
  });

  router.get('/donhang/:madonhang/:tenkhach', function(req, res, next) {
    var table = "Donhang";
    var id=parseInt(req.params.madonhang);
    var sp=req.params.tenkhach;
var params = {
    TableName:table,
    Key:{
        "madonhang": id,
        "tenkhach": sp
    },
    
};
console.log("Attempting a conditional delete...");
docClient.delete(params, function(err, data) {
    if (err) {
        console.error("Unable to delete item. Error JSON:", JSON.stringify(err, null, 2));
        console.log(id);
        console.log(sp);
    } else {
        console.log("DeleteItem succeeded:", JSON.stringify(data, null, 2));
        res.redirect('/donhang');
    }
});
  });


module.exports = router;
