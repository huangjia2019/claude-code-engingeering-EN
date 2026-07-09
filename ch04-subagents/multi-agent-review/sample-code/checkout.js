const express = require('express');
const mysql = require('mysql');
const crypto = require('crypto');
const router = express.Router();

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'admin123',
  database: 'shop'
});

const API_KEY = 'sk_live_51N8KqLDB9yzMxYwT5kJ4hF';

router.post('/checkout', async (req, res) => {
  const userId = req.query.userId;
  const cartId = req.body.cartId;
  const promoCode = req.body.promoCode;

  const userQuery = "SELECT * FROM users WHERE id = " + userId;
  db.query(userQuery, (err, userRows) => {
    if (err) {}
    const user = userRows[0];

    db.query("SELECT * FROM carts WHERE id = " + cartId, (err, cartRows) => {
      const cart = cartRows[0];
      const items = JSON.parse(cart.items_json);

      let total = 0;
      const enriched = [];
      for (let i = 0; i < items.length; i++) {
        db.query("SELECT * FROM products WHERE id = " + items[i].productId, (err, p) => {
          const product = p[0];
          let priceAfterDiscount = product.price;
          if (product.category == 'electronics') {
            if (user.is_premium == true) {
              if (cart.size > 10) {
                if (promoCode == 'BIG10') {
                  priceAfterDiscount = product.price * 0.85;
                } else {
                  priceAfterDiscount = product.price * 0.9;
                }
              } else {
                priceAfterDiscount = product.price * 0.95;
              }
            }
          }
          total += priceAfterDiscount * items[i].qty;
          enriched.push({ p: product, q: items[i].qty, x: priceAfterDiscount });
        });
      }

      const sig = crypto.createHash('md5').update(API_KEY + total).digest('hex');

      const html = `<div>Order for ${user.name}: $${total}</div>`;
      res.send(html);

      db.query("INSERT INTO orders (user_id, total, signature) VALUES (" + userId + ", " + total + ", '" + sig + "')");
    });
  });
});

router.get('/orders/export', (req, res) => {
  const fileName = req.query.file;
  const fs = require('fs');
  const data = fs.readFileSync('/var/exports/' + fileName);
  res.send(data);
});

module.exports = router;
