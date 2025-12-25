# 使用官方的 Node.js 镜像作为基础镜像
FROM node:20 AS build


# 设置工作目录
WORKDIR /app

# 先拷贝依赖文件（利用 Docker 缓存，依赖不变时跳过安装）
COPY package.json yarn.lock ./
# 设置国内镜像源并安装依赖
RUN yarn config set registry https://registry.npmmirror.com && yarn install

# 再拷贝其他代码
COPY . .

# 打包应用
RUN yarn run build

# 使用轻量级的 Nginx 镜像来提供静态文件
FROM nginx:alpine

# 拷贝构建好的文件到 Nginx 的静态文件目录
COPY --from=build /app/dist /usr/share/nginx/html
# 拷贝 Nginx 配置（支持 SPA 路由刷新）
COPY nginx.conf /etc/nginx/conf.d/default.conf
# 暴露 80 端口
EXPOSE 80
# 设置时区为Asia/Shanghai
ENV TZ=Asia/Shanghai
# 启动 Nginx 服务
CMD ["nginx", "-g", "daemon off;"]


#构建镜像
# docker buildx build --platform linux/amd64,linux/arm64     -t crpi-1arm6bubvql3ps3r.cn-beijing.personal.cr.aliyuncs.com/xfw-images/x-admin-web:test    --push .
