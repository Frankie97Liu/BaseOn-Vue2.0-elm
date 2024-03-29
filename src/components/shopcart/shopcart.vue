<template>
  <div>
    <div class="shopcart">
      <!--商品内容-->
      <div class="content" @click="toggleList">
        <!--左部分-->
        <div class="content-left" >
          <div class="logo-wrapper">
            <!--logo-->
            <div class="logo" :class="{'highlight':totalCount>0}">
              <span class="icon-shopping_cart" :class="{'highlight':totalCount>0}"></span>
            </div>
            <div class="number" v-show="totalCount>0">{{totalCount}}</div>
          </div>
          <div class="price" :class="{'highlight':totalPrice>0}">￥{{totalPrice}}</div>
          <!--配送费-->
          <div class="desc">另需配送费￥{{deliveryPrice}}元</div>
        </div>
        <!--右部分-->
        <div class="content-right" @click.stop.prevent="pay">
          <div class="pay" :class="payClass">
            {{payDesc}}
          </div>
        </div>
      </div>
      <!--动画小球·-->
      <div class="ball-container">
          <div v-for="ball in balls" >
            <transition name="drop" @before-enter="beforeDrop" @enter="dropping" @after-enter="afterDrop" >
              <div class="ball" v-show="ball.show">
                <div class="inner inner-hook"></div>
              </div>
            </transition>
          </div>
        </div>
      <!--购物车详情-->
      <transition name="fold">
          <div class="shopcart-list" v-show="listShow">
            <div class="list-header">
              <div class="title">购物车</div>
              <div class="empty" @click="empty">清空</div>
            </div>
            <div class="list-content" ref="listContent">
            <ul>
              <li class="food" v-for="food in selectFoods">
                <span class="name">{{food.name}}</span>
                <div class="price">
                  <span>￥{{food.price*food.count}}</span>
                </div>
                <!--商品选择按钮-->
                <div class="cartcontrol-wrapper">
                  <cartcontrol @add="addFoods" :food="food"></cartcontrol>
                </div>
              </li>
            </ul>
          </div>
          </div>
      </transition>
    </div>
    <transition name="fade">
      <div class="list-mask" v-show="listShow" @click="hideList"></div>
    </transition>
  </div>
</template>

