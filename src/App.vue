<template>
  <div>
    <v-header :seller="seller"></v-header>
    <div class="tab border-1px">
      <div class="tab-item">
        <router-link to="/goods">商品</router-link>
      </div>
      <div class="tab-item">
        <router-link to="/ratings">评论</router-link>
      </div>
      <div class="tab-item">
        <router-link to="/seller">商家</router-link>
      </div>
    </div>
    <!--避免页面重构-->
    <keep-alive>
      <router-view :seller="seller"></router-view>
    </keep-alive>
  </div>
</template>

<script type="text/ecmascript-6">
import header from './components/header/header'
import {urlParse} from './common/js/util'

const ERR_OK = 0
export default {
  data () {
    return {
      // 默认为空值
      seller: {
        id: (() => {
          let queryParm = urlParse()
          return queryParm.id
        })()
      }
    }
  },
  created () {
    // 通过Ajax请求拿到商家数据
    this.$http.get('/api/seller?id='+this.seller.id).then((response) => {
      response = response.body
      if (response.errno === ERR_OK) {
        // 给对象扩展属性
        this.seller = Object.assign({},this.seller,response.data)
        console.log(this.seller.id)
      }
    })
  },
  components: {
    'v-header': header
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "./common/stylus/mixin.styl"
    .tab
      display : flex
      width : 100%
      height: 40px
      line-height : 40px
      //border-bottom : 1px solid rgba(7,17,27,0.1)
      border-1px(rgba(7,17,27,0.1))
      .tab-item
        flex : 1
        text-align : center
        & > a
          display : block
          font-size : 14px
          color: rgb(77,85,93)
          &.active
            color: rgb(240,20,20)
</style>
