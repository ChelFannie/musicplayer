import storage from 'good-storage'

const SEARCH_KEY = '__search__'
const SEARCH_MAX_LEN = 15

/**
 * 在数组的首位插入值
 * @param {Array} arr - 原来数组
 * @param {String} val - 可插入的值
 * @param {function} compare - 跟原数据的比较函数（查找数组中是否存在val这个值）
 * @param {Number} maxLen - 原数组的最大长度
 */
function insertArray (arr, val, compare, maxLen) {
  // 查找待插入的值是否存于数组中
  const index = arr.findIndex(compare)
  // 如果查找到在数组的第一个，则不行操作数组
  if (index === 0) {
    return
  }
  // 如果查找到，则删除原数组中的值，并且插入到首位
  if (index > 0) {
    arr.splice(index, 1)
  }
  arr.unshift(val)
  if (maxLen && arr.length > maxLen) {
    arr.pop()
  }
}

/**
 * 保存搜索的内容
 * @param {String} query - 搜索的内容
 */
export function saveSearch (query) {
  // 使用storage库
  let searches = storage.get(SEARCH_KEY, [])
  // 插入当前输入的值
  insertArray(searches, query, (item) => {
    return item === query
  }, SEARCH_MAX_LEN)
  storage.set(SEARCH_KEY, searches)
  return searches
}

/**
 * 获取本地存储的搜索数据
 */
export function loadSearch () {
  return storage.get(SEARCH_KEY, [])
}

/**
 * 删除数组中的某一项
 * @param {String} query - 对比内容
 */
export function deleteSearch (query) {
  let searches = storage.get(SEARCH_KEY, [])
  deleteFromArray(searches, (item) => {
    return item === query
  })
  storage.set(SEARCH_KEY, searches)
  return searches
}

/**
 * 从数组中删除某项内容
 * @param {Array} arr - 数组
 * @param {function} compare - 比较函数
 */
function deleteFromArray (arr, compare) {
  // 查找待插入的值是否存于数组中
  const index = arr.findIndex(compare)
  if (index > -1) {
    arr.splice(index, 1)
  }
}

export function clearSearch () {
  storage.remove(SEARCH_KEY)
  return []
}
