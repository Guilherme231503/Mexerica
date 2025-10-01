const products = [
  {
    name: "Mexerica Phone 15 Pro Max",
    price: 5999,
    colors: ["#363636", "#FF8C00", "#F5F5F5"],
    redirect: "mexericaphone.html",
    image: "mexerica_phone_cinza_front.png",
    // novidades
    new: true,
    newImage: "mexerica_phone_new.png",
    newDescription: "Tradição e inovação em um só aparelho.",
    newRedirect: "mexericaphonenew.html"
  },
  {
    name: "Mexerica Phone 15 Plus",
    price: 4999,
    colors: ["#A9B689","#DFCEEA","#96AED1", "#353839", "#F5F5F5"],
    redirect: "mexericaphonem.html",
    image: "mexerica_phone_green_frontm.png",
    // novidades
    new: true,
    newImage: "mexerica_phone_newm.png",
    newDescription: "Tradição e inovação em um só aparelho.",
    newRedirect: "mexericaphonenewm.html"
  }
]
const grid = document.getElementById("product-grid");
const newsContainer = document.getElementById("new-products");

// Renderizar novidades
products.filter(p => p.new).forEach(prod => {
  const card = document.createElement("div");
  card.className = "new-card";

  card.innerHTML = `
    <img src="${prod.newImage}" alt="${prod.name}">
    <h3>${prod.name}</h3>
    <p>${prod.newDescription}</p>
    <a href="${prod.newRedirect}" class="buy-button">Saiba Mais</a>
  `;

  newsContainer.appendChild(card);
});

// Renderizar catálogo normal
products.forEach(prod => {
  const card = document.createElement("div");
  card.className = "product-card";

  card.innerHTML = `
    <img src="${prod.image}" alt="${prod.name}">
    <h2>${prod.name}</h2>
    <div class="swatch-row">
      ${prod.colors.map(c => `<span class="swatch" style="--swatch-color:${c}; ${c.includes('#f5f5f5') ? 'border:1px solid #ddd;' : ''}"></span>`).join('')}
    </div>
    <span class="price">A partir de R$ ${prod.price.toLocaleString('pt-BR')}</span>
    <a href="${prod.redirect}" class="buy-button">Comprar</a>
  `;

  grid.appendChild(card);
});