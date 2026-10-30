const express = require("express");
const path = require("path");
const fs = require("fs");
const Database = require("better-sqlite3");

const app = express();
const PORT = 3000;

// ---------- Подключение к БД ----------
const dbPath = path.join(__dirname, "database", "shop.db");
const db = new Database(dbPath);
db.pragma("foreign_keys = ON");

// Создаём таблицы, если их нет
const schema = fs.readFileSync(path.join(__dirname, "database", "schema.sql"), "utf8");
db.exec(schema);

// ---------- Middleware ----------
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// ---------- Серверная валидация ----------
function validateProduct(data) {
  const errors = {};
  const name = (data.name || "").trim();
  const price = parseFloat(data.price);
  const category_id = parseInt(data.category_id, 10);

  if (!name) errors.name = "Название обязательно";
  else if (name.length > 200) errors.name = "Название слишком длинное";

  if (isNaN(price) || price <= 0) errors.price = "Цена должна быть числом больше 0";
  if (!category_id || isNaN(category_id)) errors.category_id = "Выберите категорию";

  return {
    errors,
    clean: {
      name,
      description: (data.description || "").trim(),
      price,
      category_id,
    },
  };
}

// ---------- Главная ----------
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// ---------- READ: список товаров ----------
app.get("/catalog", (req, res) => {
  const products = db
    .prepare(
      `SELECT p.id, p.name, p.description, p.price, c.name AS category_name
       FROM products p
       JOIN categories c ON c.id = p.category_id
       ORDER BY p.id DESC`
    )
    .all();
  res.render("catalog", { products });
});

// ---------- CREATE: форма добавления (ДО /product/:id!) ----------
app.get("/product/add", (req, res) => {
  const categories = db.prepare("SELECT * FROM categories").all();
  res.render("add-product", { categories, errors: {}, values: {} });
});

// ---------- CREATE: обработка POST ----------
app.post("/product/add", (req, res) => {
  const { errors, clean } = validateProduct(req.body);
  const categories = db.prepare("SELECT * FROM categories").all();

  if (Object.keys(errors).length > 0) {
    return res.status(422).render("add-product", {
      categories,
      errors,
      values: req.body,
    });
  }

  db.prepare(
    "INSERT INTO products (name, description, price, category_id) VALUES (?, ?, ?, ?)"
  ).run(clean.name, clean.description, clean.price, clean.category_id);

  res.redirect("/catalog");
});

// ---------- UPDATE: форма редактирования (ДО /product/:id!) ----------
app.get("/product/:id/edit", (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) return res.status(400).send("Некорректный id");

  const product = db.prepare("SELECT * FROM products WHERE id = ?").get(id);
  if (!product) return res.status(404).send("Товар не найден");

  const categories = db.prepare("SELECT * FROM categories").all();
  res.render("edit-product", { product, categories, errors: {} });
});

// ---------- UPDATE: обработка POST ----------
app.post("/product/:id/edit", (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) return res.status(400).send("Некорректный id");

  const existing = db.prepare("SELECT * FROM products WHERE id = ?").get(id);
  if (!existing) return res.status(404).send("Товар не найден");

  const { errors, clean } = validateProduct(req.body);
  const categories = db.prepare("SELECT * FROM categories").all();

  if (Object.keys(errors).length > 0) {
    return res.status(422).render("edit-product", {
      product: { ...existing, ...req.body, id },
      categories,
      errors,
    });
  }

  db.prepare(
    "UPDATE products SET name = ?, description = ?, price = ?, category_id = ? WHERE id = ?"
  ).run(clean.name, clean.description, clean.price, clean.category_id, id);

  res.redirect("/product/" + id);
});

// ---------- DELETE ----------
app.post("/product/:id/delete", (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) return res.status(400).send("Некорректный id");

  const result = db.prepare("DELETE FROM products WHERE id = ?").run(id);
  if (result.changes === 0) return res.status(404).send("Товар не найден");
  res.redirect("/catalog");
});

// ---------- READ: один товар (ПОСЛЕ /product/add) ----------
app.get("/product/:id", (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) return res.status(400).send("Некорректный id");

  const product = db
    .prepare(
      `SELECT p.*, c.name AS category_name
       FROM products p
       JOIN categories c ON c.id = p.category_id
       WHERE p.id = ?`
    )
    .get(id);

  if (!product) return res.status(404).send("Товар не найден");
  res.render("product", { product });
});

// ---------- 404 ----------
app.use((req, res) => {
  res.status(404).send("Страница не найдена");
});

app.listen(PORT, () => {
  console.log(`Сервер запущен: http://localhost:${PORT}`);
});