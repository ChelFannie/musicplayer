// 定义公共的mixin方法，供多个组件使用
import {mapGetters, mapMutations, mapActions} from 'vuex'
import {playMode} from 'common/js/config.js'
import {shuffle} from 'common/js/util.js'

// 小播放器存在
export const playlistMixin = {
  computed: {
    ...mapGetters([
      'playlist'
    ])
  },
  watch: {
    playlist (newVal) {
      this.handlePlaylist(newVal)
    }
  },
  mounted () {
    this.handlePlaylist(this.playlist)
  },
  activated () {
    this.handlePlaylist(this.playlist)
  },
  methods: {
    // 如果组件引入了当前的mixin方法，但组件中没有定义这个方法，组件会报错
    handlePlaylist () {
      throw new Error('component must implement handlePlaylist method')
    }
  }
}

// 公共的歌曲播放模式切换逻辑
export const playerMixin = {
  computed: {
    ...mapGetters([
      'fullScreen',
      'playlist',
      'currentSong',
      'playing',
      'currentIndex',
      'mode',
      'sequenceList'
    ]),
    // 播放模式样式
    iconMode () {
      return this.mode === playMode.sequence ? 'icon-sequence' : (this.mode === playMode.loop ? 'icon-loop' : 'icon-random')
    }
  },
  methods: {
    ...mapMutations({
      setPlayingState: 'SET_PLAYING_STATE',
      setCurrentIndex: 'SET_CURRENT_INDEX',
      setMode: 'SET_MODE',
      setPlayList: 'SET_PLAYLIST'
    }),
    // 更改播放模式
    changeMode () {
      // 修改样式
      const mode = (this.mode + 1) % 3
      this.setMode(mode)
      // 修改歌曲列表
      let list = null
      if (mode === playMode.random) {
        list = shuffle(this.sequenceList)
      } else {
        list = this.sequenceList
      }
      // 更改播放模式后，需要重置currentIndex 注意要先重置currentIndex
      this.resetCurrentIndex(list)
      this.setPlayList(list) // 因为此处改变了currentSong,如果歌曲是暂停状态，切换播放模式，歌曲会播放
    },
    // 重置currentIndex
    resetCurrentIndex (list) {
      const index = list.findIndex(item => item.id === this.currentSong.id)
      this.setCurrentIndex(index)
    }
  }
}

// 公共的搜索框和搜索历史
export const searchMixin = {
  data () {
    return {
      // 查询内容
      query: ''
    }
  },
  computed: {
    ...mapGetters([
      'searchHistory'
    ])
  },
  methods: {
    ...mapActions([
      'saveSearchHistory'
    ]),
    // 点击热门搜索词,设置输入框内容
    addQuery (query) {
      this.$refs.searchBox.setQuery(query)
    },
    // 接受子组件值
    onQueryChange (query) {
      this.query = query
    },
    // 列表滚动之前，让输入框失去焦点
    blurInput () {
      this.$refs.searchBox.blur()
    },
    // 保存搜索的内容
    saveSearch () {
      this.saveSearchHistory(this.query)
    }
  }
}
