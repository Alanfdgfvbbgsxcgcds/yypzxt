<template>
  <div class="container">
    <div class="header">
      <van-icon name="arrow-left" @click="goBack" class="header-left" size="25" />
      填写服务订单
    </div>

    <statusBar item="0"></statusBar>
    <!-- 内容选择区域 -->
    <van-cell class="cell">
      <template #title>
        <van-image width="25" height="25" :src="createInfo.service.serviceImg"></van-image>
        <span class="server-name">{{createInfo.service.serviceName}}</span>
      </template>
      <template #default>
        <div class="service-text">服务内容</div>
      </template>
    </van-cell>


    <van-cell-group class="cell">
      <van-cell>
        <template #title>
          就诊医院
        </template>
        <template #default>
          <div @click="showHospital=true">{{form.hospital_name || '请选择就诊医院'}}
            <van-icon name="arrow" />
          </div>
        </template>
      </van-cell>

      <van-cell>
        <template #title>
          就诊时间
        </template>
        <template #default>
          <div @click="showTime=true">{{currentDate || '请选择就诊时间'}}
            <van-icon name="arrow" />
          </div>
        </template>
      </van-cell>

      <van-cell>
        <template #title>
          陪诊师
        </template>
        <template #default>
          <div @click="showCompanion=true">{{companionName || '请选择陪诊师'}}
            <van-icon name="arrow" />
          </div>
        </template>
      </van-cell>

      <van-cell>
        <template #title>
          接送地址
        </template>
        <template #default>
          <van-field class="text" input-align="right" v-model="form.receiveAddress" placeholder="请填写接送地址"></van-field>
        </template>
      </van-cell>

      <van-cell>
        <template #title>
          联系电话
        </template>
        <template #default>
          <van-field class="text" input-align="right" v-model="form.tel" placeholder="请填写联系电话"></van-field>
        </template>
      </van-cell>
    </van-cell-group>

    <van-cell-group title="服务需求" class="cell">
      <van-field class="text" style="height: 100px;" v-model="form.demand" placeholder="请简单描述您要就诊的科室.."></van-field>
    </van-cell-group>

    <van-button @click="submit" class="sumbit" type="primary" size="large">提交订单</van-button>

    <!-- 就诊医院选择 弹出层 -->
    <van-popup v-model:show="showHospital" position="bottom" :style="{ height: '30%' }">
      <van-picker :columns="showHosColumns" @cancel="showHospital = false" @confirm="showHosConfirm" />
    </van-popup>

    <!-- 选择就诊时间 -->
    <van-popup v-model:show="showTime" position="bottom" :style="{ height: '30%' }">
      <van-date-picker :min-date="minDate" title="选择日期" @confirm="showTimeConfirm" @cancel="showTime=false" />
    </van-popup>
    <!-- 陪诊师 -->
    <van-popup v-model:show="showCompanion" position="bottom" :style="{ height: '30%' }">
      <van-picker :columns="showComColumns" @cancel="showCompanion = false" @confirm="showComConfirm" />
    </van-popup>

    <!-- 支付二维码弹窗 -->
    <van-dialog :showConfirmButton="false" v-model:show="showCode">
      <van-icon name="cross" class="close" @click="closeCode"></van-icon>
      <div>微信支付</div>
      <van-image width="150" height="150" :src="codeImg"></van-image>
      <div>请使用本人微信扫描二维码</div>
    </van-dialog>
  </div>

