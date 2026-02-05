let catalogData = null;

// Carregar JSON
fetch("catalog.json")
    .then(res => res.json())
    .then(data => {
        catalogData = data;
        loadCategories(data.categories);
        loadProducts(data.products);
        loadProductSelect(data.products);
        styleOrderForm(); // apply styles on page load
    })
    .catch(err => console.error("Erro ao carregar JSON:", err));

// Dropdown
function loadCategories(categories) {
    const select = document.getElementById("category-filter");

    const categoryFilter = document.getElementById("category-filter");
    
    Object.assign(categoryFilter.style, {
        padding: "8px 12px",
        border: "2px solid #D7707E",
        backgroundColor: "#FFC5D3",
        color: "#484948",
        fontSize: "1rem",
        cursor: "pointer",
        outline: "none",
        width: "80%",
        maxWidth: "250px",
});


    categories.forEach(cat => {
        const option = document.createElement("option");
        option.value = cat.id;
        option.textContent = cat.name;
        select.appendChild(option);
    });
}

// Produtos
function loadProducts(products) {
    const container = document.getElementById("product-list");
    container.innerHTML = "";
    
    Object.assign(container.style, {
        display: "flex",
        flexWrap: "wrap",
        gap: "20px",
        width: "100%",
        margin: "0 auto",
    });

    products.forEach(product => {
        const div = document.createElement("div");
        div.classList.add("product");

        Object.assign(div.style, {
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "flex-start",
            backgroundColor: "white",
            padding: "10px",
            borderRadius: "20px",
            textAlign: "center",
            width: "33.3%",
            flex: "1 1 250px",
            minWidth: "180px",
            maxWidth: "400px",
            boxShadow: "2px 2px 5px #D7707E",
            margin: "20px",
            boxSizing: "border-box",
        });

        div.innerHTML = `
            <h3>${product.name}</h3>
            <img src="${product.images[0]}" alt="${product.name}" class="product-card-img">
            <p>${product.price} €</p>
            <button class="details-btn">Ver Detalhes</button>
        `;

        const img = div.querySelector(".product-card-img");
        Object.assign(img.style, {
            width: "100%",
            maxWidth: "700px",
            height: "auto",
            borderRadius: "10px",
            objectFit: "cover",
            display: "block",
            marginBottom: "10px",
        });

        const detailsBtn = div.querySelector(".details-btn");
        Object.assign(detailsBtn.style, {
            padding: "8px 12px",
            border: "2px solid #D7707E",
            backgroundColor: "#FFC5D3",
            color: "#484948",
            fontSize: "1rem",
            cursor: "pointer",
            outline: "none",
            borderRadius: "10px",
            marginTop: "10px",
        });
        
        detailsBtn.addEventListener("click", () => {
            openLightbox(product);
        });

        div.querySelector(".details-btn").addEventListener("click", () => {
            openLightbox(product);
        });

        container.appendChild(div);
    });

    if (products.length === 1) container.style.justifyContent = "center";
}

// Filtrar Produtos
document.getElementById("category-filter").addEventListener("change", function() {
    const selected = this.value;
    if (selected === "") loadProducts(catalogData.products);
    else loadProducts(catalogData.products.filter(p => p.category === selected));
});

// Produtos Filtrados
function loadProductSelect(products) {
    const select = document.getElementById("product");
    products.forEach(p => {
        const option = document.createElement("option");
        option.value = p.id;
        option.textContent = p.name;
        select.appendChild(option);
    });
}

// Lightbox
const lightbox = document.getElementById("lightbox");
const content = document.querySelector(".lightbox-content");
const lightboxImg = document.getElementById("lightbox-image");
const lightboxTitle = document.getElementById("lightbox-title");
const lightboxPrice = document.getElementById("lightbox-price");
const lightboxDesc = document.getElementById("lightbox-description");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");

let currentProduct = null;
let currentIndex = 0;

prevBtn.style.display = "none";
nextBtn.style.display = "none"

