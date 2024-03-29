<template>
  <div class="ratings" ref="ratings">
    <!--评分内容区-->
    <div class="ratings-content">
      <!--商家评分区-->
      <div class="overview">
         <!--左半区-->
         <div class="overview-left">
           <!--评分-->
           <h1 class="score">{{seller.score}}</h1>
           <div class="title">综合评分</div>
           <div class="rank">高于周边商家{{seller.rankRate}}%</div>
         </div>
         <!--右半区-->
         <div class="overview-right">
           <!--服务态度-->
           <div class="score-wrapper">
             <span class="title">服务态度</span>
             <star :size="36" :score="seller.serviceScore"></star>
             <span class="score">{{seller.serviceScore}}</span>
           </div>
           <!--商品评分-->
           <div class="score-wrapper">
             <span class="title">商品评分</span>
             <star :size="36" :score="seller.foodScore"></star>
             <span class="score">{{seller.foodScore}}</span>
           </div>
           <!--送达时间-->
           <div class="delivery-wrapper">
             <span class="title">送达时间</span>
             <span class="delivery">{{seller.deliveryTime}}分钟</span>
           </div>
         </div>
       </div>
      <!--分割区-->
      <split></split>
      <!--评论-->
      <ratingselect @ratingtype="selectRatingType" @contentToggle="selectContentToggle"
                    :select-type="selectType" :only-content="onlyContent" :ratings="ratings"></ratingselect>
      <!--详细评论列表-->
      <div class="rating-wrapper">
         <ul>
           <li v-for="rating in ratings" class="rating-item border-1px" v-show="needShow(rating.rateType,rating.text)">
             <!--左区块-->
             <div class="avatar">
               <img :src="rating.avatar" width="28" height="28" alt="">
             </div>
             <!--右区块-->
             <div class="content">
               <!--用户名-->
               <h1 class="name">{{rating.username}}</h1>
               <!--星数-->
               <div class="star-wrapper">
                 <star :size="24" :score="rating.score"></star>
                 <span class="delivery" v-show="rating.deliveryTime">{{rating.deliveryTime}}分钟送达</span>
               </div>
               <!--内容-->
               <p class="text">{{rating.text}}</p>
               <!--引用-->
               <div class="recommend" v-show="rating.recommend && rating.recommend.length">
                 <span class="icon-thumb_up"></span>
                 <span v-for="item in rating.recommend" class="item">{{item}}</span>
               </div>
               <!--时间-->
               <div class="time">{{rating.rateTime | formatDate}}</div>
             </div>
           </li>
         </ul>
       </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import BScroll from 'better-scroll'
  import shopcart from '../shopcart/shopcart'
  import star from '../star/star'
  import split from '../split/split'
  import ratingselect from '../ratingselect/ratingselect'
  import {formatDate} from '../../common/js/date'
  
  const ERR_OK = 0
export default {
    props: {
      seller: {
        type: Object
      }
    },
    data () {
      return {
        ratings: [],
        selectType: 2,
        onlyContent: true
      }
    },
    created () {
      //通过Ajax请求拿到ratings的api
      this.$http.get('/api/ratings').then(response => {
        response = response.body
        if (response.errno === ERR_OK) {
          this.ratings = response.data;
          this.$nextTick(() => {
            this.scroll = new BScroll(this.$refs.ratings,{
              click: true
            })
          })
        }
      })
    },
    components: {
      shopcart,
      star,
      split,
      ratingselect
    },
    filters: {
      formatDate(time) {
        let date = new Date(time)
        return formatDate(date,'yyyy-MM-dd hh:mm')
      }
    },
    methods: {
      //显示评论
      needShow (type,text) {
        //是否要显示有内容的评论
        if (this.onlyContent && !text) {
          return false;
        }
        if (this.selectType === 2) {
          return true;
        } else {
          return type === this.selectType;
        }
      },
      selectRatingType(type) {
        this.selectType = type
        this.$nextTick(() => {
          this.scroll.refresh()
        })
      },
      selectContentToggle(content) {
        this.onlyContent = content
        this.$nextTick(() => {
          this.scroll.refresh()
        })
      }
    }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin.styl"
  
  .ratings
    position absolute
    top 174px
    bottom 0
    left 0
    width 100%
    overflow hidden
    .overview
      display flex
      padding 18px 0
      .overview-left
        flex 0 0 137px
        width 137px
        padding 6px 0
        border-right 1px solid rgba(7,17,27,0.1)
        text-align center
        @media only screen and (max-width 320px)
          flex 0 0 115px
          width 115px
        .score
          margin-bottom 6px
          line-height 28px
          font-size 24px
          color rgb(255,153,0)
        .title
          margin-bottom 8px
          line-height 12px
          font-size 12px
          color rgb(7,17,27)
        .rank
          line-height 10px
          font-size 10px
          color rgb(147,153,159)
      .overview-right
        flex 1
        padding 6px 0 6px 24px
        @media only screen and (max-width 320px)
          padding-left 6px
        .score-wrapper
          margin-bottom 8px
          font-size 0
          .title
            display inline-block
            vertical-align top
            line-height 18px
            font-size 12px
            color rgb(7,17,27)
          .star
            display inline-block
            vertical-align top
            margin 0 12px
          .score
            display inline-block
            vertical-align top
            line-height 18px
            font-size 12px
            color rgb(255,153,0)
        .delivery-wrapper
          font-size  0
          .title
            line-height 18px
            font-size 12px
            color rgb(7,17,27)
          .delivery
            margin-left 12px
            font-size 12px
            line-height 12px
            color rgb(147,153,159)
    .rating-wrapper
      padding 0px 18px
      .rating-item
        display flex
        padding 18px 0
        border-1px(rgba(7,17,27,0.1))
        &:last-child
          border-none()
        .avatar
          flex 0 0 28px
          width 28px
          margin-right 12px
          img
            border-radius 50%
        .content
          position relative
          flex 1
          .name
            margin-bottom 4px
            line-height 12px
            font-size 10px
            color rgb(7,17,27)
          .star-wrapper
            margin-bottom 6px
            font-size 0
            .star
              display inline-block
              vertical-align top
              margin-right 6px
            .delivery
              display inline-block
              vertical-align top
              line-height 14px
              font-size 10px
              color rgb(147,153,159)
          .text
            margin-bottom 8px
            line-height 18px
            font-size 12px
            color rgb(7,17,27)
          .recommend
            line-height 16px
            font-size 0
            .icon-thumb_up,.item
              display inline-block
              margin 0 8px 4px 0
              font-size 9px
            .icon-thumb_up
              color rgb(0,160,220)
            .item
              line-height 16px
              padding 0 6px
              border 1px solid rgba(7,17,27,0.1)
              border-radius 1px
              color rgb(147,153,159)
              background-color #fff
          .time
            position absolute
            top 0
            right 0
            line-height 12px
            font-size 10px
            color rgb(147,153,159)
</style>
