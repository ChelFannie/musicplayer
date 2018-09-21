// 定义公共的mixin方法，供多个组件使用
import {mapGetters} from 'vuex'

// 获取播放列表
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