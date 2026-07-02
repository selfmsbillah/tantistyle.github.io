// --- 1. Cart Count Logic ---
// আমি এখানে cart-এর product add, quantity update এবং remove করার কাজ করছি।
let cartItems = [];
const cartBadge = document.querySelector('.cart-count');
const addToCartButtons = document.querySelectorAll('.btn-cart');
const orderNowButtons = document.querySelectorAll('.btn-order');
const cartButton = document.querySelector('.cart-btn');
const MAX_CART_QUANTITY = 99;

// আমি এখানে text পরিষ্কার করছি যেন dynamic জায়গায় unsafe HTML ঢুকতে না পারে।
function sanitizeText(value) {
    return String(value || '').replace(/\s+/g, ' ').trim();
}

// আমি এখানে image URL যাচাই করছি, শুধু local file বা https image allow করছি।
function sanitizeImageSource(value) {
    const source = sanitizeText(value);
    if (!source) return '';
    if (source.startsWith('http://')) return '';
    if (source.startsWith('javascript:') || source.startsWith('data:')) return '';
    return source;
}

function getProductDataFromCard(card) {
    return {
        title: sanitizeText(card.querySelector('h3').textContent),
        price: sanitizeText(card.querySelector('.price').childNodes[0].textContent),
        image: sanitizeImageSource(card.querySelector('.product-img img').getAttribute('src'))
    };
}

function getCartTotalQuantity() {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
}

function updateCartBadge() {
    cartBadge.textContent = getCartTotalQuantity();
}

function addProductToCart(card) {
    const product = getProductDataFromCard(card);
    const existingItem = cartItems.find(item => item.title === product.title);

    if (existingItem) {
        existingItem.quantity = Math.min(existingItem.quantity + 1, MAX_CART_QUANTITY);
    } else {
        cartItems.push({ ...product, quantity: 1 });
    }

    updateCartBadge();
}

function changeCartQuantity(title, changeAmount) {
    const item = cartItems.find(cartItem => cartItem.title === title);
    if (!item) return;

    item.quantity = Math.min(item.quantity + changeAmount, MAX_CART_QUANTITY);
    if (item.quantity <= 0) {
        cartItems = cartItems.filter(cartItem => cartItem.title !== title);
    }

    updateCartBadge();
    renderCheckoutItems();
}

// আমি এখানে cart item index দিয়ে update করছি, এতে title special character হলেও সমস্যা হয় না।
function changeCartQuantityByIndex(index, changeAmount) {
    const item = cartItems[index];
    if (!item) return;

    item.quantity = Math.min(item.quantity + changeAmount, MAX_CART_QUANTITY);
    if (item.quantity <= 0) {
        cartItems.splice(index, 1);
    }

    updateCartBadge();
    renderCheckoutItems();
}

function removeProductFromCart(title) {
    cartItems = cartItems.filter(item => item.title !== title);
    updateCartBadge();
    renderCheckoutItems();
}

function removeProductFromCartByIndex(index) {
    if (!cartItems[index]) return;

    cartItems.splice(index, 1);
    updateCartBadge();
    renderCheckoutItems();
}

addToCartButtons.forEach(button => {
    button.addEventListener('click', () => {
        const productCard = button.closest('.product-card');
        addProductToCart(productCard);
        alert('Product successfully added to your cart!');
    });
});

orderNowButtons.forEach(button => {
    button.addEventListener('click', () => {
        const productCard = button.closest('.product-card');
        addProductToCart(productCard);
        openCheckoutView();
    });
});

if (cartButton) {
    cartButton.addEventListener('click', (e) => {
        e.preventDefault();
        openCheckoutView();
    });
}


// --- 2. Hero Banner Slider Logic ---
const slidesData = [
    { title: "Exclusive Collection", desc: "Discover the finest traditional wear crafted just for you.", bgLink: "cover1.png" },
    { title: "Tanti Style Special Offers", desc: "Weaving Tradition, Dressing Today. Get up to 40% discount!", bgLink: "cover2.png" }
];
let currentSlide = 0;
const slideTitle = document.querySelector('.slide-content h1');
const slideDesc = document.querySelector('.slide-content p');
const heroSliderSection = document.querySelector('.hero-slider');
const prevBtn = document.querySelector('.prev-btn');
const nextBtn = document.querySelector('.next-btn');

