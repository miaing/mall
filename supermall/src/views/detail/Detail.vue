<template>
  <div id="detail">
    <detail-nav-bar class="detail-nav" @titleClick="titleClick" ref="nav"/>
    <scroll class="content" ref="scroll" :probe-type="3" @scroll="contentScroll">
      <detail-swiper :top-images="topImages" />
      <detail-base-info :goods="goods" />
      <detail-shop-info :shop="shop" />
      <detail-goods-info :detail-info="detailInfo" @imageLoad="imageLoad" />
      <detail-param-info ref="params" :param-info="paramInfo" />
      <detail-comment-info ref="comment" :comment-info="commentInfo" />
      <goods-list ref="recommend" :goods="recommends"/>
    </scroll>
    <detail-bottom-bar @addCart="addToCart"/>
    <back-top @click.native="backClick" v-show="isShowBackTop"/>
    
  </div>
</template>

<script>
import DetailNavBar from "./childcomps/DetailnavBar.vue";
import { getDetail, Goods, Shop ,GoodsParam,getRecommend} from "../../network/detail.js";
import DetailSwiper from "../detail/childcomps/DeteilSwiper.vue";
import DetailBaseInfo from "./childcomps/DetailBaseInfo.vue";
import DetailShopInfo from "./childcomps/DetailShopInfo.vue";
import Scroll from "../../components/common/scroll/Scroll.vue";
import DetailGoodsInfo from '../detail/childcomps/DetailGoodsInfo.vue'
import DetailParamInfo from '../detail/childcomps/DetailParamInfo.vue'
import DetailCommentInfo from '../detail/childcomps/DetailCommentInfo.vue'
import GoodsList from '../../components/content/goods/GoodsList.vue'
import {debounce} from "../../common/utils/utils"
import DetailBottomBar from '../detail/childcomps/DetailBottomBar.vue'
import backTop from '../../components/content/backTop/BackTop.vue'

export default {
  name: "Detail",
  components: {
    DetailNavBar,
    DetailSwiper,
    DetailBaseInfo,
    DetailShopInfo,
    Scroll,
    DetailGoodsInfo,
    DetailParamInfo,
    DetailCommentInfo,
    GoodsList,
    DetailBottomBar,
    backTop

  },
    data() {
      return {
        iid: null,
        topImages: [],
        goods: {},
        shop: {},
        detailInfo: {},
        paramInfo: {},
        commentInfo:{},
        recommends:[],
        themeTopYs:[],
        currentIndex: 0,
        getThemeTopY:null,
        isShowBackTop: false,
      }
    },
    created() {
      // 1.保存传入的iid
      this.iid = this.$route.params.iid

      // 2.根据iid请求详情数据
      getDetail(this.iid).then(res => {
        // 1.获取顶部的图片轮播数据
        //console.log(res);
        const data = res.result;
        this.topImages = data.itemInfo.topImages

        // 2.获取商品信息
        this.goods = new Goods(data.itemInfo, data.columns, data.shopInfo.services)

        // 3.创建店铺信息的对象
        this.shop = new Shop(data.shopInfo)

        // 4.保存商品的详情数据
        this.detailInfo = data.detailInfo;

        // 5.获取参数的信息
        this.paramInfo = new GoodsParam(data.itemParams.info, data.itemParams.rule)

        //6.保存评论信息
        if(data.rate.cRate !== 0){
          this.commentInfo = data.rate.list[0]
        }
        //获取评论信息
        getRecommend().then(res =>{
          this.recommends = res.data.list
        })
         //给getThemTopY赋值
     this.getThemeTopY = debounce(() => {
      this.themeTopYs = []
      this.themeTopYs.push(0);
      this.themeTopYs.push(this.$refs.params.$el.offsetTop);
      this.themeTopYs.push(this.$refs.comment.$el.offsetTop);
      this.themeTopYs.push(this.$refs.recommend.$el.offsetTop);
      this.themeTopYs.push(Number.MAX_VALUE);
          //console.log(this.themeTopYs);
    },100)

          
      
      
      })
      
      
    },
  methods:{
    imageLoad(){
      this.$refs.scroll.refresh()
      this.getThemeTopY()

      /*this.themeTopYs = []
          this.themeTopYs.push(0);
          this.themeTopYs.push(this.$refs.params.$el.offsetTop)
          this.themeTopYs.push(this.$refs.comment.$el.offsetTop)
          this.themeTopYs.push(this.$refs.recommend.$el.offsetTop)
          this.themeTopYs.push(Number.MAX_VALUE)

          console.log(this.themeTopYs)*/
    },
    backClick() {
      this.$refs.scroll.scrollTo(0, 0)
    },
    titleClick(index){
      this.$refs.scroll.scrollTo(0, -this.themeTopYs[index], 300)
    },
    contentScroll(position){
      //监听BackTop到什么位置显示
      this.isShowBackTop = (-position.y) > 1000
      const positionY = -position.y;
      let length = this.themeTopYs.length;
      for(let i = 0; i < length; i++) {
        if(this.currentIndex != i && (i < length - 1 && positionY >= this.themeTopYs[i] && positionY < this.themeTopYs[i + 1] || (i === length -1 && positionY >= this.themeTopYs[i]))) {
          //console.log(i);
          this.currentIndex = i;
          this.$refs.nav.currentIndex = this.currentIndex
        }
      }
    },
    addToCart(){
      //获取商品的信息
      const product = {}
      product.image = this.topImages[0]
      product.title = this.goods.title
      product.desc = this.goods.desc
      product.price = this.goods.realPrice
      product.iid = this.iid
      
      //将商品添加到购物车
      this.$store.commit('addCart', product)
    }
  }
  }  
</script>

<style scoped>
#detail {
  position: relative;
  z-index: 999;
  background-color: #fff;
  height: 100vh;
}

.detail-nav {
  position: relative;
  z-index: 999;
  background-color: #fff;
}

.content {
  background-color: #fff;
  height: calc(100% - 44px);
}
</style>