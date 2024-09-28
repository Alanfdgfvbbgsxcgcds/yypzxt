<template>
  <div class="login-container">
    <h1>用户登录</h1>
    <van-form @submit="onSubmit">
      <van-cell-group inset class="form-group">
        <van-field v-model="form.userName" name="用户名" label="用户名" placeholder="用户名"
          :rules="[{ required: true, message: '请填写用户名' }]" />
        <van-field v-model="form.passWord" type="password" name="密码" label="密码" placeholder="密码"
          :rules="[{ required: true, message: '请填写密码' }]" />
      </van-cell-group>
      <div class="button-container">
        <van-button round block type="primary" native-type="submit">
          提交
        </van-button>
      </div>
    </van-form>
  </div>
</template>

<script setup>
  import { login } from '../../api/index.js'
  import { reactive } from 'vue'
  import { useRouter, useRoute } from 'vue-router'
  const router = useRouter()
  const route = useRoute()
  const form = reactive({
    userName: '',
    passWord: ''
  })

  // 表单验证
  const onSubmit = async () => {
    const { data } = await login(form)
    if (data.code === 10000) {
      localStorage.setItem('h5_token', data.data.token)
      localStorage.setItem('h5_userInfo', JSON.stringify(data.data.userInfo))
      router.push('/home') //跳转到首页
    }

  }

</script>

<style lang="less" scoped>
  .login-container {

    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: #f0f4f8;
    padding: 20px;


    h1 {
      text-align: center;
      color: #422c6c;
      margin-bottom: 40px;
      font-size: 28px;
      font-weight: 500;
    }

    .form-group {
      background-color: #ffffff;
      border-radius: 8px;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
      padding: 20px;
      margin-bottom: 30px;
      transition: transform 0.3s ease-in-out;

      &:hover {
        transform: translateY(-10px);
      }
    }

    .button-container {
      margin-top: 20px;
    }

    .van-button {
      background-color: #5a60e8;
      border-color: #5a60e8;
      color: #ffffff;
      font-size: 16px;
      transition: background-color 0.3s ease-in-out, border-color 0.3s ease-in-out;

      &:active {
        background-color: #4345a6;
        border-color: #4345a6;
      }
    }
  }
</style>