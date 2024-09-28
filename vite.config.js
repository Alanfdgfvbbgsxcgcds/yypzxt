import vue from '@vitejs/plugin-vue';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { VantResolver } from '@vant/auto-import-resolver';

export default {

  server: {
    port: 5500,
    proxy: {
      // 匹配所有以 '/v3pz' 开头的请求
      '/v3pz': {
        target: 'https://v3pz.itndedu.com/', // 目标服务器
        changeOrigin: true, // 推荐开启
        rewrite: (path) => path.replace(/^\/v3pz/, '/v3pz'), // 重写路径
      },

    },
  },
  base: '/yypzxt/',
  plugins: [
    vue(),
    AutoImport({
      resolvers: [VantResolver()],
    }),
    Components({
      resolvers: [VantResolver()],
    }),
  ],
};