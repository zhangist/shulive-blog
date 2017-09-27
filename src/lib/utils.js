/**
* @param {String} string
* @param {Number} targetLength
* @return {String}             Return convert result
*/
function addZeros(str, targetLength = 2) {
  let strRes = str;
  while (str.length < targetLength) {
    strRes = `0${strRes}`;
  }
  return strRes;
}

/**
* @param  {obj} object
* @param  {String} format
* @return {String}           Return format result
*/
const dateFormat = (obj, fmt = 'YYYY-MM-DD hh:mm:ss') => {
  let newFmt = fmt;
  const o = {
    'M+': obj.getMonth() + 1, // 月份
    'd+': obj.getDate(), // 日
    'h+': obj.getHours(), // 小时
    'm+': obj.getMinutes(), // 分
    's+': obj.getSeconds(), // 秒
    'q+': Math.floor((obj.getMonth() + 3) / 3), // 季度
    S: obj.getMilliseconds(), // 毫秒
  };
  if (/(y+)/.test(newFmt)) {
    newFmt = newFmt.replace(RegExp.$1, (`${obj.getFullYear()}`).substr(4 - RegExp.$1.length));
  }
  Object.entries(o).forEach((item) => {
    if (new RegExp(`(${item[0]})`).test(newFmt)) {
      newFmt = newFmt.replace(RegExp.$1, (RegExp.$1.length === 1)
        ? (item[1]) : ((`00${item[1]}`).substr((`${item[1]}`).length)));
    }
  }, this);
  return newFmt;
};

/**
* @param  {String} dateStr
* @return {Number}         Return timestamp
*/
function parseTimestamp(dateStr) {
  const rShortMatch = /^\s*(\d{4})-(\d{1,2})-(\d{1,2})\s*$/;
  const rLongMatch = /^\s*(\d{4})-(\d{1,2})-(\d{1,2})\s+(\d{1,2}):(\d{1,2}):(\d{1,2})\s*$/;
  let match;
  let timestamp;

  if (dateStr.match(rShortMatch)) {
    match = dateStr.match(rShortMatch);
    timestamp = +new Date(+match[1], +match[2] - 1, +match[3]);
  } else if (dateStr.match(rLongMatch)) {
    match = dateStr.match(rLongMatch);
    timestamp = +new Date(+match[1], +match[2] - 1, +match[3], +match[4], +match[5], +match[6]);
  }
  return timestamp;
}

module.exports = {
  dateFormat,
  parseTimestamp,
  addZeros,
};
