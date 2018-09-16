<template>
 <div class="recommend">
   <!-- 要等到歌单数据已经返回了，才能初始化滚动插件 -->
   <scroll ref="scroll" class="recommend-content" :data="discList">
     <!-- 使用BScroll实现滚动，都是对组件的第一个元素有效 -->
     <div>
       <!-- 加上v-if的判断是为了保证，在列表元素不为空的情况下，初始化slider组件，保证轮播图的正常滚动 -->
      <div class="slider-wrapper" v-if="recommends.length">
        <slider>
          <div v-for="(item, index) in recommends" :key="index">
            <a :href="item.linkUrl">
              <!-- 如果页面上有一些特定的元素不需要使用fastclick来立刻触发点击事件，可以在元素的class上添加needsclick -->
              <img class="needsclick" :src="item.picUrl" alt="" @load="loadImage">
            </a>
          </div>
        </slider>
      </div>
      <div class="recommend-list">
        <h1 class="list-title">热门歌曲推荐</h1>
        <ul>
          <li v-for="(item, index) in discList" :key="index" class="item">
            <div class="icon">
              <!-- <img width="60" height="60" :src="item.imgurl" alt=""> -->
              <img width="60" height="60" v-lazy="item.imgurl" alt="">
            </div>
            <div class="text">
              <h2 class="name">{{item.creator.name}}</h2>
              <p class="desc">{{item.dissname}}</p>
            </div>
          </li>
        </ul>
      </div>
     </div>

     <div class="loading-container" v-show="!discList.length">
       <loading></loading>
     </div>
   </scroll>
 </div>
</template>

<script>
import Scroll from 'base/scroll/scroll'
import Slider from 'base/slider/slider'
import Loading from 'base/loading/loading'
import {getRecommend, getDiscList} from 'api/recommend.js'
import {ERR_OK} from 'api/config.js'
export default {
  name: 'recommend',
  components: {
    Slider,
    Scroll,
    Loading
  },
  data () {
    return {
      msg: 'recommend',
      // 轮播图列表
      recommends: [],
      discList: [],
      checkLoaded: false
    }
  },
  created () {
    this._getRecommend()
    this._getDiscList()
  },
  methods: {
    // 获取轮播图信息
    _getRecommend () {
      getRecommend().then(res => {
        if (res.code === ERR_OK) {
          this.recommends = res.data.slider
        }
      })
    },
    // 获取歌单列表
    _getDiscList () {
      getDiscList().then(res => {
        if (res.code === ERR_OK) {
          this.discList = res.data.list
        }
      })
    },
    // 解决图片加载缓慢，滚动不能执行的问题
    // 因为轮播图的高度是由图片的高度撑开，所以只要有一张图片加载完全，就重新计算滚动高度
    loadImage () {
      // 只要有一张图片加载完成，就重新计算，其他图片再加载回来，就不用再计算
      if (!this.checkLoaded) {
        this.$refs.scroll.refresh()
        this.checkLoaded = true
      }
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

.recommend
  position: fixed
  width: 100%
  top: 88px
  bottom: 0
  .recommend-content
    height: 100%
    overflow: hidden
    .slider-wrapper
      position: relative
      width: 100%
      overflow: hidden
    .recommend-list
      .list-title
        height: 65px
        line-height: 65px
        text-align: center
        font-size: $font-size-medium
        color: $color-theme
      .item
        display: flex
        box-sizing: border-box
        align-items: center
        padding: 0 20px 20px 20px
        .icon
          flex: 0 0 60px
          width: 60px
          padding-right: 20px
        .text
          display: flex
          flex-direction: column
          justify-content: center
          flex: 1
          line-height: 20px
          overflow: hidden
          font-size: $font-size-medium
          .name
            margin-bottom: 10px
            color: $color-text
          .desc
            color: $color-text-d
    .loading-container
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>
