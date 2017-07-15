var express = require('express');
var sql = require('../utils/sql');
var common = require('../utils/common');
var multer = require('multer');
var path = require('path');
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/raw') // cb 콜백함수를 통해 전송된 파일 저장 디렉토리 설정
    },
    filename: function (req, file, cb) {
        var date = new Date();
        cb(null, '{}{}{}{}{}{}{}{}'.format(date.getFullYear(),
                                date.getMonth(),
                                date.getDay(),
                                date.getHours(),
                                date.getMinutes(),
                                date.getSeconds(),
                                date.getMilliseconds(),
                                path.extname(file.originalname))) // cb 콜백함수를 통해 전송된 파일 이름 설정
    }
});
var upload = multer({ storage: storage, limits: {fileSize: 5242880} });
var gm = require('gm').subClass({imageMagick: true});
var router = express.Router();

String.prototype.format = function () {
    var i = 0, args = arguments;
    return this.replace(/{}/g, function () {
        return typeof args[i] != 'undefined' ? args[i++] : '';
    });
};

/* GET home page. */
router.get('/', function(req, res, next) {
  sql.init();
  var sess = req.session;

  if (sess.username) {
    res.redirect('/search');
  } else {
    res.render('index', { title: 'Express' });
  }

});

router.get('/login', function (req, res, next) {
    var passwd = req.query.passwd;
    var user_pw = 'zzz';
    var admin_pw = 'kkk';
    var sess = req.session;
    if (passwd == user_pw) {
        sess.username = 'member';
    } else if (passwd == admin_pw) {
        sess.username = 'admin';
    }

    res.redirect('/');
});

router.get('/logout', function (req, res, next) {
    var sess = req.session;
    if(sess.username){
        req.session.destroy(function(err){
            if(err){
                console.log(err);
            }else{
                res.redirect('/');
            }
        })
    }else{
        res.redirect('/');
    }
});

/* search */
router.get('/search', function(req, res, next) {
    var sess = req.session;
    if (!sess.username) {
        res.redirect('/');
    } else {
        var admin = sess.username == 'admin' ? true : false;
        var qs = req.query;
        var sqlite3 = require('sqlite3').verbose();
        var db = new sqlite3.Database('db/contact.db');

        var card = qs['card_yn'],
            card_yn = false;
        if (card == 'on')
            card_yn = true

        if (!common.isEmpty(qs) && common.checkSearch(qs)) {
            var q = qs['q'];
            var ddorae = qs['ddorae'];
            var birth = qs['birth'];
            // 기본
            var sql_stmt = "select * from contact ";

            var ddorae = qs['ddorae'] ? common.getList(qs['ddorae']) : [];
            var birth = qs['birth'] ? common.getList(qs['birth']) : [];

            if (q.length > 0 && birth.length > 0) {
                sql_stmt += "where ";
                sql_stmt += "name=\"" + q + "\" and ";
                sql_stmt += "month in (" + birth.join(',') + ") ";
            } else if (q.length > 0) {
                sql_stmt += "where ";
                sql_stmt += "name=\"" + q + "\" ";
            } else if (birth.length > 0) {
                sql_stmt += "where ";
                sql_stmt += "month in (" + birth.join(',') + ") ";
            }

            sql_stmt += 'order by birthday';

            console.log(sql_stmt)
            db.all(sql_stmt, function (err, rows) {
                var ret = [];
                if (err) {
                    console.log('fail to search: ' + err)
                } else {
                    for (var i = 0; i < rows.length; i++) {
                        var d = {
                            id: rows[i].id,
                            name: rows[i].name,
                            sex: rows[i].sex,
                            birth: rows[i].birthday,
                            phone: rows[i].phone,
                            first: rows[i].first,
                            description: rows[i].description,
                            portrait: rows[i].portrait,
                            age: common.getAge(rows[i].birthday)
                        };

                        if (ddorae.length > 0) {
                            for (var j = 0; j < ddorae.length; j++) {
                                var start = parseInt(ddorae[j]),
                                    end = start + 9;

                                if (start == 50) {
                                    if (start <= d['age']) {
                                        ret.push(d);
                                        break;
                                    }
                                } else {
                                    if (start <= d['age'] && d['age'] <= end) {
                                        ret.push(d);
                                        break;
                                    }
                                }
                            }
                        } else {
                            ret.push(d);
                        }
                    }
                }
                db.close()
                res.render('search', {query: q, ddorae: ddorae, birth: birth,
                    ret: ret, card_yn: card_yn, admin: admin, count: rows.length});
            });
        } else {
            res.render('search', {query: '', ddorae: [], birth: [], ret: [], card_yn: card_yn, admin: admin});
        }
    }
});

