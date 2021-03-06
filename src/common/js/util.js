/**
 * 获取随机数
 * @param {Number} min - 最小值
 * @param {Number} max - 最大值
 */
function getRandomInt (min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

/**
 * 将数组随机排序
 * @param {Array} arr
 */
export function shuffle (arr) {
  // 避免操作时，影响原来的数组
  let _arr = arr.slice()
  for (let i = 0; i < _arr.length; i++) {
    let tempIndex = getRandomInt(0, i)
    let temp = _arr[i]
    _arr[i] = _arr[tempIndex]
    _arr[tempIndex] = temp
  }
  return _arr
}

/**
 * 截流频繁向后台发送请求
 * @param {Function} func - 被截流的函数
 * @param {Number} delay - 延迟时间
 */
export function debounce (func, delay) {
  let timer

  return function (...args) {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      func.apply(this, args)
    }, delay)
  }
}
