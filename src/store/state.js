// 存储所有的状态
import {playMode} from '../common/js/config'

const state = {
  singer: {},
  playing: false,
  fullScreen: false,
  // 播放列表(可无序)
  playlist: [],
  // 排序播放列表
  sequenceList: [],
  // 播放模式
  mode: playMode.sequence,
  // 当前播放的音乐的索引
  currentIndex: -1
}

export default state
