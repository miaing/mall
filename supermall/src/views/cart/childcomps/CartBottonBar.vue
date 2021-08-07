<template>
  <div class="bottom-bar">
    <div class="check-content">
      <check-button
        :is-checked="isSelectAll"
        class="check-button"
        @click.native="checkClick"
      ></check-button>
      <span>全选</span>
    </div>
    <div class="total-price">合计：{{ totalPrice }}</div>
    <div class="calculate">
      <button @click="calcClick">去计算({{ checkLength }})</button>
    </div>
  </div>
</template>

<script>
import CheckButton from "../../../components/content/checkButton/CheckButton.vue";
export default {
  name: "CartBottonBar",
  components: {
    CheckButton,
  },
  computed: {
    totalPrice() {
      return '￥' + this.$store.state.cartList.filter(item => {
        return item.checked
      }).reduce((preValue, item) => {
        return preValue + item.price * item.count
      },0).toFixed(2)
    },
    checkLength() {
      return this.$store.state.cartList.filter((item) => item.checked).length;
    },
    isSelectAll() {
      // return !this.$store.state.cartList.filter(item => !item.checked).length
      if(this.$store.state.cartList.length === 0) return false
      return !this.$store.state.cartList.find((item) => !item.checked);
    },
  },
  methods: {
    checkClick() {
      if (this.isSelectAll) {
        //全部选中
        this.$store.state.cartList.forEach((item) => (item.checked = false));
      } else {
        //全部不选中
        this.$store.state.cartList.forEach((item) => (item.checked = true));
      }
    },
    calcClick() {
      if (!this.isSelectAll) {
        this.$toast.show("至少需要选择一款商品", 1000);
      } else {
        this.$toast.show("抱歉，该功能暂未开发~", 1000);
      }
    },
  },
};
</script>

<style scoped>
.bottom-bar {
  height: 40px;
  background-color: #eee;
  line-height: 40px;
  bottom: 40px;
  display: flex;
  justify-content: space-between;
}
.check-content {
  display: flex;
  align-items: center;
  padding: 0 5px;
}
.total-price {
  flex: 2;
  text-align: center;
}
.check-button {
  flex: 1;
  margin: 0 5px;
}
.calculate button {
  height: 100%;
  border: 0px;
  background-color: red;
  padding: 0 10px;
  color: #fff;
}
</style>