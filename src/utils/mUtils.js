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


export const removeNull=(option)=>{
  if(!option){
      return;
  }
  for(var attr in option){
      if(option[attr] === null){
          delete option[attr];
          continue;
      }
      if(typeof(option[attr]) == "object"){
          removeNull(option[attr]);
      }
  }
  return option
}