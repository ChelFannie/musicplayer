// 存储所有的状态
import {playMode} from 'common/js/config'
import {loadSearch, loadPlayHistory} from 'common/js/cache'

const state = {
  singer: {},
  // 播放状态
  playing: false,
  // 全屏播放
  fullScreen: false,
  // 播放列表(可无序)
  playlist: [],
  // 排序播放列表
  sequenceList: [],
  // 播放模式
  mode: playMode.sequence,
  // 当前播放的音乐的索引
  currentIndex: -1,
  // 歌曲详情信息
  disc: {},
  // 排行榜详情信息
  topList: {},
  // 搜索历史
  // searchHistory: []
  // 结合本地存储获取最新的搜索历史的数据
  searchHistory: loadSearch(),
  // 播放历史
  playHistory: loadPlayHistory()
}

export default state
