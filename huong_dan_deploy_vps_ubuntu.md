# Hướng Dẫn Triển Khai (Deploy) Website Next.js Lên VPS Ubuntu 24.04 Với CI/CD (GitHub Actions)

Tài liệu này hướng dẫn chi tiết từng bước để triển khai (deploy) ứng dụng Next.js của bạn lên máy chủ VPS chạy hệ điều hành Ubuntu 24.04. Quá trình này sẽ sử dụng **Nginx** (Reverse Proxy), **PM2** (Quản lý tiến trình) và **GitHub Actions** để tự động hóa việc deploy mỗi khi có thay đổi code mới (CI/CD).

---

## MỤC LỤC
1. [Chuẩn bị VPS](#1-chuẩn-bị-vps)
2. [Cài đặt môi trường trên VPS](#2-cài-đặt-môi-trường-trên-vps)
3. [Cấu hình dự án trên VPS (Lần đầu tiên)](#3-cấu-hình-dự-án-trên-vps-lần-đầu-tiên)
4. [Cài đặt và Cấu hình Nginx](#4-cài-đặt-và-cấu-hình-nginx)
5. [Cài đặt SSL (HTTPS) với Certbot](#5-cài-đặt-ssl-https-với-certbot)
6. [Thiết lập CI/CD bằng GitHub Actions](#6-thiết-lập-cicd-bằng-github-actions)

---

## 1. Chuẩn bị VPS

1. Truy cập vào VPS thông qua SSH từ máy tính của bạn:
   ```bash
   ssh root@<IP_CỦA_VPS>
   ```
2. Cập nhật các package của hệ thống OS:
   ```bash
   apt update && apt upgrade -y
   ```

## 2. Cài đặt môi trường trên VPS

### 2.1 Cài đặt Node.js và npm
Dự án Next.js yêu cầu Node.js. Chúng ta sẽ tải phiên bản Node.js LTS mới nhất (khuyến nghị v20.x):
```bash
# Cài đặt curl (nếu chưa có)
apt install curl -y

# Thêm NodeSource PPA
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -

# Cài đặt Node.js
apt install -y nodejs

# Kiểm tra lại phiên bản
node -v
npm -v
```

### 2.2 Cài đặt pnpm (Nếu dự án sử dụng pnpm)
Từ log của bạn dùng phần lớn là npm hoặc pnpm/yarn. Để an toàn, hãy cài đặt trình quản lý package mà dự án đang cấu hình:
```bash
npm install -g pnpm
```

### 2.3 Cài đặt Git và PM2
- **Git:** Dùng để pull code từ GitHub.
- **PM2:** Trình quản lý luồng (Process Manager) giúp ứng dụng chạy nền và tự động khởi động lại nếu VPS bị sập/khởi động lại.
```bash
apt install git -y
npm install -g pm2
```

---

## 3. Cấu hình dự án trên VPS (Lần đầu tiên)

### 3.1 Clone mã nguồn từ GitHub
Tạo thư mục chưa code và Clone code về:
```bash
# Di chuyển đến thư mục chứa web (Ví dụ /var/www)
mkdir -p /var/www
cd /var/www

# Clone code về VPS (Thay YOUR_GITHUB_USERNAME và REPO_NAME thành của bạn)
# Lưu ý: Nếu repository là Private, bạn cần sử dụng Personal Access Token hoặc cấu hình SSH Key cho Github
git clone https://github.com/YOUR_GITHUB_USERNAME/REPO_NAME.git kimono-website

cd kimono-website
```

### 3.2 Cài đặt dependencies và Build ứng dụng
```bash
# Cài đặt dependencies (Sử dụng npm, pnpm hoặc yarn tuỳ theo dự án)
pnpm install

# Build dự án
pnpm run build
```

### 3.3 Chạy ứng dụng bằng PM2
Khởi chạy dự án (Server Next.js chạy mặc định ở port 3000):
```bash
# Chạy ứng dụng Next.js bằng PM2
pm2 start pnpm --name "kimono-web" -- start

# Lưu cấu hình PM2 để tự chạy lại khi khởi động lại máy chủ VPS
pm2 save
pm2 startup
```

Lúc này, ứng dụng đã chạy ngầm trên VPS tại địa chỉ ảo: `http://localhost:3000`.

---

## 4. Cài đặt và Cấu hình Nginx

Nginx sẽ đóng vai trò như cửa ngõ đón nhận các request từ Port 80 (HTTP) hay 443 (HTTPS) và chuyển tiếp (Reverse Proxy) vào Port 3000 nội bộ.

### 4.1 Cài đặt Nginx
```bash
apt install nginx -y
```

### 4.2 Cấu hình Nginx
Tạo một file cấu hình cho domain của bạn:
```bash
nano /etc/nginx/sites-available/kimono-website
```

Dán nội dung sau vào file (Thay `your_domain.com` bằng Domain thực tế của bạn hoặc dùng IP nếu chưa có Domain):
```nginx
server {
    listen 80;
    server_name your_domain.com www.your_domain.com; # Thay thế bằng domain của bạn

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```
Lưu lại (Bấm `Ctrl + O` -> `Enter` -> `Ctrl + X`).

### 4.3 Kích hoạt cấu hình
```bash
ln -s /etc/nginx/sites-available/kimono-website /etc/nginx/sites-enabled/

# Kiểm tra Nginx có lỗi cú pháp không
nginx -t

# Khởi động lại Nginx
systemctl restart nginx
```
*Lúc này bạn đã có thể truy cập vào website thông qua HTTP bằng Domain/IP.*

---

## 5. Cài đặt SSL (HTTPS) với Certbot
Để website có bảo mật HTTPS miễn phí, sử dụng Let's Encrypt Certbot:
```bash
apt update
apt install certbot python3-certbot-nginx -y

# Chạy lệnh cấp phát SSL tự động
certbot --nginx -d your_domain.com -d www.your_domain.com
```
Làm theo các hướng dẫn trên màn hình. Certbot sẽ tự động cấu hình lại Nginx của bạn để hỗ trợ đường truyền bảo mật HTTPS.

---

## 6. Thiết lập CI/CD bằng GitHub Actions

Chúng ta sẽ cấu hình Github Actions sao cho: Khi bạn `.push` code lên nhánh `main`, Github sẽ tự động SSH vào VPS, pull code mới nhất, build lại và khởi động lại dự án.

### 6.1 Tạo SSH Key cho CI/CD
Trên **VPS** của bạn chạy lệnh sau để tạo một SSH Key (giúp GitHub login Server mà không cần mật khẩu):
```bash
ssh-keygen -t rsa -b 4096 -C "github-actions"
# Khi nó hỏi "Enter file in which to save the key", bấm Enter để lưu mặc định
# Khi hỏi mật khẩu passphrase thì để trống (Bấm Enter 2 lần)
```

Cho phép Key vừa tạo được đăng nhập vào VPS:
```bash
cat ~/.ssh/id_rsa.pub >> ~/.ssh/authorized_keys
```

Lấy nội dung của Khóa Bí mật (**Private Key**) để chép cho GitHub:
```bash
cat ~/.ssh/id_rsa
```
*(Copy toàn bộ nội dung từ `-----BEGIN ... KEY-----` đến `-----END ... KEY-----`)*

### 6.2 Thêm Secret vào kho lưu trữ GitHub (Repository)
1. Lên trang **GitHub Repository** dự án của bạn > **Settings** > **Secrets and variables** > **Actions**.
2. Thêm mới các `Repository secrets`:
   - `HOST`: Điền IP của VPS (ví dụ: `123.45.67.89`)
   - `USERNAME`: Điền username VPS (ví dụ: `root` hoặc thẻ user của bạn)
   - `SSH_KEY`: Dán toàn bộ đoạn Private Key vừa Copy ở bước 6.1.
   
*(Trong trường hợp bạn không dùng SSH Key mà dùng Password VPS thì thay `SSH_KEY` bằng biến tên `PASSWORD` và nhập mật khẩu của VPS - nhưng khuyến cáo dùng Key bảo mật hơn).*

### 6.3 Tạo file Workflow cho CI/CD trên Source Code của bạn
Trên source code của bạn, mở máy tính cá nhân lên (trong local `d:\KIMONO\v0-boty-e-commerce-template`), tạo file yaml ở đường dẫn sau:
`.github/workflows/deploy.yml`

Nhập nội dung cho file này:

```yaml
name: Deploy Next.js to VPS

on:
  push:
    branches:
      - main # Hoặc master tuỳ theo nhánh chính của bạn

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
    - name: Checkout code
      uses: actions/checkout@v3

    - name: Deploy to VPS
      uses: appleboy/ssh-action@v1.0.0
      with:
        host: ${{ secrets.HOST }}
        username: ${{ secrets.USERNAME }}
        key: ${{ secrets.SSH_KEY }}
        port: 22
        script: |
          # Di chuyển tới thư mục chứa source code trên VPS
          cd /var/www/kimono-website
          
          # Pull latest code
          git pull origin main
          
          # Cài đặt dependencies (dùng pnpm hoặc npm tuỳ dự án của bạn)
          pnpm install
          
          # Build nội dung Next.js
          pnpm run build
          
          # Khởi động lại pm2 tiến trình Next.js
          pm2 restart kimono-web
```

### 6.4 Triển khai tự động
- Commit file `.github/workflows/deploy.yml` và push nó lên Github trên branch được chỉ định (`main`).
- Sau khi push, bấm vào mục **Actions** trên Repository. Bạn sẽ thấy quá trình Deploy đang được chạy tự động.
- Từ đây về sau, mỗi lần bạn `git push` code mới, Server của VPS sẽ tự cập nhật phiên bản mới nhất.

---

**Chúc bạn thành công! Nếu cần tuỳ chỉnh các biến môi trường (`.env`), bạn nên tạo thủ công file `.env` trên VPS trong `/var/www/kimono-website/` và không bao gồm file này trên GitHub.**
