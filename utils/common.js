/**
 * Created by luffy.kim on 05/07/2017.
 */

var common = {}

common.isEmpty = function (obj) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
}

common.joinDate = function(date) {
    return date.join('.');
}

common.splitDate = function(date) {
    return date.split('.');
}

common.getList = function (args) {
    if (Array.isArray(args))
        return args;
    else
        return [args];
}


module.exports = common;
