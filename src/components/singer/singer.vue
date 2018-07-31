<template>
 <div class="singer">
  <list-view :data="singers" @select="selectSinger"></list-view>
  <router-view></router-view>
 </div>
</template>

<script>
import {getSingerList} from 'api/singer.js'
import {ERR_OK} from 'api/config.js'
import Singer from '../../common/js/singer.js'
import ListView from '../../base/listview/listview'
import {mapMutations} from 'vuex'

const HOT_NAME = '热门'
const HOT_SINGER_LEN = 10
export default {
  name: 'singer',
  components: {
    ListView
  },
  data () {
    return {
      msg: 'singer',
      singers: []
    }
  },
  created () {
    this._getSingerList()
  },
  methods: {
    ...mapMutations({
      setSinger: 'SET_SINGER'
    }),
    selectSinger (item) {
      this.$router.push({
        path: `singer/${item.id}`
      })
      this.setSinger(item)
    },
    _getSingerList () {
      getSingerList().then(res => {
        if (res.code === ERR_OK) {
          // this.singers = res.data.list
          // console.log(this._normalizeSinger(this.singers))
          this.singers = this._normalizeSinger(res.data.list)
        }
      })
    },
    // 处理获取的数据，转换为自己需要的格式
    _normalizeSinger (list) {
      let map = {
        // 数据的前十条放在hot里
        hot: {
          title: HOT_NAME,
          items: []
        }
      }
      list.forEach((item, index) => {
        if (index < HOT_SINGER_LEN) {
          // map.hot.push({
          //   name: item.Fsinger_name,
          //   id: item.Fsinger_mid,
          //   // avatar: `https://y.gtimg.cn/music/photo_new/T001R300x300M000${item.Fsinger_mid}.jpg?max_age=2592000`,
          //   avatar: `https://y.gtimg.cn/music/photo_new/T001R150x150M000${item.Fsinger_mid}.jpg?max_age=2592000`
          // })
          // 因为avatar都是根据id变化而变化的，所以可以抽象类，再使用Singer类
          map.hot.items.push(new Singer({
            name: item.Fsinger_name,
            id: item.Fsinger_mid
          }))
        }
        const key = item.Findex
        if (!map[key]) {
          map[key] = {
            title: key,
            items: []
          }
        }
        // map[key].items.push({
        //     name: item.Fsinger_name,
        //     id: item.Fsinger_mid,
        //     // avatar: `https://y.gtimg.cn/music/photo_new/T001R300x300M000${item.Fsinger_mid}.jpg?max_age=2592000`,
        //     avatar: `https://y.gtimg.cn/music/photo_new/T001R150x150M000${item.Fsinger_mid}.jpg?max_age=2592000`
        // })
        // 使用Singer类
        map[key].items.push(new Singer({
          name: item.Fsinger_name,
          id: item.Fsinger_mid
        }))
      })
      // console.log(map)
      // 以上结果得到的是一个对象，但是因为vue遍历对象是无序的，所以要换成有序的数组
      let hot = []
      let ret = []
      for (let key in map) {
        let val = map[key]
        if (val.title.match(/[a-zA-Z]/)) {
          ret.push(val)
        } else if (val.title === HOT_NAME) {
          hot.push(val)
        }
      }
      ret.sort((a, b) => {
        return a.title.charCodeAt(0) - b.title.charCodeAt(0)
      })
      return hot.concat(ret)
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
.singer
  position fixed
  top 88px
  bottom 0
  width 100%
</style>
