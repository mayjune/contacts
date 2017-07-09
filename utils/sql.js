/**
 * Created by luffy.kim on 05/07/2017.
 */
var common = require('./common');
var sql = {};

sql.init = function() {
    var sqlite3 = require('sqlite3').verbose();
    var db = new sqlite3.Database('db/contact.db');

    db.serialize(function() {
        db.run("CREATE TABLE if not exists " +
            "contact(" +
            "id INTEGER PRIMARY KEY AUTOINCREMENT, " +
            "name TEXT, " +
            "sex TEXT, " +
            "birthday TEXT, " +
            "month INTEGER, " +
            "phone TEXT, " +
            "first TEXT, " +
            "portrait TEXT, " +
            "description INTEGER " +
            ")");
    });

    db.close();
};

sql.insert = function(data, res) {
    var sqlite3 = require('sqlite3').verbose();
    var db = new sqlite3.Database('db/contact.db');

    var birthday = common.joinDate([data['year1'], data['month1'], data['day1']]);
    var first = common.joinDate([data['year2'], data['month2']]);

    console.log("INSERT into contact(" +
        "name, " +
        "sex, " +
        "birthday, " +
        "month, " +
        "phone, " +
        "first, " +
        "description " +
        ") VALUES (" +
        "\"" + data['name'] + "\"" + "," +
        "\"" + data['sex'] + "\"" + "," +
        "\"" + birthday + "\"" + "," +
        "\"" + data['month1'] + "\"" + "," +
        "\"" + data['phone'] + "\"" + "," +
        "\"" + first + "\"" + "," +
        "\"" + data['description'] + "\"" +
        ")");

    var last_id = '';

    db.run("INSERT into contact(" +
        "name, " +
        "sex, " +
        "birthday, " +
        "month, " +
        "phone, " +
        "first, " +
        "description " +
        ") VALUES (" +
        "\"" + data['name'] + "\"" + "," +
        "\"" + data['sex'] + "\"" + "," +
        "\"" + birthday + "\"" + "," +
        "\"" + data['month1'] + "\"" + "," +
        "\"" + data['phone'] + "\"" + "," +
        "\"" + first + "\"" + "," +
        "\"" + data['description'] + "\"" +
        ")", function (err){

        if (err) {
            console.log('do not insert data')
            console.log(err)
        } else {
            last_id = this.lastID;
            res.redirect('/upload?id='+last_id);
        }
        db.close()
    });
};

sql.delete = function (id) {
    var sqlite3 = require('sqlite3').verbose();
    var db = new sqlite3.Database('db/contact.db');
    var sql_stmt = "delete from contact where id="+id;

    console.log(sql_stmt);
    db.run(sql_stmt);
    db.close();
};

sql.update = function (data) {
    var sqlite3 = require('sqlite3').verbose();
    var db = new sqlite3.Database('db/contact.db');
    var birthday = common.joinDate([data['year1'], data['month1'], data['day1']]);
    var first = common.joinDate([data['year2'], data['month2']]);
    var sql_stmt = "update contact set " +
        "name=\"" + data['name'] + "\", " +
        "sex=\"" + data['sex'] + "\", " +
        "birthday=\"" + birthday + "\", " +
        "month=\"" + data['month1'] + "\", " +
        "phone=\"" + data['phone'] + "\", " +
        "first=\"" + first + "\", " +
        "description=\"" + data['description'] + "\" " +
        "where id=" + data['id'];

    console.log(sql_stmt);
    db.run(sql_stmt);
    db.close();
};

sql.uploadImg = function (img_name, id) {
    var sqlite3 = require('sqlite3').verbose();
    var db = new sqlite3.Database('db/contact.db');
    var sql_stmt = "update contact set " +
        "portrait=\"" + img_name + "\" " +
        "where id=" + id;
    console.log(sql_stmt);
    db.run(sql_stmt);
    db.close();
}

sql.search = function (data) {
    var sqlite3 = require('sqlite3').verbose();
    var db = new sqlite3.Database('db/contact.db');
    var sql_stmt = "select * from contact where name=\"" +
                    data['name'] +
                    "\" ";
    var res = [];
    console.log(sql_stmt);

    db.all(sql_stmt, function (err, rows) {
        if (err) {
            console.log(err)
            db.close()
        } else {
            rows.forEach(function(row) {
                var birthday = split_date(row.birthday);
                var first = split_date(row.first);

                console.log(birthday)
                var d = {
                    name: row.name,
                    sex: row.sex,
                    year1: birthday[0],
                    month1: birthday[1],
                    day1: birthday[2],
                    phone: row.phone,
                    year2: first[0],
                    month2: first[1],
                    description: row.description
                };
                res.push(d);
            });
            console.log(res);
            db.close()
        }
    });
};

module.exports = sql;
