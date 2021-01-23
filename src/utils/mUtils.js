/**
 * 对象数组根据指定属性去重，return回 去重后的数组
 * @param {*} arr 原始数组
 * @param {*} key 去重的key值
 */
export const ArrdeWeight = (arr, key) => {
  // 缓存用于记录
  const cache = [];
  for (const t of arr) {
    // 检查缓存中是否已经存在
    if (cache.find((c) => c[key] === t[key])) {
      // 已经存在说明以前记录过，现在这个就是多余的，直接忽略
      continue;
    }
    // 不存在就说明以前没遇到过，把它记录下来
    cache.push(t);
  }

  // 记录结果就是过滤后的结果
  return cache;
};

export const removeNull = (option) => {
  if (!option) {
    return;
  }
  for (var attr in option) {
    if (option[attr] === null) {
      delete option[attr];
      continue;
    }
    if (typeof option[attr] == "object") {
      removeNull(option[attr]);
    }
  }
  return option;
};

/**
 * 判断两个字符串之间相似程度，用于填空题中正确答案与用户答案对比
 * @param {*} s
 * @param {*} t
 * @param {*} f
 */
export const similar = (s, t, f) => {
  if (!s || !t) {
    return 0;
  }
  var l = s.length > t.length ? s.length : t.length;
  var n = s.length;
  var m = t.length;
  var d = [];
  f = f || 3;
  var min = function (a, b, c) {
    return a < b ? (a < c ? a : c) : b < c ? b : c;
  };
  var i, j, si, tj, cost;
  if (n === 0) return m;
  if (m === 0) return n;
  for (i = 0; i <= n; i++) {
    d[i] = [];
    d[i][0] = i;
  }
  for (j = 0; j <= m; j++) {
    d[0][j] = j;
  }
  for (i = 1; i <= n; i++) {
    si = s.charAt(i - 1);
    for (j = 1; j <= m; j++) {
      tj = t.charAt(j - 1);
      if (si === tj) {
        cost = 0;
      } else {
        cost = 1;
      }
      d[i][j] = min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + cost);
    }
  }
  let res = 1 - d[n][m] / l;
  return res.toFixed(f);
};

/**
 * @param {*} date 具体日期变量
 * @param {string} dateType 需要返回类型
 * @return {string} dateText 返回为指定格式的日期字符串
 */
export const getFormatDate = (date, dateType = "yyyy-mm-dd MM:mm:ss") => {
  let dateObj = new Date(date);
  let month = dateObj.getMonth() + 1;
  let strDate = dateObj.getDate();
  let hours = dateObj.getHours();
  let minutes = dateObj.getMinutes();
  let seconds = dateObj.getSeconds();
  if (month >= 1 && month <= 9) {
    month = "0" + month;
  }
  if (strDate >= 0 && strDate <= 9) {
    strDate = "0" + strDate;
  }
  if (hours >= 0 && hours <= 9) {
    hours = "0" + hours;
  }
  if (minutes >= 0 && minutes <= 9) {
    minutes = "0" + minutes;
  }
  if (seconds >= 0 && seconds <= 9) {
    seconds = "0" + seconds;
  }

  let dateText =
    dateObj.getFullYear() +
    "年" +
    (dateObj.getMonth() + 1) +
    "月" +
    dateObj.getDate() +
    "日";
  if (dateType == "yyyy-mm-dd") {
    dateText =
      dateObj.getFullYear() +
      "-" +
      (dateObj.getMonth() + 1) +
      "-" +
      dateObj.getDate();
  }
  if (dateType == "yyyy.mm.dd") {
    dateText =
      dateObj.getFullYear() +
      "." +
      (dateObj.getMonth() + 1) +
      "." +
      dateObj.getDate();
  }
  if (dateType == "yyyy-mm-dd MM:mm:ss") {
    dateText =
      dateObj.getFullYear() +
      "-" +
      month +
      "-" +
      strDate +
      " " +
      hours +
      ":" +
      minutes +
      ":" +
      seconds;
  }
  if (dateType == "mm-dd MM:mm:ss") {
    dateText =
      month + "-" + strDate + " " + hours + ":" + minutes + ":" + seconds;
  }
  if (dateType == "yyyy年mm月dd日 MM:mm:ss") {
    dateText =
      dateObj.getFullYear() +
      "年" +
      month +
      "月" +
      strDate +
      "日" +
      " " +
      hours +
      ":" +
      minutes +
      ":" +
      seconds;
  }
  return dateText;
};
