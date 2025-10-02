// Preço base do Mexerica Phone 1 Pro (128 GB, 8GB RAM)
let BASE_PRICE = 0;
let currentPrice = BASE_PRICE;

const finalPriceDisplay = document.getElementById('final-price');
const colorNameDisplay = document.getElementById('color-name');
const multiColorView = document.getElementById('multi-color-view');
const mainCarousel = document.getElementById('main-carousel');
const colorSwatches = document.querySelectorAll('.swatch');
const storageOptions = document.querySelectorAll('.storage-option');
const memoryOptions = document.querySelectorAll('.memory-option'); // NOVO
const modelOptions = document.querySelectorAll('.model-option');
const backDetailImg = document.getElementById('back-detail-img');

// Objeto de mapeamento de cores
const colorNames = {
    'green': 'Verde-Amazônia',
    'lavande': 'Lavanda',
    'blue': 'Céu-Nordestino',
    'black': 'Cor-do-Pecado',
    'asa-branca': 'Asa Branca'
};

// =======================================================
// 1. INICIALIZAÇÃO DO SLICK CAROUSEL
// =======================================================

$(document).ready(function(){
    // Carrossel Principal (Frente/Verso)
    $('#main-carousel').slick({
        infinite: false,
        slidesToShow: 1,
        slidesToScroll: 1,
        dots: true, 
        arrows: false,
        speed: 500,
        fade: true,
        cssEase: 'linear',
        
        // Customiza a navegação para mostrar Frente/Verso com texto
        customPaging: function(slider, i) {
            const label = (i === 0) ? 'Frente' : 'Verso';
            return `<button class="slick-custom-label">${label}</button>`;
        }
    });

    // Carrossel de Detalhes (Fundo da página)
    $('#detail-carousel').slick({
        infinite: false,
        slidesToShow: 1,
        slidesToScroll: 1,
        dots: true, // Usa bolinhas (dots)
        arrows: true,
        speed: 300,
        adaptiveHeight: true
    });
});


// =======================================================
// 2. LÓGICA DE GESTÃO DA VIEW E TROCA DE COR
// =======================================================

function activateCarouselView(color) {
    // 1. Esconde a vista de 3 cores e mostra o carrossel (GSAP para a transição suave)
    if (multiColorView.classList.contains('active')) {
        gsap.to(multiColorView, {
            opacity: 0,
            duration: 0.5,
            onComplete: () => {
                multiColorView.classList.remove('active');
                multiColorView.classList.add('hidden');
                
                mainCarousel.classList.remove('hidden');
                mainCarousel.classList.add('active');
                gsap.fromTo(mainCarousel, { opacity: 0 }, { opacity: 1, duration: 0.5 });
            }
        });
    }

    // 2. TROCA AS IMAGENS DENTRO DOS SLIDES DO SLICK
    const frontSlideImg = $('#main-carousel .main-slide[data-view="front"] .carousel-img');
    const backSlideImg = $('#main-carousel .main-slide[data-view="back"] .carousel-img');
    
    gsap.to([frontSlideImg, backSlideImg], {
        opacity: 0,
        duration: 0.2,
        onComplete: () => {
            frontSlideImg.attr('src', `mexerica_phone_${color}_frontm.png`);
            backSlideImg.attr('src', `mexerica_phone_${color}_backm.png`);
            
            gsap.to([frontSlideImg, backSlideImg], { opacity: 1, duration: 0.2 });

            // 3. ATUALIZAÇÃO DO VERSO NA SEÇÃO DE DETALHES
            backDetailImg.src = `mexerica_phone_${color}_back_fullm.png`;

            // Garante que o carrossel principal volte para o primeiro slide (Frente)
            $('#main-carousel').slick('slickGoTo', 0);
        }
    });
}

colorSwatches.forEach(swatch => {
    swatch.addEventListener('click', function() {
        document.querySelector('.swatch.selected').classList.remove('selected');
        this.classList.add('selected');

        const newColor = this.getAttribute('data-color');
        colorNameDisplay.textContent = colorNames[newColor];

        activateCarouselView(newColor);
    });
});


// =======================================================
// 2.1. LÓGICA DE SELEÇÃO DE MEMÓRIA RAM
// =======================================================

memoryOptions.forEach(option => {
    option.addEventListener('click', function() {
        // Encontra o elemento atualmente selecionado no grupo de memória e remove a classe
        document.querySelectorAll('.memory-option.selected').forEach(selected => {
            selected.classList.remove('selected');
        });
        
        // Adiciona a classe de selecionado ao novo elemento
        this.classList.add('selected');
        updatePrice();
    });
});