/* create */
router.get('/create', function(req, res, next) {
    var sess = req.session;
    if (!sess.username) {
        res.redirect('/');
    } else {
        var qs = req.query;
        if (!common.isEmpty(qs)) {
            sql.insert(req.query, res);
        } else {
            res.render('create', {title: 'Express'});
        }
    }
});

/* edit */
router.get('/edit', function(req, res, next) {
    var sess = req.session;
    var qs = req.query;
    var id = qs['id']

    if (!sess.username || sess.username != 'admin' || common.isEmpty(qs) || !id) {
        res.redirect('/');
    } else {
        var sqlite3 = require('sqlite3').verbose();
        var db = new sqlite3.Database('db/contact.db');
        var sql_stmt = "select * from contact where id=\"" + id + "\"";
        console.log(sql_stmt);

        db.all(sql_stmt, function (err, rows) {
            db.close();
            if (err) {
                console.log('fail to search for edit: ' + err)
                res.redirect('/');
            } else {
                if (rows.length == 1) {
                    var birth = common.splitDate(rows[0].birthday);
                    var first = common.splitDate(rows[0].first);
                    var data = {
                        id: rows[0].id,
                        name: rows[0].name,
                        sex: rows[0].sex,
                        phone: rows[0].phone,
                        description: rows[0].description,
                        portrait: rows[0].phone + '.png',
                        year1: birth[0],
                        month1: birth[1],
                        day1: birth[2],
                        year2: first[0],
                        month2: first[1]
                    };
                } else {
                    console.log('error: no exist id: ' + id);
                    var data = {}
                }
                res.render('edit', {data: data});
            }
        });
    }
});

router.get('/update', function(req, res, next) {
    var sess = req.session;
    if (!sess.username || sess.username != 'admin') {
        res.redirect('/');
    } else {
        var qs = req.query;
        if (!common.isEmpty(qs)) {
            sql.update(req.query);
        }
        res.redirect('/');
    }
});

router.get('/delete', function(req, res, next) {
    var sess = req.session;
    if (!sess.username || sess.username != 'admin') {
        res.redirect('/');
    } else {
        var qs = req.query;
        if (!common.isEmpty(qs)) {
            sql.delete(qs['id']);
        }
        res.redirect('/');
    }
});

router.get('/upload', function(req, res, next) {
    var sess = req.session;
    if (!sess.username) {
        res.redirect('/');
    } else {
        var qs = req.query;
        if (qs['id']) {
            res.render('upload', {id: qs['id']});
        } else {
            res.redirect('/');
        }
    }
});

router.post('/upload', upload.single('userfile'), function(req, res){
    if (req.file) {
        var upload_dir = __dirname +"/../public/uploads";
        gm(upload_dir+'/raw/'+req.file.filename)
            .resize(800, 800, '!')
            .write(upload_dir+'/resize/'+req.file.filename, function (err) {
                if (err) console.error(err)
                else console.log('done')
            });
        sql.uploadImg(req.file.filename, req.body.id);
    }
    res.redirect('/');
});

module.exports = router;