function updateSlide(index) {
    if(slideTitle && slideDesc && heroSliderSection) {
        slideTitle.textContent = slidesData[index].title;
        slideDesc.textContent = slidesData[index].desc;
        heroSliderSection.style.backgroundImage = `url('${slidesData[index].bgLink}')`;
        heroSliderSection.style.backgroundSize = "cover";
        heroSliderSection.style.backgroundPosition = "center";
    }
}
if(nextBtn && prevBtn) {
    nextBtn.addEventListener('click', () => {
        currentSlide = (currentSlide + 1) >= slidesData.length ? 0 : currentSlide + 1;
        updateSlide(currentSlide);
    });
    prevBtn.addEventListener('click', () => {
        currentSlide = (currentSlide - 1) < 0 ? slidesData.length - 1 : currentSlide - 1;
        updateSlide(currentSlide);
    });
    setInterval(() => { nextBtn.click(); }, 5000);
}
updateSlide(currentSlide);


// --- 3. Views Routing & Advanced Dynamic Filtering System ---
const navHomeBtn = document.getElementById('nav-home-btn');
const navNewArrivalsBtn = document.getElementById('nav-new-arrivals-btn');
const navCategoriesBtn = document.getElementById('nav-categories-btn');
const navBestsellersBtn = document.getElementById('nav-bestsellers-btn');
const navSpecialoffersBtn = document.getElementById('nav-specialoffers-btn');
const navFlashsaleBtn = document.getElementById('nav-flashsale-btn');

const privacyLink = document.getElementById('privacy-link');
const returnLink = document.getElementById('return-link');
const termsLink = document.getElementById('terms-link');
const ourStoreLink = document.getElementById('our-store-link');
const navContactBtn = document.getElementById('nav-contact-btn');
const footerContactLink = document.getElementById('footer-contact-link');
const footerAboutLink = document.getElementById('footer-about-link');
const shopNowBtn = document.querySelector('.shop-now-btn');
const loginLink = document.getElementById('login-link');
const productSearchInput = document.getElementById('product-search-input');
const productSearchButton = document.querySelector('.search-bar button');

const mainShopContent = document.getElementById('main-shop-content');
const privacyPolicyView = document.getElementById('privacy-policy-view');
const returnPolicyView = document.getElementById('return-policy-view');
const termsConditionsView = document.getElementById('terms-conditions-view');
const ourStoreView = document.getElementById('our-store-view');
const aboutUsView = document.getElementById('about-us-view');
const contactUsView = document.getElementById('contact-us-view');
const loginView = document.getElementById('login-view');
const checkoutView = document.getElementById('checkout-view');
const checkoutItemsList = document.getElementById('checkout-items-list');
const whatsappOrderBtn = document.getElementById('whatsapp-order-btn');
const productImageModal = document.getElementById('product-image-modal');
const modalProductImage = document.getElementById('modal-product-image');
const imageModalClose = document.querySelector('.image-modal-close');

const subFiltersContainer = document.getElementById('dynamic-sub-filters');
const whatsappOrderNumber = '8801570282112';

