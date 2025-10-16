// Прості дані товарів
const PRODUCTS = [
  { id: 1, name: 'Яблука (5 кг)', price: 45, category: 'Фрукти', img: 'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&s=placeholder' },
  { id: 2, name: 'Банани (6 кг)', price: 55, category: 'Фрукти', img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRhT7S5nNfO_uWMVk0IAs5YTzu6hHjJ0coLiA&s' },
  { id: 3, name: 'Молоко 1л', price: 38, category: 'Молочні', img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRgP_W9EdV6vr1-Q2_mUZmMBNn0yfnoj4k1DQ&s' },
  { id: 4, name: 'Сир твердий 300г', price: 220, category: 'Молочні', img: 'https://nssz.com.ua/image/catalog/blog/17%20may%202017-min.jpg' },
  { id: 5, name: 'Хліб житній(15 шт)', price: 28, category: 'Випічка', img: 'https://monolit.te.ua/media/cache/4a/e9/4ae9467eabb2931b8e30eb821afbe69e.jpg' },
  { id: 6, name: 'Картопля (8 кг)', price: 20, category: 'Овочі', img: 'https://yaskravaklumba.com.ua/image/cache/catalog/semena/kartofel/corinna-2-500x500.jpg' },
  { id: 7, name: 'Морква (12 кг)', price: 22, category: 'Овочі', img: 'https://gardenclub.ua/wp-content/uploads/2023/01/2a234fbc76e45a9149bc55ef47b4a58a794cdb49-1.jpeg' },
  { id: 8, name: 'Яйця 10 шт', price: 60, category: 'Молочні', img: 'https://golden-flamingo.com.ua/wp-content/uploads/2024/01/yajcz.jpg' },
  { id: 9, name: 'Апельсини (5 кг)', price: 70, category: 'Фрукти', img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTWTf-q7NUGshCbLG6_4pBJKIwvxkFCd40dnw&s' },
  { id: 10, name: 'булочка з маком (20 шт)', price: 15, category: 'Випічка', img: 'https://i.obozrevatel.com/food/recipemain/2019/1/17/depositphotos133055330-stock-photo-buns-with-poppy-seeds-and.jpg?size=636x424' },
  { id: 11, name: 'Печиво (1 кг)', price: 80, category: 'Випічка', img: 'https://klymovska.com/wp-content/uploads/2022/11/cookies-with-chocolate-and-nuts.jpg' },
  { id: 12, name: 'Груша (5 кг)', price: 50, category: 'Фрукти', img: 'https://yaskravaklumba.com.ua/image/catalog/blog_l/top/grusha/grushadjushes3.jpg' },

];

// State
let cart = JSON.parse(localStorage.getItem('cart_demo') || '{}');

// Init
const productsEl = document.getElementById('products');
const cartCount = document.getElementById('cartCount');
const overlay = document.getElementById('overlay');
const cartList = document.getElementById('cartList');
const cartTotal = document.getElementById('cartTotal');
const search = document.getElementById('search');
const category = document.getElementById('category');

function uniqueCategories() {
  const cats = Array.from(new Set(PRODUCTS.map(p => p.category)));
  for (const c of cats) {
    const opt = document.createElement('option'); opt.value = c; opt.textContent = c; category.appendChild(opt);
  }
}

function renderProducts(filter = '') {
  const q = search.value.trim().toLowerCase();
  const cat = category.value;
  productsEl.innerHTML = '';
  const list = PRODUCTS.filter(p => {
    if (cat !== 'all' && p.category !== cat) return false;
    if (!q) return true;
    return p.name.toLowerCase().includes(q);
  });
  for (const p of list) {
    const card = document.createElement('div'); card.className = 'card';
    card.innerHTML = `
          <div class="imgwrap"><img src="${p.img}" alt="${p.name}"></div>
          <div class="name">${p.name}</div>
          <div class="meta"><div class="price">${p.price} ₴</div><button class="add" data-id="${p.id}">Додати</button></div>
        `;
    productsEl.appendChild(card);
  }
  // attach add handlers
  document.querySelectorAll('.add').forEach(btn => btn.addEventListener('click', () => {
    const id = btn.getAttribute('data-id'); addToCart(Number(id));
  }))
}

function saveCart() { localStorage.setItem('cart_demo', JSON.stringify(cart)); updateCartUI(); }

function addToCart(id) { cart[id] = (cart[id] || 0) + 1; saveCart(); }

function removeFromCart(id) { delete cart[id]; saveCart(); }

function changeQty(id, delta) { if (!cart[id]) return; cart[id] += delta; if (cart[id] <= 0) delete cart[id]; saveCart(); }
function updateCartUI() {
  const entries = Object.entries(cart); // [["1",2], ["2",1], ...]
  if (entries.length === 0) {
    cartCount.textContent = 0;
    cartList.innerHTML = '<div style="padding:10px;color:gray">Кошик порожній</div>';
    cartTotal.textContent = 0;
    return;
  }

  const items = entries
    .map(([id, q]) => {
      const product = PRODUCTS.find(p => p.id === Number(id));
      if (!product) return null; // якщо не знайшли товар → null
      return { ...product, qty: q };
    })
    .filter(item => item !== null); // прибираємо undefined/null

  cartCount.textContent = items.reduce((s, i) => s + i.qty, 0);
  cartList.innerHTML = '';
  let total = 0;

  for (const it of items) {
    total += it.price * it.qty;
    const div = document.createElement('div');
    div.className = 'cart-item';
    div.innerHTML = `
      <img src="${it.img}" alt="${it.name}">
      <div style="flex:1">
        <div style="font-weight:600">${it.name}</div>
        <div style="color:var(--muted);font-size:13px">${it.price} ₴ x ${it.qty} = ${it.price * it.qty} ₴</div>
      </div>
      <div class="qty">
        <button data-id="${it.id}" class="dec">-</button>
        <div>${it.qty}</div>
        <button data-id="${it.id}" class="inc">+</button>
        <button data-id="${it.id}" class="rem" style="margin-left:8px;border:0;background:transparent;cursor:pointer">🗑</button>
      </div>
    `;
    cartList.appendChild(div);
  }

  cartTotal.textContent = total;

  // attach handlers
  cartList.querySelectorAll('.inc').forEach(b =>
    b.addEventListener('click', () => changeQty(b.dataset.id, 1))
  );
  cartList.querySelectorAll('.dec').forEach(b =>
    b.addEventListener('click', () => changeQty(b.dataset.id, -1))
  );
  cartList.querySelectorAll('.rem').forEach(b =>
    b.addEventListener('click', () => removeFromCart(b.dataset.id))
  );
}


// UI events
document.getElementById('openCart').addEventListener('click', () => { overlay.style.display = 'flex'; updateCartUI(); });
document.getElementById('closeCart').addEventListener('click', () => overlay.style.display = 'none');
document.getElementById('clearCart').addEventListener('click', () => { cart = {}; saveCart(); });
document.getElementById('checkout').addEventListener('click', () => {
  if (Object.keys(cart).length === 0) {
    alert('Кошик порожній');
    return;
  }
  alert('Дякуємо! Ваше замовлення прийнято (демо).');
  cart = {}; // залишаємо як обʼєкт
  saveCart(); // зберігаємо пустий кошик
  overlay.style.display = 'none';
});

search.addEventListener('input', () => renderProducts());
category.addEventListener('change', () => renderProducts());

// Init run
uniqueCategories(); renderProducts(); updateCartUI();