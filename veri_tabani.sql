CREATE DATABASE IF NOT EXISTS ekutuphane
CHARACTER SET utf8mb4
COLLATE utf8mb4_turkish_ci;

USE ekutuphane;

-- Kullanıcı Tablosu
CREATE TABLE kullanici (
    kullanici_id INT AUTO_INCREMENT PRIMARY KEY,
    kullanici_isim VARCHAR(100) NOT NULL,
    kullanici_soyisim VARCHAR(100) NOT NULL,
    kullanici_mail VARCHAR(150) NOT NULL UNIQUE,
    kullanici_sifre VARCHAR(255) NOT NULL,
    kullanici_aktif_mi BOOLEAN DEFAULT TRUE,
    kullanici_admin_mi BOOLEAN DEFAULT FALSE
);

-- Yazar Tablosu
CREATE TABLE yazar
(
    yazar_id INT AUTO_INCREMENT PRIMARY KEY,
    yazar_adi VARCHAR(100) NOT NULL,
    yazar_soyadi VARCHAR(100) NOT NULL
);

-- Kategori Tablosu
CREATE TABLE kategori
(
    kategori_id INT AUTO_INCREMENT PRIMARY KEY,
    kategori_adi VARCHAR(100) NOT NULL UNIQUE
);

-- Kitap Tablosu
CREATE TABLE kitap
(
    kitap_id INT AUTO_INCREMENT PRIMARY KEY,
    kitap_api_id VARCHAR(100) UNIQUE NULL,
    kitap_adi VARCHAR(255) NOT NULL,
    yazar_id INT NOT NULL,
    kitap_aciklama TEXT,
    kitap_kapak VARCHAR(500),
    kitap_yayin_yili INT,
    FOREIGN KEY (yazar_id) REFERENCES Yazar (yazar_id) ON DELETE RESTRICT
);

-- Kullanici_kitap Tablosu
CREATE TABLE kullanici_kitap (
    kullanici_id INT NOT NULL,
    kitap_id INT NOT NULL,
    okuma_tarihi DATE NULL,
    durum ENUM('okundu', 'okunuyor', 'sonra_okunacak') NOT NULL DEFAULT 'sonra_okunacak',
    PRIMARY KEY (kullanici_id, kitap_id),
    FOREIGN KEY (kullanici_id) REFERENCES Kullanici(kullanici_id) ON DELETE CASCADE,
    FOREIGN KEY (kitap_id) REFERENCES Kitap(kitap_id) ON DELETE CASCADE
);

-- Kitap_kategori Tablosu
CREATE TABLE kitap_kategori (
    kitap_id INT NOT NULL,
    kategori_id INT NOT NULL,
    PRIMARY KEY (kitap_id, kategori_id),
    FOREIGN KEY (kitap_id) REFERENCES Kitap(kitap_id) ON DELETE CASCADE,
    FOREIGN KEY (kategori_id) REFERENCES Kategori(kategori_id) ON DELETE CASCADE
);

