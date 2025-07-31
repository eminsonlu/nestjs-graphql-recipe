-- Recipe tablosunu oluştur
CREATE TABLE recipes (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    ingredients TEXT[] NOT NULL,
    instructions TEXT NOT NULL,
    cooking_time INTEGER,
    image_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Test verisi ekle
INSERT INTO recipes (title, description, ingredients, instructions, cooking_time) VALUES
('Makarna', 'Lezzetli makarna tarifi', ARRAY['makarna', 'domates sosu', 'peynir'], 'Makarnayi haşla, sos ekle', 30),
('Omlet', 'Basit omlet', ARRAY['yumurta', 'süt', 'tuz'], 'Yumurtaları çırp, tavada pişir', 10);