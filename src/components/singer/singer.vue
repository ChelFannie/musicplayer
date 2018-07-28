<template>
 <div class="singer">
  {{msg}}
 </div>
</template>

<script>
import {getSingerList} from 'api/singer.js'
import {ERR_OK} from 'api/config.js'
import Singer from '../../common/js/singer.js'

const HOT_NAME = '热门'
const HOT_SINGER_LEN = 10
export default {
  name: 'singer',
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
    _getSingerList () {
      getSingerList().then(res => {
        if (res.code === ERR_OK) {
          this.singers = res.data.list
          this._normalizeSinger(this.singers)
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
