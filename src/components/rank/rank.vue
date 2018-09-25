<template>
 <div class="rank" ref="rank">
  <scroll class="toplist" :data="topList" ref="toplist">
    <ul>
      <li class="item" v-for="(item, index) in topList" :key="index">
        <div class="icon">
          <img v-lazy="item.picUrl" alt="" width="100" height="100">
        </div>
        <ul class="songlist">
          <li class="song" v-for="(songs, index1) in item.songList" :key="index1">
            <span>{{index1 + 1}}</span>
            <span>{{songs.singername}} - {{songs.songname}}</span>
          </li>
        </ul>
      </li>
    </ul>
    <div class="loading-container" v-show="!topList.length">
      <loading></loading>
    </div>
  </scroll>
 </div>
</template>

<script>
import {getTopList} from '../../api/rank.js'
import {ERR_OK} from 'api/config'
import Scroll from 'base/scroll/scroll'
import Loading from 'base/loading/loading'
import {playlistMixin} from 'common/js/mixins.js'

export default {
  name: 'rank',
  mixins: [playlistMixin],
  components: {
    Scroll,
    Loading
  },
  data () {
    return {
      // 排行榜列表
      topList: []
    }
  },
  created () {
    this._getTopList()
  },
  methods: {
    // 获取排行榜数据
    _getTopList () {
      getTopList().then(res => {
        if (res.code === ERR_OK) {
          // console.log(res.data.topList)
          this.topList = res.data.topList
        }
      })
    },
    // 当小播放器播放时，改变页面的bottom值
    handlePlaylist (playlist) {
      const bottom = playlist.length > 0 ? '60px' : 0
      this.$refs.rank.style.bottom = bottom
      this.$refs.toplist.refresh()
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .rank
    position: fixed
    width: 100%
    top: 88px
    bottom: 0
    .toplist
      height: 100%
      overflow: hidden
      .item
        display: flex
        margin: 0 20px
        padding-top: 20px
        height: 100px
        &:last-child
          padding-bottom: 20px
        .icon
          flex: 0 0 100px
          width: 100px
          height: 100px
          // border 2px solid #575757
          // box-sizing border-box
        .songlist
          flex: 1
          display: flex
          flex-direction: column
          justify-content: center
          padding: 0 20px
          height: 100px
          overflow: hidden
          background: $color-highlight-background
          color: $color-text-d
          font-size: $font-size-small
          .song
            no-wrap()
            line-height: 26px
    .loading-container
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>
