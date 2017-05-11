function formatTime(date) {
    var date = new Date(date)
        // var year = date.getFullYear()
    var month = date.getMonth() + 1
    var day = date.getDate()

    var hour = date.getHours()
    var minute = date.getMinutes()
        // var second = date.getSeconds()

    return [month, day].map(formatNumber).join('-') + ' ' + [hour, minute].map(formatNumber).join(':')
}

function formatNumber(n) {
    n = n.toString()
    return n[1] ? n : '0' + n
}
// 毫秒转换分秒
function formatSeconds(s) {
    var t = '';
    if (s > -1) {
        var min = Math.floor(s / 60) % 60;
        var sec = s % 60;
        if (min < 10) { t += "0"; }
        t += min + ":";
        if (sec < 10) { t += "0"; }
        t += parseInt(sec);
    }
    return t;
}
//远程图片no found情况下指引  
function errImgFun(ev, that) {
    var _errImg = ev.target.dataset.errImg;
    var _errObj = {};
    _errObj[_errImg] = "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1494312702095&di=a23d7b4383c5ce2fcd6848c761b0195e&imgtype=0&src=http%3A%2F%2Fwww.9tnl.com%2Fuploadfile%2Fimage%2F20150810%2F20150810225176647664.jpg";
    that.setData(_errObj);
}
module.exports = {
    formatTime: formatTime,
    formatSeconds: formatSeconds,
    errImgFun: errImgFun
}