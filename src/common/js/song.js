import {getLyric} from 'api/song'
import {ERR_OK} from 'api/config'

export default class Song {
  constructor ({id, mid, singer, name, album, duration, image, url}) {
    this.id = id
    this.mid = mid
    this.singer = singer
    this.name = name
    this.album = album
    this.duration = duration
    this.image = image
    this.url = url
  }

  // 获取歌词
  getLyric () {
    getLyric(this.mid).then(res => {
      if (res.retcode === ERR_OK) {
        this.lyric = res.lyric
        console.log(this.lyric)
      }
    })
  }
}

export function createSong (musicData) {
  return new Song({
    id: musicData.songid,
    mid: musicData.songmid,
    singer: filterSinger(musicData.singer),
    name: musicData.songname,
    album: musicData.albumname,
    duration: musicData.interval,
    image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.albummid}.jpg?max_age=2592000`,
    // 搜索QQ音乐播放的域名 （https://blog.csdn.net/hhzzcc_/article/details/79769386 此篇文章可参考，或者生成vkey （https://blog.csdn.net/lijunhuan/article/details/79761690））
    // url: `http://ws.stream.qqmusic.qq.com/${musicData.songmid}.m4a?fromtag=66`
    url: `http://ws.stream.qqmusic.qq.com/C100${musicData.songmid}.m4a?fromtag=0&guid=126548448`
    // url: `http://dl.stream.qqmusic.qq.com/C100003OUlho2HcRHC.m4a?vkey=44D65CF4F29F47FA13F3AB9B1BF5DBD3BC3A93299A4A269B6BB57D6FEAAEBFF524118428C62C916E1A932D77E173BED87E29EA4EECEB96A1&fromtag=66`
  })
}

function filterSinger (singer) {
  let ret = []
  if (!singer) {
    return ''
  }
  singer.forEach(element => {
    ret.push(element.name)
  })
  return ret.join('/')
}
