import jsonp from 'common/js/jsonp'
import {commonParams, options} from './config'
import axios from 'axios'

// 获取热门搜索词
export function getHotKey () {
  const url = 'https://c.y.qq.com/splcloud/fcgi-bin/gethotkey.fcg'
  const data = Object.assign({}, commonParams, {
    platform: 'h5',
    uin: 0,
    needNewCode: 1
  })
  return jsonp(url, data, options)
}

/**
 * 获取搜索结果
 * @param {String} query - 搜索内容
 * @param {Number} page - 页数
 * @param {Boolean} zhida - 是否显示歌手
 * @param {Number} perpage - 条数
 */
export function search (query, page, zhida, perpage) {
  const url = '/api/search'

  const data = Object.assign({}, commonParams, {
    w: query,
    p: page,
    perpage,
    n: perpage,
    catZhida: zhida ? 1 : 0,
    zhidaqu: 1,
    t: 0,
    flag: 1,
    ie: 'utf-8',
    sem: 1,
    aggr: 0,
    remoteplace: 'txt.mqq.all',
    uin: 0,
    needNewCode: 1,
    platform: 'h5'
  })

  return axios.get(url, {
    params: data
  }).then(res => {
    return Promise.resolve(res.data)
  })
}
