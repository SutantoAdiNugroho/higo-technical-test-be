# Higo Technical Test Backend API Data customers

Project backend yang dibangun dengan Express.js, Mongoose, dan Nodemon untuk pengelolaan data customers. API ini mendukung upload data CSV, pengambilan data customers dengan filter dan pagination, dan agregation data untuk distribusi gender.

## Fitur

* **Upload CSV:** Mengunggah file CSV dan menyimpannya ke MongoDB.
* **Data customers:** Mengambil daftar data customers dengan fitur filter berdasarkan gender dan pagination.
* **Distribusi Gender:** Menyediakan data agregation jumlah customers berdasarkan gender untuk keperluan charting.
* **Dokumentasi API:** Dokumentasi interaktif menggunakan Swagger UI.

## Requirement

Sebelum menjalankan project ini, pastikan telah menginstal:

* **Node.js** (versi 14.x atau lebih tinggi)
* **npm** (Node Package Manager biasanya sudah terinstal bersama Node.js)
* **MongoDB** (server database harus berjalan, default di `localhost:27017`)

## Instalasi

1.  **Clone repositori ini:**
    ```bash
    git clone <URL_REPO>
    cd <nama_folder_project_backend>
    ```
2.  **Instal dependensi:**
    ```bash
    npm install
    ```

## Environment Variable

Buat file `.env` di root folder project backend dan tambahkan variabel-variabel berikut:
   ```
    HOST=http://localhost
    PORT=8080
    IS_PRODUCTION=false
    MONGO_URI=mongodb://localhost:27017/db-technical-test-higo
   ```

## API Endpoints

Beberapa endpoint API yang disediakan oleh backend ini:

* `POST /api/customers/upload`: Bulk upload customer data ke dalam DB.
* `GET /api/customers/gender-distribution`: Mengambil agregation data untuk distribusi gender customers.
* `GET /api/customers`: Mengambil data customers dengan filter dan pagination.
* `GET /api-docs`: API Documentation with Swagger UI.