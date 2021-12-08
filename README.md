# Getting Started

### element-plus

    依赖加入了element-plus用来测试可用，不需要可以去掉

### asyncData

    express的req中添加了service用来直接在asyncdata中调用服务端方法，
    和nuxt不一样，虽然减少了请求和序列化，但不能在前端路由切换时自动获取服务端数据了
    Home的asyncData方法中使用了req.postservice，
    postservice从mongodb中获取测试数据，不需要可以换掉

### Project setup

```
npm install
```

### Compiles and minifies for production

```
npm run build
```

### Compiles and hot-reloads for development

```
npm run dev
```

### start server

```
npm run serve
```