function showPageView(viewToShow, activeNavId = null) {
    mainShopContent.style.display = 'none';
    privacyPolicyView.style.display = 'none';
    returnPolicyView.style.display = 'none';
    termsConditionsView.style.display = 'none';
    ourStoreView.style.display = 'none';
    aboutUsView.style.display = 'none';
    contactUsView.style.display = 'none';
    loginView.style.display = 'none';
    checkoutView.style.display = 'none';
    
    viewToShow.style.display = viewToShow === loginView ? 'flex' : 'block';

    document.querySelectorAll('.nav-links a').forEach(link => link.classList.remove('active'));
    if (activeNavId) {
        const activeLink = document.getElementById(activeNavId);
        if (activeLink) activeLink.classList.add('active');
    }
    
    subFiltersContainer.style.display = 'none'; 
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Core filter function using Index Range
function filterProductsRange(startIndex, endIndex, titleText) {
    const productCards = document.querySelectorAll('.product-card');
    const sectionTitle = document.getElementById('products-section-title');
    
    if (sectionTitle) sectionTitle.textContent = titleText;

    productCards.forEach((card, index) => {
        card.style.order = '';
        if (index >= startIndex && index < endIndex) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// সর্বোচ্চ ডিসকাউন্টের ৩টি নির্দিষ্ট প্রোডাক্ট ফিল্টার করার ফাংশন (50%, 43.75%, 40%)
function filterHighestDiscountProducts(titleText) {
    const productCards = document.querySelectorAll('.product-card');
    const sectionTitle = document.getElementById('products-section-title');
    
    if (sectionTitle) sectionTitle.textContent = titleText;

    productCards.forEach((card, index) => {
        // ইন্ডেক্স ০ (43.75%), ইন্ডেক্স ৬ (30%), ইন্ডেক্স ৯ (50%) কে ডিসপ্লে করবে
        if (index === 0 || index === 6 || index === 9) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

function getProductDiscount(card) {
    const badge = card.querySelector('.badge');
    if (!badge) return 0;

    return parseFloat(badge.textContent.replace('%', '').trim()) || 0;
}

function filterDiscountedProducts(titleText, limit = null) {
    const productCards = document.querySelectorAll('.product-card');
    const sectionTitle = document.getElementById('products-section-title');
    const sortedDiscountedCards = Array.from(productCards)
        .map(card => ({ card, discount: getProductDiscount(card) }))
        .filter(item => item.discount > 0)
        .sort((a, b) => b.discount - a.discount);
    const visibleCards = limit ? sortedDiscountedCards.slice(0, limit) : sortedDiscountedCards;

    if (sectionTitle) sectionTitle.textContent = titleText;

    productCards.forEach(card => {
        card.style.display = 'none';
        card.style.order = '';
    });

    visibleCards.forEach((item, index) => {
        item.card.style.display = 'block';
        item.card.style.order = index;
    });
}

function scrollToShop() {
    document.getElementById('products-display').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function renderCheckoutItems() {
    if (!checkoutItemsList || !whatsappOrderBtn) return;

    checkoutItemsList.textContent = '';

    if (cartItems.length === 0) {
        const emptyMessage = document.createElement('div');
        emptyMessage.className = 'empty-cart-message';
        emptyMessage.textContent = 'Your cart is empty. Please add products before ordering.';
        checkoutItemsList.appendChild(emptyMessage);
        whatsappOrderBtn.disabled = true;
        return;
    }

    // আমি এখানে checkout item DOM দিয়ে তৈরি করছি, তাই product title থেকে HTML injection হবে না।
    cartItems.forEach((item, index) => {
        const checkoutItem = document.createElement('div');
        checkoutItem.className = 'checkout-item';

        const productImage = document.createElement('img');
        productImage.src = sanitizeImageSource(item.image);
        productImage.alt = sanitizeText(item.title);

        const productInfo = document.createElement('div');
        const productTitle = document.createElement('h3');
        productTitle.textContent = sanitizeText(item.title);
        const productPrice = document.createElement('p');
        productPrice.textContent = sanitizeText(item.price);
        productInfo.append(productTitle, productPrice);

        const controls = document.createElement('div');
        controls.className = 'checkout-controls';
        controls.dataset.index = String(index);

        const decreaseButton = document.createElement('button');
        decreaseButton.type = 'button';
        decreaseButton.className = 'cart-qty-btn';
        decreaseButton.dataset.action = 'decrease';
        decreaseButton.textContent = '-';

        const quantityLabel = document.createElement('span');
        quantityLabel.className = 'checkout-qty';
        quantityLabel.textContent = `${item.quantity}x`;

        const increaseButton = document.createElement('button');
        increaseButton.type = 'button';
        increaseButton.className = 'cart-qty-btn';
        increaseButton.dataset.action = 'increase';
        increaseButton.textContent = '+';

        const removeButton = document.createElement('button');
        removeButton.type = 'button';
        removeButton.className = 'cart-remove-btn';
        removeButton.dataset.action = 'remove';
        removeButton.textContent = 'Remove';

        controls.append(decreaseButton, quantityLabel, increaseButton, removeButton);
        checkoutItem.append(productImage, productInfo, controls);
        checkoutItemsList.appendChild(checkoutItem);
    });
    whatsappOrderBtn.disabled = false;
}

function openCheckoutView() {
    renderCheckoutItems();
    showPageView(checkoutView);
}

function buildWhatsAppMessage() {
    const lines = [
        'Hello Tanti Style, I want to order these products:',
        ''
    ];

    cartItems.forEach((item, index) => {
        lines.push(`${index + 1}. ${item.title} - ${item.quantity}x - ${item.price}`);
    });

    lines.push('');
    lines.push('Please confirm availability and delivery details.');

    return lines.join('\n');
}

function openProductImagePreview(imageSrc, imageAlt) {
    if (!productImageModal || !modalProductImage) return;

    modalProductImage.src = imageSrc;
    modalProductImage.alt = imageAlt || 'Product preview';
    productImageModal.classList.add('active');
    productImageModal.setAttribute('aria-hidden', 'false');
}

function closeProductImagePreview() {
    if (!productImageModal || !modalProductImage) return;

    productImageModal.classList.remove('active');
    productImageModal.setAttribute('aria-hidden', 'true');
    modalProductImage.src = '';
}

function searchProductsByTitle() {
    const query = productSearchInput.value.trim().toLowerCase();
    const productCards = document.querySelectorAll('.product-card');
    const sectionTitle = document.getElementById('products-section-title');
    let matchedCount = 0;

    showPageView(mainShopContent, 'nav-home-btn');
    subFiltersContainer.style.display = 'none';

    productCards.forEach(card => {
        const title = card.querySelector('h3').textContent.toLowerCase();
        const isMatch = query === '' || title.includes(query);

        card.style.order = '';
        card.style.display = isMatch ? 'block' : 'none';
        if (isMatch) matchedCount++;
    });

    if (sectionTitle) {
        if (query === '') {
            sectionTitle.textContent = 'Related Products';
        } else if (matchedCount > 0) {
            sectionTitle.textContent = `Search Results: ${matchedCount} Product Found`;
        } else {
            sectionTitle.textContent = 'No Products Found';
        }
    }

    scrollToShop();
}

// Policy routing
if (privacyLink) privacyLink.addEventListener('click', (e) => { e.preventDefault(); showPageView(privacyPolicyView); });
if (returnLink) returnLink.addEventListener('click', (e) => { e.preventDefault(); showPageView(returnPolicyView); });
if (termsLink) termsLink.addEventListener('click', (e) => { e.preventDefault(); showPageView(termsConditionsView); });
if (ourStoreLink) ourStoreLink.addEventListener('click', (e) => { e.preventDefault(); showPageView(ourStoreView); });
if (footerAboutLink) footerAboutLink.addEventListener('click', (e) => { e.preventDefault(); showPageView(aboutUsView); });

const openContactView = (e) => { e.preventDefault(); showPageView(contactUsView, 'nav-contact-btn'); };
if (navContactBtn) navContactBtn.addEventListener('click', openContactView);
if (footerContactLink) footerContactLink.addEventListener('click', openContactView);

document.querySelectorAll('.product-card').forEach(card => {
    card.addEventListener('click', (e) => {
        if (e.target.closest('button')) return;

        const image = card.querySelector('.product-img img');
        if (!image) return;

        const imageSource = image.getAttribute('src');
        const previewSource = imageSource.includes('images.unsplash.com')
            ? imageSource.replace(/w=\d+/, 'w=1200')
            : imageSource;

        openProductImagePreview(previewSource, card.querySelector('h3').textContent.trim());
    });
});

if (imageModalClose) {
    imageModalClose.addEventListener('click', closeProductImagePreview);
}

if (productImageModal) {
    productImageModal.addEventListener('click', (e) => {
        if (e.target === productImageModal) closeProductImagePreview();
    });
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeProductImagePreview();
});

if (loginLink) {
    loginLink.addEventListener('click', (e) => {
        e.preventDefault();
        if (loginView.style.display === 'flex') {
            showPageView(mainShopContent, 'nav-home-btn');
            filterProductsRange(0, 16, 'Related Products');
        } else {
            showPageView(loginView);
        }
    });
}

function filterProductsByCategory(categoryName, titleText) {
    const productCards = document.querySelectorAll('.product-card');
    const sectionTitle = document.getElementById('products-section-title');
    
    if (sectionTitle) sectionTitle.textContent = titleText;

    productCards.forEach(card => {
        card.style.order = '';
        card.style.display = card.dataset.category === categoryName ? 'block' : 'none';
    });
}

function filterNewArrivalCategoryProducts() {
    const productCards = document.querySelectorAll('.product-card');
    const sectionTitle = document.getElementById('products-section-title');
    const categoriesToShow = ['sharee', 'others', 'graphic-design'];
    const shownCategories = new Set();

    if (sectionTitle) sectionTitle.textContent = 'New Arrivals Collection';

    productCards.forEach(card => {
        card.style.order = '';
        const categoryName = card.dataset.category;
        const shouldShow = categoriesToShow.includes(categoryName) && !shownCategories.has(categoryName);

        card.style.display = shouldShow ? 'block' : 'none';
        if (shouldShow) shownCategories.add(categoryName);
    });
}

if (checkoutItemsList) {
    checkoutItemsList.addEventListener('click', (e) => {
        const button = e.target.closest('button');
        if (!button) return;

        const controls = button.closest('.checkout-controls');
        if (!controls) return;

        const itemIndex = Number(controls.dataset.index);
        const action = button.dataset.action;

        if (action === 'increase') changeCartQuantityByIndex(itemIndex, 1);
        if (action === 'decrease') changeCartQuantityByIndex(itemIndex, -1);
        if (action === 'remove') removeProductFromCartByIndex(itemIndex);
    });
}

const loginForm = document.querySelector('.login-form');
if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Login system is ready for backend connection.');
    });
}

if (whatsappOrderBtn) {
    whatsappOrderBtn.addEventListener('click', () => {
        if (cartItems.length === 0) return;

        const message = encodeURIComponent(buildWhatsAppMessage());
        const whatsappUrl = `https://wa.me/${whatsappOrderNumber}?text=${message}`;
        window.open(whatsappUrl, '_blank');
    });
}

if (productSearchButton && productSearchInput) {
    productSearchButton.addEventListener('click', (e) => {
        e.preventDefault();
        searchProductsByTitle();
    });

    productSearchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            searchProductsByTitle();
        }
    });

    productSearchInput.addEventListener('input', () => {
        if (productSearchInput.value.trim() === '') {
            searchProductsByTitle();
        }
    });
}

if(shopNowBtn) {
    shopNowBtn.addEventListener('click', (e) => {
        e.preventDefault(); 
        scrollToShop();
    });
}


// --- 4. Main Navigation Logic ---

// Home
if (navHomeBtn) {
    navHomeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        showPageView(mainShopContent, 'nav-home-btn');
        filterProductsRange(0, 16, 'Related Products');
    });
}