// =======================================================
// 2.2. FILTRO DE OPÇÕES POR MODELO
// =======================================================
function filterOptionsByModel() {
    const selectedModel = document.querySelector('.model-option.selected');
    const ConfigureText = document.getElementById('configure');
    if (!selectedModel) return;

    const modelType = selectedModel.getAttribute('data-model'); // <- pega o data-model

    // Reseta todas as opções (mostra tudo de novo)
    memoryOptions.forEach(opt => opt.classList.remove("disabled"));
    storageOptions.forEach(opt => opt.classList.remove("disabled"));
    if (modelType == "promax") {
        ConfigureText.textContent = "Configure seu Mexerica Phone 17 Plus";
    } else if(modelType == "pro") {
        ConfigureText.textContent = "Configure seu Mexerica Phone 17";
    }
    if (modelType !== "promax") {
        // Esconde memória de 8 GB
        memoryOptions.forEach(opt => {
            if (opt.getAttribute('data-memory') === "6") {
                opt.classList.add("disabled");
                opt.classList.remove("selected");
            }
        });

        // Esconde armazenamento de 1024 e 2048
        storageOptions.forEach(opt => {
            const storage = opt.getAttribute('data-storage');
            if (storage === "512") {
                opt.classList.add("disabled");
                opt.classList.remove("selected");
            }
        });

        // Se nenhuma memória estiver selecionada, seleciona a primeira disponível
        if (!document.querySelector('.memory-option.selected')) {
            const firstMemory = document.getElementById('firstMemory');
            if (firstMemory) firstMemory.classList.add("selected");
        }

        // Se nenhum armazenamento estiver selecionado, seleciona o menor disponível
        if (!document.querySelector('.storage-option.selected')) {
            const firstStorage = document.getElementById('firstStorage');
            if (firstStorage) firstStorage.classList.add("selected");
        }
    }
}
modelOptions.forEach(option => {
    option.addEventListener('click', function() {
        document.querySelectorAll('.model-option.selected').forEach(selected => {
            selected.classList.remove('selected');
        });
        this.classList.add('selected');

        filterOptionsByModel(); // aplica a regra
        updatePrice();
    });
});
// =======================================================
// 3. LÓGICA DE PREÇO
// =======================================================

function updatePrice() {
    let storagePrice = 0;
    let memoryPrice = 0;
    
    const selectedModel = document.querySelector('.model-option.selected');
    if (selectedModel) {
        BASE_PRICE = parseInt(selectedModel.getAttribute('data-price'));
    }
    
    // Calcula o preço do Armazenamento
    const selectedStorage = document.querySelector('.storage-option.selected');
    if (selectedStorage) {
        storagePrice = parseInt(selectedStorage.getAttribute('data-price'));
    }

    // Calcula o preço da Memória RAM
    const selectedMemory = document.querySelector('.memory-option.selected');
    if (selectedMemory) {
        memoryPrice = parseInt(selectedMemory.getAttribute('data-price'));
    }
    
    currentPrice = BASE_PRICE + storagePrice + memoryPrice; // Soma todos os upgrades
    
    const formattedPrice = currentPrice.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 0
    });
    
    finalPriceDisplay.textContent = formattedPrice;
}

// Lógica de seleção de Armazenamento
storageOptions.forEach(option => {
    option.addEventListener('click', function() {
        document.querySelector('.storage-option.selected').classList.remove('selected');
        this.classList.add('selected');
        updatePrice();
    });
});

// Inicializa o preço quando a página carrega
updatePrice();
filterOptionsByModel();
// =======================================================
// 4. LÓGICA DO CHECKOUT (NOVO)
// =======================================================

$('#add-to-cart').on('click', function() {
    // 1. Capturar todas as configurações atuais
    const selectedColor = $('.swatch.selected').data('color');
    const selectedStorage = $('.storage-option.selected[data-storage]').data('storage');
    const selectedMemory = $('.memory-option.selected[data-memory]').data('memory');
    const selectedModel = $('.model-option.selected[data-model]').data('model');
    
    // O preço final já foi calculado na variável global `currentPrice`
    const finalPrice = currentPrice;
   let modeling = 0
   if(selectedModel == 'pro') {
       modeling = 'MexericaPhone 17';
   } else if(selectedModel == 'promax') {
       modeling = 'MexericaPhone 17 Plus';
   } 
    // 2. Criar objeto de pedido
    const orderDetails = {
        model: modeling,
        color: colorNames[selectedColor],
        storage: `${selectedStorage} GB`,
        memory: `${selectedMemory} GB RAM`,
        price: finalPrice
    };

    // 3. Salvar os detalhes do pedido no LocalStorage
    localStorage.setItem('mexericaPhoneOrderM', JSON.stringify(orderDetails));

    // 4. Redirecionar para a página de checkout
    window.location.href = 'checkoutm.html';
});
