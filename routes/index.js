var express = require('express');
var sql = require('../utils/sql');
var common = require('../utils/common');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  sql.init()
  res.render('index', { title: 'Express' });
});

/* search */
router.get('/search', function(req, res, next) {
    var qs = req.query;
    var sqlite3 = require('sqlite3').verbose();
    var db = new sqlite3.Database('db/contact.db');

    if (!common.isEmpty(qs)) {
        var q = qs['q'];
        var ddorae = qs['ddorae'];
        var birth = qs['birth'];
        // 기본
        var sql_stmt = "select * from contact ";

        if (ddorae)
            ddorae = common.getList(ddorae);
        if (birth)
            birth = common.getList(birth);

        if (q && birth) {
            sql_stmt += "where ";
            sql_stmt += "name=\"" + q + "\" and ";
            sql_stmt += "month in (" + birth.join(',') + ") ";
        } else if (q) {
            sql_stmt += "where ";
            sql_stmt += "name=\"" + q + "\" ";
        } else if (birth) {
            sql_stmt += "where ";
            sql_stmt += "month in (" + birth.join(',') + ") ";
        }

        sql_stmt += 'order by name';

        console.log(sql_stmt)
        db.all(sql_stmt, function (err, rows) {
            var ret = [];
            if (err) {
                console.log('fail to search: ' + err)
            } else {
                for (var i = 0; i < rows.length; i++) {
                    var d = {
                        name: rows[i].name,
                        sex: rows[i].sex,
                        birth: rows[i].birthday,
                        phone: rows[i].phone,
                        first: rows[i].first,
                        description: rows[i].description,
                        portrait: rows[i].phone+'.png'
                    };

                    if (ddorae) {
                        var age = common.getAge(d['birth']);
                        for (var j = 0; j < ddorae.length; j++) {
                            var start = parseInt(ddorae[j]),
                                end = start + 9;

                            if (start <= age && age <= end) {
                                ret.push(d);
                                break;
                            }
                        }
                    } else {
                        ret.push(d);
                    }
                }
            }
            db.close()
            res.render('search', { query: q, ddorae: ddorae, birth: birth, ret: ret});
        });
    } else {
        res.render('search', { query: '', ddorae: [], birth: [], ret: []});
    }
});

/* create */
router.get('/create', function(req, res, next) {
    var qs = req.query;

    if (!common.isEmpty(qs)) {
        sql.insert(req.query);
    }
    res.render('create', { title: 'Express' });
});

module.exports = router;