// New Arrivals
if (navNewArrivalsBtn) {
    navNewArrivalsBtn.addEventListener('click', (e) => {
        e.preventDefault();
        showPageView(mainShopContent, 'nav-new-arrivals-btn');
        filterNewArrivalCategoryProducts();
        scrollToShop();
    });
}

// Categories Logic
if (navCategoriesBtn) {
    navCategoriesBtn.addEventListener('click', (e) => {
        e.preventDefault();
        showPageView(mainShopContent, 'nav-categories-btn');
        
        subFiltersContainer.innerHTML = `
            <button class="sub-filter-btn active" id="sub-btn-sharee">Sharee (8 Items)</button>
            <button class="sub-filter-btn" id="sub-btn-others">Others (4 Items)</button>
            <button class="sub-filter-btn" id="sub-btn-graphic">Graphic Design (4 Items)</button>
        `;
        subFiltersContainer.style.display = 'flex';
        scrollToShop();

        const btnSharee = document.getElementById('sub-btn-sharee');
        const btnOthers = document.getElementById('sub-btn-others');
        const btnGraphic = document.getElementById('sub-btn-graphic');

        btnSharee.addEventListener('click', () => {
            btnSharee.classList.add('active');
            btnOthers.classList.remove('active');
            btnGraphic.classList.remove('active');
            filterProductsByCategory('sharee', 'Category: Traditional Sharee');
        });

        btnOthers.addEventListener('click', () => {
            btnOthers.classList.add('active');
            btnSharee.classList.remove('active');
            btnGraphic.classList.remove('active');
            filterProductsByCategory('others', 'Category: Others');
        });

        btnGraphic.addEventListener('click', () => {
            btnGraphic.classList.add('active');
            btnSharee.classList.remove('active');
            btnOthers.classList.remove('active');
            filterProductsByCategory('graphic-design', 'Category: Graphic Design');
        });
        
        btnSharee.click();
    });
}

// Best Sellers - highest discount 5 products
if (navBestsellersBtn) {
    navBestsellersBtn.addEventListener('click', (e) => {
        e.preventDefault();
        showPageView(mainShopContent, 'nav-bestsellers-btn');
        filterDiscountedProducts('Best Sellers - Top 5 Discount Offers', 5);
        scrollToShop();
    });
}

// Special Offers - all discounted products, highest to lowest
if (navSpecialoffersBtn) {
    navSpecialoffersBtn.addEventListener('click', (e) => {
        e.preventDefault();
        showPageView(mainShopContent, 'nav-specialoffers-btn');
        filterDiscountedProducts('Special Offers - High to Low Discounts');
        scrollToShop();
    });
}

// Flash Sale Button - highest discount 5 products
if (navFlashsaleBtn) {
    navFlashsaleBtn.addEventListener('click', (e) => {
        e.preventDefault();
        showPageView(mainShopContent);
        filterDiscountedProducts('FLASH SALE - Limited Time Offers', 5);
        scrollToShop();
    });
}
