# 🎄 Giáng Sinh Vũ Trụ - Ký Ức Trên Quỹ Đạo 🌌

Một trải nghiệm web 3D tương tác đậm chất điện ảnh, nơi những kỷ niệm đẹp nhất được tái hiện giữa vũ trụ bao la cùng cây thông ánh sáng lung linh. Món quà ý nghĩa dành tặng người thương dịp Giáng Sinh.

![Demo](https://via.placeholder.com/800x450?text=Cosmic+Christmas+Demo)

## ✨ Tính Năng Nổi Bật

*   **Vũ Trụ 3D Sống Động:** Hiệu ứng sương mù, tinh vân (nebula) và hàng ngàn ngôi sao lấp lánh.
*   **Cây Thông Ánh Sáng:** Được tạo thành từ hàng ngàn hạt (particles) với hiệu ứng "breathing" nhẹ nhàng.
*   **Triển Lãm Ảnh Đa Chiều:**
    *   **Chế độ Quỹ Đạo (Orbit):** Ảnh xoay quanh cây thông như những hành tinh.
    *   **Dòng Chảy Ký Ức (Cinematic Flow):** Trải nghiệm bay xuyên qua "đường hầm thời gian" với hiệu ứng bùng nổ thị giác.
*   **Giao Diện Cinematic:** Thiết kế kính (Glassmorphism), icon tinh gọn, và thiệp chúc mừng lãng mạn.
*   **Tương Tác Mượt Mà:** Zoom, xoay, tự động trình chiếu (slideshow).

## 🚀 Hướng Dẫn Cài Đặt & Chạy

Dự án sử dụng **Three.js** và **ES Modules**, vì vậy bạn cần chạy trên một Local Web Server (không thể mở trực tiếp file `.html` bằng cách click đúp).

### 1. Chuẩn Bị Ảnh
1.  Copy các bức ảnh kỷ niệm của bạn vào thư mục `images/`.
2.  Hỗ trợ các định dạng: `.jpg`, `.png`, `.jpeg`.
3.  **Quan trọng:** Chạy script để cập nhật danh sách ảnh vào ứng dụng:
    *   **Windows:** Click chuột phải vào file `generate_manifest.ps1` -> Chọn **Run with PowerShell**.
    *   Script sẽ tự động quét thư mục `images/` và cập nhật file `js/image_manifest.js`.
    *   **Lưu ý:** Nếu bạn thêm ảnh mới, bạn *bắt buộc* phải chạy lại script này và refresh trình duyệt.

### 2. Chạy Dự Án (Chọn 1 trong các cách sau)

#### Cách A: Dùng Python (Có sẵn trên hầu hết máy tính)
Mở Terminal/Command Prompt tại thư mục dự án và gõ:
```bash
# Python 3
python -m http.server 8080
```
Sau đó mở trình duyệt truy cập: `http://localhost:8080`

#### Cách B: Dùng VS Code (Khuyên dùng)
1.  Cài đặt Extension **Live Server**.
2.  Chuột phải vào file `index.html` -> Chọn **Open with Live Server**.

#### Cách C: Dùng Node.js
Nếu bạn đã cài Node.js:
```bash
npx http-server .
```

## 🎮 Cách Sử Dụng
*   **Xoay/Zoom:** Dùng chuột trái để xoay, con lăn để zoom.
*   **🚀 (Rocket):** Bay vào quỹ đạo để ngắm cây thông gần hơn.
*   **🖼️ (Gallery):** Bật chế độ xem ảnh tự động (Slideshow).
*   **∞ (Infinity):** Kích hoạt chế độ "Dòng Chảy Ký Ức" - Hiệu ứng đường hầm thời gian.
*   **✉️ (Envelope):** Mở thiệp chúc mừng.

## 🛠️ Công Nghệ Sử Dụng
*   **HTML5 / CSS3:** Animations & Glassmorphism UI.
*   **Three.js:** Thư viện 3D graphics mạnh mẽ.
*   **Post-processing:** UnrealBloomPass (Hiệu ứng phát sáng Neon).
*   **PowerShell:** Tự động hóa xử lý ảnh đầu vào.

---
*Chúc bạn có một mùa Giáng Sinh ấm áp và hạnh phúc! ❤️*
