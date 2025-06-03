# Sử dụng Node.js LTS version làm base image
FROM node:20-alpine

# Tạo thư mục làm việc trong container
WORKDIR /app

# Sao chép package.json và package-lock.json
COPY package*.json ./

# Cài đặt dependencies
RUN npm install

# Sao chép toàn bộ source code
COPY . .

# Mở port mà ứng dụng sẽ chạy
EXPOSE 3000

# Thêm script start vào package.json
RUN npm pkg set scripts.start="node app.js"

# Chạy ứng dụng
CMD ["node", "app.js"] 