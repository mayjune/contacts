/**
 * Created by luffy.kim on 05/07/2017.
 */

var common = {};

common.isEmpty = function (obj) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
};

common.joinDate = function(date) {
    return date.join('.');
};

common.splitDate = function(date) {
    return date.split('.');
};

common.getList = function(args) {
    if (Array.isArray(args))
        return args;
    else
        return [args];
};

common.getAge = function(date) {
    var current_year = new Date().getFullYear();
    var year = parseInt(common.splitDate(date)[0]);
    return age = current_year - year + 1;

};

common.checkSearch = function (qs) {
    var key;
    var l = [];
    for (key in qs) {
        l.push(key)
    }

    if (l.length == 1 && ((l[0] == 'q' && l[0].length == 0) || l[0] == 'card_yn'))
        return false;
    else
        return true;
}

/*
Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};
*/


module.exports = common;
