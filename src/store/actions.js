// 用于对mutations操作或者异步操作
import * as types from './mutation-types'
import {shuffle} from 'common/js/util'
import {playMode} from 'common/js/config'
import {saveSearch, deleteSearch, clearSearch, savePlay} from 'common/js/cache'

function findIndex (list, song) {
  return list.findIndex(item => item.id === song.id)
}

// 在歌曲列表中选择歌曲播放
export const selectPlay = function ({commit, state}, {list, index}) {
  commit(types.SET_SEQUENCE_LIST, list)
  // 设置currentIndex和playList时，需要判断是不是随机播放模式
  if (state.mode === playMode.random) {
    let randomList = shuffle(list)
    commit(types.SET_PLAYLIST, randomList)
    index = findIndex(randomList, list[index])
  } else {
    commit(types.SET_PLAYLIST, list)
  }
  commit(types.SET_CURRENT_INDEX, index)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYING_STATE, true)
}

// 点击歌曲中的随机播放按钮
export const randomPlay = function ({commit}, {list}) {
  commit(types.SET_PLAY_MODE, playMode.random)
  commit(types.SET_SEQUENCE_LIST, list)
  let randomList = shuffle(list)
  commit(types.SET_PLAYLIST, randomList)
  commit(types.SET_CURRENT_INDEX, 0)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYING_STATE, true)
}

// 插入歌曲
export const insertSong = function ({commit, state}, song) {
  // 使用slice方法浅拷贝数据，避免因为操作playlist影响vuex，引起报错
  // 播放列表
  let playlist = state.playlist.slice()
  let sequenceList = state.sequenceList.slice()
  // 当前播放歌曲的索引
  let currentIndex = state.currentIndex

  // 记录当前歌曲
  let currentSong = playlist[currentIndex]
  // 查找插入歌曲是否存在播放列表中
  let fpIndex = findIndex(playlist, song)
  // 因为是插入歌曲，所以索引+1
  currentIndex++
  // 插入歌曲
  playlist.splice(currentIndex, 0, song)

  // 如果插入的歌曲已经存在，就删除原列表中的歌曲
  if (fpIndex > -1) {
    // 如果插入歌曲的位置，在原歌曲的后面
    if (currentIndex > fpIndex) {
      playlist.splice(fpIndex, 1)
      currentIndex--
    } else {
      // 如果插入歌曲的位置，在原歌曲的前面
      playlist.splice(fpIndex + 1, 1)
    }
  }

  // 查找当前播放歌曲在sequenceList中的位置
  let currentSIndex = findIndex(sequenceList, currentSong)
  // 查找插入歌曲是否存在sequenceList中
  let fsIndex = findIndex(sequenceList, song)

  // 插入歌曲
  sequenceList.splice(currentSIndex, 0, song)
  // 如果插入的歌曲已经存在，就删除原列表中的歌曲
  if (fsIndex > -1) {
    // 如果插入歌曲的位置，在原歌曲的后面
    if (currentSIndex > fsIndex) {
      sequenceList.splice(fsIndex, 1)
      currentSIndex--
    } else {
      // 如果插入歌曲的位置，在原歌曲的前面
      sequenceList.splice(fsIndex + 1, 1)
    }
  }

  commit(types.SET_PLAYLIST, playlist)
  commit(types.SET_SEQUENCE_LIST, sequenceList)
  commit(types.SET_CURRENT_INDEX, currentIndex)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYING_STATE, true)
}

// 保存搜索历史
export const saveSearchHistory = function ({commit}, query) {
  commit(types.SET_SEARCH_HISTORY, saveSearch(query))
}

// 删除某一行的搜索历史
export const deleteSearchHistory = function ({commit}, query) {
  commit(types.SET_SEARCH_HISTORY, deleteSearch(query))
}

// 删除某一行的搜索历史
export const clearSearchHistory = function ({commit}, query) {
  commit(types.SET_SEARCH_HISTORY, clearSearch(query))
}

// 删除播放列表中的歌曲
export const deleteSong = function ({commit, state}, song) {
  let playlist = state.playlist.slice()
  let sequenceList = state.sequenceList.slice()
  let currentIndex = state.currentIndex
  // 查找到当前点击的歌曲在列表中的索引
  let fpIndex = findIndex(playlist, song)
  playlist.splice(fpIndex, 1)
  let sIndex = findIndex(sequenceList, song)
  sequenceList.splice(sIndex, 1)
  if (fpIndex < currentIndex || currentIndex === playlist.length) {
    currentIndex--
  }
  commit(types.SET_PLAYLIST, playlist)
  commit(types.SET_SEQUENCE_LIST, sequenceList)
  commit(types.SET_CURRENT_INDEX, currentIndex)
  if (!playlist.length) {
    commit(types.SET_PLAYING_STATE, false)
  } else {
    commit(types.SET_PLAYING_STATE, true)
  }
}

// 清空播放列表
export const clearSongList = function ({commit}) {
  commit(types.SET_CURRENT_INDEX, -1)
  commit(types.SET_PLAYLIST, [])
  commit(types.SET_SEQUENCE_LIST, [])
  commit(types.SET_PLAYING_STATE, false)
}

// 保存播放历史
export const savePlayHistory = function ({commit}, song) {
  commit(types.SET_PLAY_HISTORY, savePlay(song))
}
