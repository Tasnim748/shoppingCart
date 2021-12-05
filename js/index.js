// ui elements
let itemList = document.querySelector('#item-list');
let sellForm = document.querySelector('#product-input-field');
let newProduct = document.querySelector('#product-name');
let newDesc = document.querySelector('#product-desc');
let newPrice = document.querySelector('#product-prc');
let cartList = document.querySelector('#my-cart');
let showBillBtn = document.querySelector('#show-bill');
let searchFld = document.querySelector('#search-item');
let bill = 0;

// checking Local Storage

// classes

class newProductInfo {
    constructor(productName, productDesc, productPrice) {
        this.productName = productName;
        this.productDesc = productDesc;
        this.productPrice = productPrice;
    }
}

class UI {
    static addNewProduct (product) {
        let card = document.createElement('div');
        card.className = 'col';
        card.innerHTML = `
        <div class="card">
        <div class="card-body product-query">
        <h5 class="card-title">${product.productName}</h5>
        <p class="card-text">${product.productDesc}</p>
        <h5 id="prc">$${product.productPrice}</h5>
        <button type="button" class="btn btn-primary">Add to cart</button>
        </div>
        </div>
        `
        itemList.appendChild(card);
    }

    static clearFields () {
        newProduct.value = '';
        newDesc.value = '';
        newPrice.value = '';
    }

    static setAttributes(el, attrs) {
        for(var key in attrs) {
          el.setAttribute(key, attrs[key]);
        }
    }

    static showAlert (message, className) {
        let alertBox = document.createElement('div');
        this.setAttributes(alertBox, {"class": `alert ${className}`, "role": "alert"})
        alertBox.appendChild(document.createTextNode(message));
        let container = document.querySelector('.container');
        let befChild = document.querySelector('#collapseExample');
        container.insertBefore(alertBox, befChild);

        setTimeout(function() {
            alertBox.remove();
        }, 5000);
    }

    static removeItem(e) {
        if (e.target.hasAttribute('href')) {
            let item = e.target.parentElement;
            let prevQuantityText = item.querySelector('span').textContent;
            let len = prevQuantityText.length;
            let prevQuantity = parseInt(prevQuantityText.slice(1,len-2));
            let name = item.firstChild.textContent.trim();
            let names = JSON.parse(localStorage.getItem('names'));
            let prices = JSON.parse(localStorage.getItem('prices'));
            let pos = names.findIndex(x => x === name);
            bill -= prices[pos]*prevQuantity;
            e.target.parentElement.remove();
        }
    }
}


const AddNow = (e) => {
    e.preventDefault();
    if (newProduct.value == '' || newDesc.value == '' || newPrice.value == '') {
        UI.showAlert('Please fill out all the fields', 'alert-danger');
    } else {
        let product = new newProductInfo(newProduct.value, newDesc.value, newPrice.value);
        UI.addNewProduct(product);
        storeInLocal(product);
        UI.showAlert('You have successfully added your product!', 'alert-success');
        UI.clearFields();
    }
}

const addToCart = (e) => {
    if (e.target.tagName == 'BUTTON') {
        let prodCard = e.target.parentElement;
        let title = prodCard.querySelector('.card-title').innerText;
        let price = prodCard.querySelector('#prc').innerText;
        bill += parseInt(price.slice(1));
        if (cartList.innerHTML == '') {
            let cartProd = document.createElement('li');
            cartProd.innerText = `${title} `;
            let qntSpan = document.createElement('span');
            qntSpan.innerText = '(1) ';
            cartProd.appendChild(qntSpan);
            let link = document.createElement('a');
            link.setAttribute('href','#');
            link.innerHTML = 'x';
            cartProd.appendChild(link);
            cartList.appendChild(cartProd);
        } else {
            let checker = 0;
            cartList.querySelectorAll('li').forEach(item => {
                if(item.firstChild.textContent.trim() === title) {
                    let prevQuantity = item.querySelector('span').textContent;
                    let len = prevQuantity.length;
                    let currentQuantity = parseInt(prevQuantity.slice(1,len-2)) + 1;
                    item.querySelector('span').innerText = `(${currentQuantity}) `;
                    checker++;
                } else {
                    return;
                }
            });
            if (checker == 0) {
                let cartProd = document.createElement('li');
                cartProd.innerText = `${title} `;
                let qntSpan = document.createElement('span');
                qntSpan.innerText = '(1) ';
                cartProd.appendChild(qntSpan);
                let link = document.createElement('a');
                link.setAttribute('href','#');
                link.innerHTML = 'x';
                cartProd.appendChild(link);
                cartList.appendChild(cartProd);
            }
        }
    }
}

