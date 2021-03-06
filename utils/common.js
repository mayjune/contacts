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
    for (key in qs) {
        if (key == 'q' && qs[key].length > 0)
            return true;
        else if (key == 'ddorae' && qs[key].length > 0)
            return true;
        else if (key == 'birth' && qs[key].length > 0)
            return true;
    }

    return false;
}

module.exports = common;
