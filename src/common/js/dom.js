/**
 * 判断是否需要给元素添加className
 * @param {*} el - 操作的元素
 * @param {*} className - 元素的类
 */
export function addClass (el, className) {
  // 如果有当前类，则不添加，没有就添加
  if (hassClass(el, className)) {
    return
  }
  let newClass = el.className.split(' ')
  newClass.push(className)
  el.className = newClass.join(' ')
}

/**
 * 判断元素是否含有某个className
 * @param {*} el - 操作的元素
 * @param {*} className - 元素的类
 */
export function hassClass (el, className) {
  let reg = new RegExp('(^|\\s)' + className + '(\\s|$)')
  return reg.test(el.className)
}

/**
 * 获取或者设置元素的自定义属性
 * @param {*} el - 元素
 * @param {*} name  - 自定义属性名称
 * @param {*} val  - 设置的值
 */
export function getData (el, name, val) {
  const prefix = 'data-'
  // 如果有传入设置的值，则设置元素的自定义属性的值，如果没有，就是获取元素自定义属性的值
  if (val) {
    return el.setAttribute(prefix + name, val)
  } else {
    return el.getAttribute(prefix + name)
  }
}

/**
 * 处理css兼容
 * 要先进行能力检测（创建一个元素，检测支持哪个样式类型）
 */
let elementStyle = document.createElement('div').style

let vendor = (() => {
  let transformNames = {
    webkit: 'webkitTransform',
    Moz: 'MozTransform',
    O: 'OTransform',
    ms: 'msTransform',
    standard: 'transform'
  }

  for (let key in transformNames) {
    if (elementStyle[transformNames[key]] !== undefined) {
      return key
    }
  }
  return false
})()

export function prefixStyle (style) {
  if (vendor === false) {
    return false
  }
  if (vendor === 'standard') {
    return style
  }
  return vendor + style.charAt(0).toUpperCase() + style.substr(1)
}
