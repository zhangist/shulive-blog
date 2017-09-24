const dateFormat = (obj, fmt) => {
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

exports.dateFormat = dateFormat;
