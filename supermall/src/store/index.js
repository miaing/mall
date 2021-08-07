import Vue from 'vue'
import Vuex from 'vuex'

//安装插件
Vue.use(Vuex)
import getters from './getters'
//创建Store对象
const store = new Vuex.Store({
    state:{
        cartList:[]
    },
    mutations: {
        addCart(state,payload){
                //payLoad新添加到商品
                let oldProduct = state.cartList.find(item => item.iid === payload.iid)
                //设置购物车是否默认是显示状态
                payload.checked = true

                //判断oldProduct
                if (oldProduct) {
                    oldProduct.count += 1
                } else {
                    payload.count = 1
                    state.cartList.push(payload)
                }
            
            }
    },
    getters
})

//导出Vuex,挂载在实例中
export default store