<script>
  import BScroll from 'better-scroll'
  import cartcontrol from "../cartcontrol/cartcontrol"
  export default {
    props: {
      // 选择商品映射
      selectFoods: {
        type: Array,
        default() {
          return [
            {
              price: 0,
              count: 0
            }
          ]
        }
      },
      deliveryPrice: {
        type: Number,
        default: 0
      },
      minPrice: {
        type: Number,
        default: 0
      }
    },
    data () {
      return {
        balls: [
          {
            show: false
          }
        ],
        dropBalls: [],
        fold: true
      }
    },
    computed: {
      // 计算商品总价
      totalPrice () {
        let total = 0
        this.selectFoods.forEach((food) => {
          total += food.price * food.count
        })
        return total
      },
      // 计算商品总量
      totalCount () {
        let count = 0
        this.selectFoods.forEach((food) => {
          count += food.count
        })
        return count
      },
      payDesc () {
        if (this.totalPrice === 0) {
          return `￥${this.minPrice}元起送`
        }else if (this.totalPrice < this.minPrice) {
          let diff = this.minPrice - this.totalPrice
          return `还差￥${diff}元起送`
        }else {
          return '去结算'
        }
      },
      payClass () {
        if (this.totalPrice < this.minPrice) {
          return 'not-enough'
        }else {
          return 'enough'
        }
      },
      listShow() {
        if (!this.totalCount) {
          this.fold = true
          return false
        }
        let show = !this.fold
        if (show) {
          this.$nextTick(() => {
            // 初始化scroll
            if (!this.scroll) {
              this.scroll = new BScroll(this.$refs.listContent,{
                click: true
              })
            }else {
              // 已经存在，刷新scroll
              this.scroll.refresh()
            }
          })
        }
        return show
      }
    },
    methods: {
      // 找到隐藏的小球
      drop(el) {
        for (let i=0; i<this.balls.length; i++) {
          let ball = this.balls[i]
          if (!ball.show) {
            ball.show = true
            ball.el = el
            this.dropBalls.push(ball)
            return
          }
        }
      },
      // 开始下落
      beforeDrop (el) {
        let count = this.balls.length;
        while (count--) {
          let ball = this.balls[count];
          if (ball.show) {
            let rect = ball.el.getBoundingClientRect();
            let x = rect.left - 32;
            let y = -(window.innerHeight - rect.top - 22);
            el.style.display = '';
            el.style.webkitTransform = `translate3d(0,${y}px,0)`;
            el.style.transform = `translate3d(0,${y}px,0)`;
            let inner = el.getElementsByClassName('inner-hook')[0];
            inner.style.webkitTransform = `translate3d(${x}px,0,0)`;
            inner.style.transform = `translate3d(${x}px,0,0)`;
          }
        }
      },
      // 下落中
      dropping (el) {
        /* eslint-disable no-unused-vars */
        let rf = el.offsetHeight;
        this.$nextTick(() => {
          el.style.webkitTransform = 'translate3d(0,0,0)';
          el.style.transform = 'translate3d(0,0,0)';
          let inner = el.getElementsByClassName('inner-hook')[0];
          inner.style.webkitTransform = 'translate3d(0,0,0)';
          inner.style.transform = 'translate3d(0,0,0)';
        })
      },
      // 结束下落
      afterDrop (el) {
        let ball = this.dropBalls.shift();
        if (ball) {
          ball.show = false;
          el.style.display = 'none';
        }
      },
      // 显示购物车详情
      toggleList () {
        if (!this.totalCount) {
          return
        }
        this.fold = !this.fold
      },
      // 增加商品数量
      addFoods (target) {
        this.drop(target)
      },
      // 清空购物车
      empty () {
        this.selectFoods.forEach((food) => {
          food.count = 0
        })
      },
      //隐藏购物车
      hideList() {
        this.fold = true
      },
      pay() {
        if (this.totalPrice < this.minPrice){
          return
        }
        window.alert(`支付${this.totalPrice}元`)
      }
    },
    components: {
      cartcontrol
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin.styl"
  .shopcart
    position fixed
    left 0
    bottom 0
    z-index 50
    width 100%
    height 48px
    background-color black
    .content
      display flex
      background #141d27
      font-size 0
      .content-left
        flex 1
        .logo-wrapper
          display inline-block
          vertical-align top
          position relative
          top -10px
          margin 0 12px
          padding 6px
          width 56px
          height 56px
          box-sizing border-box
          border-radius 50%
          background #141d27
          .logo
            width 100%
            height 100%
            text-align center
            border-radius 50%
            background #2b343c
            &.highlight
              background rgb(0,160,220)
            .icon-shopping_cart
              font-size 24px
              color #80858a
              line-height 44px
              &.highlight
                color #fff
          .number
            position absolute
            top 0
            right 0
            width 24px
            height 16px
            line-height 16px
            text-align center
            border-radius 16px
            font-size 9px
            font-weight 700
            color #fff
            background-color rgb(240,20,20)
            box-shadow 0 4px 8px 0 rgba(0,0,0,0.4)
        .price,.desc
          display inline-block
          vertical-align top
          line-height 24px
          color rgba(255,255,255,0.4)
        .price
          margin-top 12px
          padding-right 12px
          box-sizing border-box
          font-size 16px
          border-right 1px solid rgba(255,255,255,0.1)
          font-weight 700
          &.highlight
            color #fff
        .desc
          line-height 24px
          margin 12px 0 0 12px
          font-size 10px
      .content-right
        flex 0 0 105px
        width 105px
        .pay
          height 48px
          line-height 48px
          text-align center
          font-size 12px
          font-weight 700
          color rgba(255,255,255,0.4)
          background #2b333b
          &.not-enough
            background #2b333b
          &.enough
            background #00b43c
            color #fff
    .ball-container
      .ball
        position fixed
        left 32px
        bottom 22px
        z-index 200
        transition all 0.4s cubic-bezier(0.49,-0.29,0.75,0.41)
        .inner
          width 16px
          height 16px
          border-radius 50%
          background rgb(0,160,220)
          transition all 0.4s linear
    .shopcart-list
      position absolute
      top 0
      left 0
      z-index -1
      width 100%
      transform translate3d(0,-100%,0)
      &.fold-enter-active, &.fold-leave-active
        transition all 0.5s
      &.fold-enter,&.fold-leave-active
        transform translate3d(0,0,0)
      .list-header
        height 40px
        line-height 40px
        padding 0 18px
        background-color #f3f5f7
        border-bottom 1px solid rgba(7,17,27,0.1)
        .title
          float left
          font-size 14px
          color rgb(7,17,27)
        .empty
          float right
          font-size 12px
          color rgb(0,160,220)
      .list-content
        padding 0 18px
        max-height 217px
        background-color #fff
        overflow hidden
        .food
          position relative
          padding 12px
          box-sizing border-box
          border-1px(rgba(7,17,27,0.1))
          .name
            line-height 24px
            font-size 14px
            color rgb(7,17,27)
          .price
            position absolute
            right 110px
            bottom 12px
            line-height 24px
            font-size 14px
            font-weight 700
            color rgb(240,20,20)
          .cartcontrol-wrapper
            position absolute
            right 0
            bottom 6px
        
  .list-mask
    position fixed
    top 0
    left 0
    width 100%
    height 100%
    z-index 40
    backdrop-filter blur(10px)
    opacity 1
    background-color rgba(7,17,27,0.6)
    &.fade-enter-active,&fade-leave-active
      transition all 0.5s
    &.fade-enter,&fade-leave-active
      opacity 0
      background-color rgba(7,17,27,0)
</style>
