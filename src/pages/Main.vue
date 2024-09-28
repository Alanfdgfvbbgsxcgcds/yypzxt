<template>
  <router-view></router-view>
  <van-tabbar v-model="active">
    <van-tabbar-item :icon="item.meta.icon" v-for="item in router.options.routes[0].children" :key="item.path"
      :url="`#/${item.path}`">{{item.meta.name}}</van-tabbar-item>
  </van-tabbar>
</template>
<script setup>
  import { ref, onMounted, } from 'vue'
  import { useRouter, useRoute } from 'vue-router'
  const route = useRoute()
  const router = useRouter()
  const active = ref(0);

  onMounted(() => {
    // console.log(router.options.routes);
    const data = router.options.routes[0].children
    // console.log(data);

    active.value = data.findIndex(item => '/' + item.path === route.path)
  })

</script>