function storeInLocal(product) {
    let names, descriptions, prices;
    if (localStorage.getItem('names') === null) {
        names = [];
        descriptions = [];
        prices = [];
    } else {
        names = JSON.parse(localStorage.getItem('names'));
        descriptions = JSON.parse(localStorage.getItem('descriptions'));
        prices = JSON.parse(localStorage.getItem('prices'));
    }
    names.push(product.productName);
    descriptions.push(product.productDesc);
    prices.push(product.productPrice);

    localStorage.setItem('names', JSON.stringify(names));
    localStorage.setItem('descriptions', JSON.stringify(descriptions));
    localStorage.setItem('prices', JSON.stringify(prices));
}

const getBooks = () => {
    let names, descriptions, prices;
    if (localStorage.getItem('names') === null) {
        names = ['Remax Earphone', 'Coconut Oil','Havit Mechanical Keyboard','Havit RGB Mouse',
        'Logitech Basic Speaker','Mouse pad','Laptop Cooler Fan','Extra Virgin Olive Oil'];
        descriptions = ['HD quality Earphone with durable Wire','Extra virgin coconut oil, highly beneficial oil for cooking and skin.',
        'RGB Mechanical Gaming keyboard, with a lifespan of 60M key strokes.','Havit RGB Gaming Mouse with a dedicated button for pointer speed control.',
        'Logitech Basic speaker for personal laptop or desktop. Decent sound quality.','Mouse pad with fabric surface, for anime lovers.',
        'Cooler Fan for laptop, with neon RGB light and four super silent fans.','Cold pressed extra virgin olive oil, suitable for cooking and also for skin. High quality maintained.'];
        prices = ["12","35","45","15","12","5","20","30"];

        localStorage.setItem('names', JSON.stringify(names));
        localStorage.setItem('descriptions', JSON.stringify(descriptions));
        localStorage.setItem('prices', JSON.stringify(prices));
        
        let len = names.length;
        for(let i=0; i<len; i++) {
            let prodToBeLoaded = new newProductInfo(names[i], descriptions[i], prices[i]);
            UI.addNewProduct(prodToBeLoaded);
        }

    } else {
        names = JSON.parse(localStorage.getItem('names'));
        descriptions = JSON.parse(localStorage.getItem('descriptions'));
        prices = JSON.parse(localStorage.getItem('prices'));
        
        let len = names.length;
        for(let i=0; i<len; i++) {
            let prodToBeLoaded = new newProductInfo(names[i], descriptions[i], prices[i]);
            UI.addNewProduct(prodToBeLoaded);
        }
    }
}

const showBill = () => {
    let message = `You have billed $${bill}`;

    function setAttributes(el, attrs) {
        for(var key in attrs) {
          el.setAttribute(key, attrs[key]);
        }
    }
    
    let alertBox = document.createElement('div');
    setAttributes(alertBox, { "class": `alert alert-info`, "role": "alert" })
    alertBox.appendChild(document.createTextNode(message));
    let container = document.querySelector('#offcanvasRight');
    let befChild = container.querySelector('.offcanvas-body');
    container.insertBefore(alertBox, befChild);

    setTimeout(function () {
        alertBox.remove();
    }, 5000);
}

const rmvFromCart = (e) => {
    UI.removeItem(e);
}

const searchItem = (e) => {
    let text = e.target.value.toLowerCase()
    
    document.querySelectorAll('.product-query').forEach(item => {
        let prodTitle = item.querySelector('.card-title').innerText.toLowerCase();
        let itemToBeDisplayedOrNot = item.parentElement.parentElement;
        if (prodTitle.indexOf(text) != -1) {
            itemToBeDisplayedOrNot.style.display = 'block';
        } else {
            itemToBeDisplayedOrNot.style.display = 'none';
        }
    });
}

const clearStoreAll = () => {
    document.querySelector('#item-list').innerHTML = '';
    localStorage.clear();
}

sellForm.addEventListener('submit', AddNow);
itemList.addEventListener('click', addToCart);
showBillBtn.addEventListener('click', showBill);
cartList.addEventListener('click', rmvFromCart);
searchFld.addEventListener('keyup', searchItem);
document.addEventListener('DOMContentLoaded', getBooks);
document.getElementById('clear-storeAll').addEventListener('click', clearStoreAll);