function openLightbox(product) {
    currentProduct = product;
    currentIndex = 0;
    showLightboxImage();

    if (currentProduct.images.length > 1) {
        prevBtn.style.display = "inline-block";
        nextBtn.style.display = "inline-block";
    } else {
        prevBtn.style.display = "none";
        nextBtn.style.display = "none";
    }

    lightbox.style.display = "flex";
    lightbox.style.opacity = 0;

    Object.assign(lightbox.style, {
        position: "fixed",
        top: "0",
        left: "0",
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0,0,0,0.6)",
        justifyContent: "center",
        alignItems: "center",
        zIndex: "9999",
        transition: "opacity 0.3s ease"
    });

    Object.assign(content.style, {
        backgroundColor: "white",
        padding: "20px",
        borderRadius: "20px",
        boxShadow: "2px 2px 10px #D7707E",
        textAlign: "center",
        maxWidth: "400px",
        width: "90%",
        transition: "transform 0.3s ease"
    });

    let opacity = 0;
    const fadeIn = setInterval(() => {
        opacity += 0.05;
        if(opacity >= 1) { opacity = 1; clearInterval(fadeIn); }
        lightbox.style.opacity = opacity;
    }, 15);

    Object.assign(lightboxImg.style, {
        width: "100%",
        maxWidth: "400px",
        height: "auto",
        borderRadius: "15px",
        objectFit: "cover",
        margin: "10px 0",
        display: "block"
    });

    [prevBtn, nextBtn].forEach(btn => {
        Object.assign(btn.style, {
            padding: "5px 10px",
            margin: "5px",
            cursor: "pointer",
            borderRadius: "10px",
            border: "none",
            backgroundColor: "#FFC5D3",
            color: "#484948",
            fontWeight: "600"
        });
    });
}

function showLightboxImage() {
    if (!currentProduct) return;
    lightboxImg.src = currentProduct.images[currentIndex];
    lightboxTitle.textContent = currentProduct.name;
    lightboxPrice.textContent = currentProduct.price + " €";
    lightboxDesc.textContent = currentProduct.description;
}

nextBtn.addEventListener("click", () => {
    if (!currentProduct) return;
    currentIndex = (currentIndex + 1) % currentProduct.images.length;
    showLightboxImage();
});

prevBtn.addEventListener("click", () => {
    if (!currentProduct) return;
    currentIndex = (currentIndex - 1 + currentProduct.images.length) % currentProduct.images.length;
    showLightboxImage();
});

lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) {
        let opacity = 1;
        const fadeOut = setInterval(() => {
            opacity -= 0.05;
            if (opacity <= 0) {
                opacity = 0;
                clearInterval(fadeOut);
                lightbox.style.display = "none";
            }
            lightbox.style.opacity = opacity;
            content.style.transform = `scale(${0.9 + 0.1 * opacity})`;
        }, 15);
    }
});

// Caixa para Calcular Valores
function styleOrderForm() {
    const orderForm = document.getElementById("order-form");
    Object.assign(orderForm.style, {
        backgroundColor: "white",
        padding: "20px",
        borderRadius: "20px",
        boxShadow: "2px 2px 5px #D7707E",
        maxWidth: "400px",
        margin: "30px auto",
        textAlign: "center",
        fontFamily: '"Bitcount Prop Single", sans-serif',
    });

    const calcForm = document.getElementById("calc-form");
    Object.assign(calcForm.style, {
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        alignItems: "center",
    });

    const productSelect = document.getElementById("product");
    Object.assign(productSelect.style, {
        padding: "8px 12px",
        border: "2px solid #D7707E",
        backgroundColor: "#FFC5D3",
        color: "#484948",
        fontSize: "1rem",
        cursor: "pointer",
        outline: "none",
        width: "80%",
        maxWidth: "250px",
    });

    const quantityInput = document.getElementById("quantity");
    Object.assign(quantityInput.style, {
        padding: "8px 12px",
        border: "2px solid #D7707E",
        fontSize: "1rem",
        width: "80%",
        maxWidth: "250px",
    });

    const calcBtn = document.getElementById("calculate");
    Object.assign(calcBtn.style, {
        padding: "8px 20px",
        borderRadius: "20px",
        border: "none",
        backgroundColor: "#FFC5D3",
        color: "#484948",
        fontWeight: "600",
        cursor: "pointer",
        transition: "all 0.3s ease",
        borderRadius: "10px",
    });
    calcBtn.addEventListener("mouseover", () => {
        calcBtn.style.backgroundColor = "#D7707E";
        calcBtn.style.color = "white";
    });
    calcBtn.addEventListener("mouseout", () => {
        calcBtn.style.backgroundColor = "#FFC5D3";
        calcBtn.style.color = "#484948";
    });

    const totalDisplay = document.getElementById("total-value");
    Object.assign(totalDisplay.style, {
        marginTop: "15px",
        fontWeight: "600",
        fontSize: "1.2rem",
        color: "#D7707E",
    });
}

// Valor Total
document.getElementById("calculate").addEventListener("click", () => {
    const productId = document.getElementById("product").value;
    const quantity = document.getElementById("quantity").value;

    if (productId === "") {
        alert("Escolha um produto!");
        return;
    }
    if (quantity <= 0) {
        alert("Quantidade inválida!");
        return;
    }

    const product = catalogData.products.find(p => p.id === productId);
    const total = parseFloat(product.price) * quantity;

    document.getElementById("total-value").textContent =
        "Valor Total: " + total.toFixed(2) + " €";
});