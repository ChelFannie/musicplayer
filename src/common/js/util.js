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
  for (let i = 0; i < arr.length; i++) {
    let tempIndex = getRandomInt(0, i)
    let temp = arr[i]
    arr[i] = arr[tempIndex]
    arr[tempIndex] = temp
  }
  return arr
}