</template>
<script setup>
  import statusBar from '../../components/statusBar.vue'
  import { h5Companion, createOrder } from '../../api/index.js'
  import { useRouter, useRoute } from 'vue-router'
  import { onMounted, reactive, ref, computed } from 'vue'
  import Qrcode from 'qrcode'
  const router = useRouter()

  const createInfo = reactive({
    companion: [],
    hospitals: [],
    service: []
  })
  // 支付弹框
  const showCode = ref(false)
  const codeImg = ref('') //支付二维码图片
  // form数据
  const form = reactive({})
  // 就诊医院 控制弹框的显示和隐藏
  const showHospital = ref(false)
  // 选择就诊时间
  const showTime = ref(false)
  const showCompanion = ref(false)
  const currentDate = ref();
  const minDate = ref(new Date())// 最小日期

  // 底部弹框数据处理  按照框架的规则处理
  const showHosColumns = computed(() => {
    return createInfo.hospitals.map(item => {
      return { text: item.name, value: item.id }
    })
  })
  // 选择医院  确认按钮
  const showHosConfirm = (item) => {
    // console.log(item);
    // 定义获取选择医院的名字和id
    form.hospital_id = item.selectedOptions[0].value
    form.hospital_name = item.selectedOptions[0].text
    // 关闭弹框
    showHospital.value = false
  }
  // 选择就诊时间
  const showTimeConfirm = (item) => {
    const dateStr = item.selectedValues.join('-')
    currentDate.value = dateStr
    form.starttime = new Date(dateStr).getTime()
    showTime.value = false
  }

  // 选择陪诊师
  const showComColumns = computed(() => {
    return createInfo.companion.map(item => {
      return { text: item.name, value: item.id }
    })
  })
  const companionName = ref()
  const showComConfirm = (item) => {
    form.companion_id = item.selectedOptions[0].value
    companionName.value = item.selectedOptions[0].text
    showCompanion.value = false
  }
  // 提交表单
  const submit = async () => {
    const params = [
      'hospital_id',
      'hospital_name',
      'demand',
      'companion_id',
      'receiveAddress',
      'tel',
      'starttime'
    ]
    for (let i of params) {
      if (!form[i]) {
        showNotify({ message: '请把每一项都填写' });
        return
      }
    }
    const { data: { data } } = await createOrder(form)
    Qrcode.toDataURL(data.wx_code).then((url) => {
      showCode.value = true
      codeImg.value = url
    })
  }

  // 关闭支付弹框
  const closeCode = () => {
    // 跳转到订单列表
    router.push('/order')
    showCode.value = false
  }

  // 点击返回上一步
  const goBack = () => {
    router.go(-1)
  }

  onMounted(async () => {
    const { data } = await h5Companion()
    Object.assign(createInfo, data.data)
    // console.log(createInfo);


  })


