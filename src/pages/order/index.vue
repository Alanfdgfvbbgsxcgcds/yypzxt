<template>
  <div class="container">
    <div class="header">我的订单</div>
    <van-tabs v-model:active="active" @click-tab="onClickTab">
      <van-tab title="全部"></van-tab>
      <van-tab title="待支付"></van-tab>
      <van-tab title="待服务"></van-tab>
      <van-tab title="已完成"></van-tab>
      <van-tab title="已取消"></van-tab>
    </van-tabs>

    <!-- 内容展示区 -->
    <van-row @click="goDetail(item)" v-for="item in order" :key="item.out_trade_no">
      <van-col span="5">
        <van-image width="50" height="50" radius="5" :src="item.serviceImg"></van-image>
      </van-col>
      <van-col span="14">
        <div class="text1">
          {{item.service_name}}
        </div>
        <div class="text2">
          <div> {{item.hospital_name}}</div>
          <div>预约时间:{{item.starttime}}</div>
        </div>
      </van-col>
      <van-col span="5" :style="{color: colorMap[item.trade_state]}" class="text2">
        {{item.trade_state}}
        <counter :second="item.timer" v-if="item.trade_state==='待支付'"></counter>
      </van-col>
    </van-row>



  </div>

</template>

<script setup>
  import { ref, onMounted } from 'vue'
  import { orderList } from '../../api/index.js'
  import { useRouter } from 'vue-router'
  import counter from '../../components/counter.vue'
  const active = ref('')
  const router = useRouter()
  const order = ref([])   //列表信息
  onMounted(() => {
    getOrderList('')//默认查询全部
  })
  const colorMap = {
    '待支付': '#ffa200',
    '待服务': '#1da6fd',
    '已完成': '#21c521'
  }
  // 获取订单列表
  const getOrderList = async (state) => {
    const { data: { data } } = await orderList({ state })
    data.forEach(item => {
      item.timer = item.order_start_time + 7200000 - Date.now()//倒计时时间
    })
    order.value = data
    // console.log(order);
  }
  // 标签页的点击事件，为了获取他的状态 是待支付、已完成、、、
  const onClickTab = (item) => {
    // console.log(item);
    getOrderList(item.name)
  }
  // 跳转详情
  const goDetail = (item) => {
    router.push(`/detail?oid=${item.out_trade_no}`)
  }

</script>

<style lang="less" scoped>
  .container {
    background-color: #f0f0f0;
    height: 100vh;
  }

  .header {
    background-color: #fff;
    line-height: 40px;
    text-align: center;
  }

  .van-row {
    background-color: #fff;
    padding: 10px;
    margin: 5px;
    border-radius: 5px;

    .text1 {
      font-size: 16px;
      line-height: 25px;
      font-weight: bold;
    }

    .text2 {
      font-size: 14px;
      line-height: 20px;
      color: #999999;
    }
  }

  .bottom-text {
    line-height: 50px;
    text-align: center;
    color: #999999;
  }
</style>