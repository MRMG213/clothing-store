-- Создание таблиц
CREATE TABLE IF NOT EXISTS categories (
    id   INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS products (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    name        TEXT    NOT NULL,
    description TEXT,
    price       REAL    NOT NULL CHECK (price > 0),
    category_id INTEGER NOT NULL,
    FOREIGN KEY (category_id) REFERENCES categories(id)
);

-- Начальные категории
INSERT OR IGNORE INTO categories (name) VALUES
    ('Верх'),
    ('Верхняя одежда'),
    ('Низ'),
    ('Аксессуары');

-- Начальные товары (каждый вставляется, только если такого ещё нет)
INSERT INTO products (name, description, price, category_id)
SELECT 'Футболка Oversize Cotton', 'Плотный хлопок 240 г/м², свободный крой.', 1990, 1
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Футболка Oversize Cotton');

INSERT INTO products (name, description, price, category_id)
SELECT 'Куртка Bomber Classic', 'Ветрозащитная ткань, утеплитель.', 7490, 2
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Куртка Bomber Classic');

INSERT INTO products (name, description, price, category_id)
SELECT 'Джинсы Slim Indigo', 'Стрейч-деним, посадка slim.', 4290, 3
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Джинсы Slim Indigo');

INSERT INTO products (name, description, price, category_id)
SELECT 'Худи Fleece Basic', 'Мягкий футер с начёсом.', 3590, 1
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Худи Fleece Basic');

INSERT INTO products (name, description, price, category_id)
SELECT 'Шарф Wool Blend', 'Тёплая шерстяная смесь, 180×30 см.', 1290, 4
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Шарф Wool Blend');

INSERT INTO products (name, description, price, category_id)
SELECT 'Пальто Wool Long', 'Длинное пальто из шерстяной смеси.', 11900, 2
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Пальто Wool Long');