</script>
<style lang="less" scoped>
  .container {
    background-color: #f0f0f0;
    height: 100vh;
  }

  .header {
    padding: 10px 0;
    text-align: center;
    line-height: 30px;
    font-size: 15px;

    .header-left {
      float: left;
    }
  }

  .cell {
    width: 95%;
    margin: 5px auto;
    background-color: #fff;

    ::v-deep(.van-field__control) {
      color: var(--van-cell-value-color);
    }

    ::v-deep(.van-cell__title) {
      display: flex;
      align-items: center;
    }

    .server-name {
      margin-left: 10px;
    }
  }

  .service-text {
    background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAqfSURBVHja7F0JkBRFFs1hFBDXARTEC0VA8ETFFcVRF7WVQ0EJzwhRPMNQ1FXRxQNPxFsRj11RjDXYkPAO8QxxUBQUvBXvAxVnBBWVYxcQkGn/s18z7Ez9qu7pqqzq7vwRLxoqa6qz8+XP/P9n5q+KdDptnCRHWrgmcIQ4cYQ4Qpw4QhwhThwhjhAnlmW9Qh9QU1Njq66tBG0FXQSd+e/W/ETZIsEqwVLBz4K5gh8EywSReb+pVCpZhEQo7QS7CfYR7C7YXrC1oE2O9V5Bkr4SzBG8LZghqBWsLlkNCVm2EwwQ9BP0FWwmqGjmszYgthDsz2vLBZ8JZgqeE7wm+J8jpKkmHCw4UXAQGzEqgXb1Js6l9jwseEzwfrlP6p0EowRvCB4RHBYxGV7SXXAZ6/CE4MByJAS99HzBLMENgh4J6JgtBUMF0wRTBHuVy5CFoelaQZ9m/O1KwRLBPE7MiwW/0apCWXs2bJWgg6AbtXDDPOehIYL+gnGCW2mxlRwhaJirBWfk8TcwYT+kZYQh5SPBd5yYf89RE9vTUOhNI2FfGgq5mNgXCw4XXEKtKRlCYLZOEOyc4/3vcTx/RvBxASbqcuJ7wXRe6yjYT3AMtXXjgGfsIHhScB2xrNjnkIsEL+dARpo/fADH72tp9YTtLywk2cfRtxlNBzJILhW8RCOgaAm5RXATx3U/gSYcwEn1BYtOG4a/sRzKMDzVBdzfh/XrXWyEYFJ9QDAy4L5PBUcLBgteidHCgtbcKKgWTAy4tysdyoHFQgi84qmC4QH33Uzv+bEEOcnQmNMFh9CY8DNQnhL8PemEwKqZFGDDfyM4QvAP2+ZkHvKiIBWgLTCGbhMcmWRC7mLoQ5M57H1TTPLlJ2rLqIC2u7+mpqZPEgm5RnCyT/mzgkMZOyomgVFyCp1PL0Ho/xEhpWuSCBkmuNyn/F8cpupMccq/2ZnmK+XbCB4SUtrETohUohstFE3uFZyVo2edZJlJs1yb9/YM6JQ5S0Vzt5KyR0xnZbxkKntWsZOxrhzGOVDryMNSqdSDcWnIWT5kfCI4tcTIyDqxF/uUj5GO2sE6IfKl2XUEL1nNCb7OlKbAh3pYKdvWp10i1RCEHNopZYiOvmmpcdrSqIBPcLbJrLnbkJEcBbxkhHTYvawRIl+GEMNRSvHTJrOGYEMQVseWl/+YzILXnYJXTSaKG7UggnymMiSvz05pTUMuUP5uMctsCH40Vhv/6mGC3m6Cw+phCMi/W5v8peP2jZwQquIQpfhWi45fD4Y3vGRHk4ke25DrqS2NpbK5nTNfDUFAzWtRCxP4PRYnVswdG/qUd7JUjx99tORw6cB7REaIPByR3P5K8QRjN1iIIGWtUlYveMdiXSYqXjyG1SOj1JCjlLF5geA+y6YnvhPxs7Rilr5tqyLiCC5kRMJLjpWOvFHohMhDsWtjsFI8iaprWxBjGs6wxrcmsxZ/ockst66xXBd0yF89riPouE8UGgKHp9rjOsy+x2N00mDy9jOZNZhqGhb1tishWjKfJrgWbgmdEPxor12FsyyP114CbcD6xYqY6zFZuX6AjDAtwyakWrk+NY4emVCZqQzdPYlwCBF2YS30UXrmi46HtcPWL3QWGwvchD3D1JAuDFN4mZ7vOyr+T15WrodKyK4ms7WysXwgvWJlAhoBGtxLsFUC6jJHGcJ7yUjTIixCtleuf5qABsCmNez7fctktp3CB6mIsT5fGO/19x6MLhRGiLAKy0rbPjk3ZjIQHsG5EmwJze56hx9yXox1wu58r3WgtrlqcJCGdFAelDbxL0AhzN7N4/pwE9PJMBnCsWO/VhlWO4dBCNz+TRSH8JeYCdnOx4n9S4z1Wqhc7xgGIYiotve4jmXaRTETks7zui3R2qV9GIS0Ujx0+CDLnZXrKVq7tAmDkEqOf42l3pTejpKwZJVyvWUYhKQVu7oiZvMyyVKpXF8TBiG/K4y3UJxFJ3q7rAyDkGW0rRvLerk6OmUoVcr1pWERslixq9u5tvcUbcfLr2EQAhNugTJObu7avklkA+25hWIEzQ+LkO+Usq0dBU1kA6VdfvNpx9wJSaVSYPZzpbina/8msqVgU4/r2Lv1YxgaAvlI8X53cu3fRHZUrKyPc12qyJUQr/hML+7VctIgeyvX3831AYGECLOYRz7wKILZ+zfHwdoJHYaOduj1rdAIocxWrh/sqFgrWMjbVTF33wmbEG2tGMecOzou/pQjjHfcbxZ3N4ZKCA7gfKtYFf3dcPXncHW0UpzXzpycCBGG4bE/rxTjBFO5Bxpx/GEXxf94LnRCKI8a78gv5pHqMifkHKUtp0ln/jIqQpDZ7UPlGSPLlQke8TtUKX4o3+flTIgwjVD8JKUYO+P3K1NOcEzaaw0EGwmfjYwQCgjx2m2CCl1ThnPJQB/tuJc+XHSEyBfglJR2hKufySQLsCUtfK7b6BjYkXOj8l3otBPD/FF+gsMp85Qy5ErsaomQpT7XbaQJHK1YVpDx7LzRE8Jd3mOU4k4kzEaC5lk+YYqo87ljmLpIKYPhMyFstQ8SHCd7SSlDuu4rLRCCcE7jFBc4tDMu4u/FRrx/KkMV3IJR0mn/29yHF5INqDcbZX3lltME90fcONjIdyY7Ad4V8oDxPqMR5rwx3eiZSScLGccX8gUVhbzpU0jB5uablWKsxQ/yGVqKUUC4luATuU/6CyF1sRFCUrADXYvjoNcOMXmEnxMsyCk5QimDEbG/kDE7KtMxH0Hil8+UMuRZf4aaUqxSRf9rhM89l4ZBRliEYL0YudR/UsqxxjyFxBWbYMMCorUn+Nxzh5BxS9TOVb4CUw9Jy7R142ye26tM8bwZDgeBEKn1SwML7b/QhrfbHEHlzw6450r2uB4JJwPRWyzK+W3kQPqOE0Q7VieVEMNwAfLcLvG550CajueY5L2UDEuwSMJ2h/HfKgvNGGq8d3UmipCs0zjI+B9525w/Gq8YOigBRGxK7YUPE5QKA05hZHmIoxrPXycpnwTch4T8yBGCd3rEsYOlE+eA1zm/VQXcP4bWVmTJbaKcYDHRDzB6Bs91ZSjHbMxDeNlKhwjrhZAHEoshG9ybdGy7BfwNDnKeJLgi6h4S9RheywbGWfKrGXrwa6iBRC0nf8TLZtC0LqRXIsSCt4b2M5nUgNU+IZ/GgmEMifm/sKGytibVcZzIx5rcXobSmcYBgA0WyJCAxABfm8zulzrT8JY2fOJQEY5HtDYNb2nDMgCSYnanRmCHTGUedV5A7UG2U2vH92xaOe9xXoGTNToP0xe9uy+RlXqGK7Kfaf6WSn4W8rvwrMkcnr62PanF4aQh6RheX4fMb/MKqHf2hHCVaUiK2boAMuppzmJIGxYHGXERAlnISRVeMFJhzDbxCVb2EKvC3qrBRl/nKbkhy0sQ/xpvMpFUTLiIGmOfV5eIOwvOkuNN0dgV8rhJUJ76pHjKa+gkTuPQswctob7Uoo4FErSCVtJrtPhguX2TxJhNEl9wv4ymZnblDykp8GLKnvQXoD1brWNVtaMJu8Q0vBv353Ussrn0ieYZ/VC/IyQPWcQePYP/xyS+CTWpJT8rOQytojZgTfsHU4T5IAteMXRSGlaWE0eII8SJI8QR4sQRUtryhwADALgYV5Nd2U3PAAAAAElFTkSuQmCC) no-repeat center center;
    background-size: 20px;
  }

  .sumbit {
    width: 100%;
    position: absolute;
    bottom: 0;
  }

  ::v-deep(.van-dialog__content) {
    text-align: center;
    padding: 20px;

    .close {
      position: absolute;
      left: 20px;
    }
  }
</style>