/**
 * 解析URL参数
 * @example ?id=123456&a=b
 * @return Object {id:12345,a:b}
 */
export function urlParse () {
  let url = window.location.search
  let obj = {}
  // 定义正则表达式
  let reg = /[?&][^?&]+=[^?&]+/g
  // 匹配正则表达式
  let arr = url.match(reg)
  // ['?id=12345' '&a=b']
  if (arr) {
    arr.forEach((item) => {
      let tempArr = item.substring(1).split('=')
      let key = decodeURIComponent(tempArr[0])
      let val = decodeURIComponent(tempArr[1])
      obj[key] = val
    })
  }
  return obj
}