const cartContent = document.querySelector(".cart-content");
const hostName = "api.appworks-school.tw";
const apiVersion = "1.0";

function printCart() {
    let totalFee = 0;

    // 如果沒有買任何商品出現說明文字
    if (list.length === 0) {
        const des = document.createElement('p');
        des.className = "des";
        des.textContent = "購物車內無任何商品";
        cartContent.appendChild(des);
    } else {
        let j = 0;

        // 印出目前localStorage的商品
        list.forEach(product => {
            const {
                img,
                name,
                id,
                color,
                size,
                qty,
                price,
                max
            } = product;

            // 產品圖片
            const cartProductImg = document.createElement('a');
            cartProductImg.className = "cart-product-img";
            cartProductImg.href = `./product.html?id=${id}`;
            const productImg = document.createElement('img');
            productImg.src = img;
            cartProductImg.appendChild(productImg);

            // 產品詳情
            const cartDetail = document.createElement('div');
            cartDetail.className = "cart-detail";
            cartDetail.innerHTML = `${name}<br><br>${id}<br><br>顏色｜${color.name}<br>尺寸｜${size}`;

            // 左半邊
            const left = document.createElement('div');
            left.className = "left";
            left.appendChild(cartProductImg);
            left.appendChild(cartDetail);

            // 目前選擇的數量
            const word1 = document.createElement('div');
            word1.className = "word";
            word1.textContent = "數量";
            const select = document.createElement('select');
            select.className = "amount-counting";
            select.title = j;
            for (var i = 1; i < max + 1; i++) {
                const option = document.createElement('option');
                option.value = i;
                option.textContent = i;
                if (i === parseInt(qty)) {
                    option.selected = "selected";
                }
                select.appendChild(option);
            }
            const cartCount = document.createElement('div');
            cartCount.className = "cart-count";
            cartCount.appendChild(word1);
            cartCount.appendChild(select);

            // 商品單價
            const word2 = document.createElement('div');
            word2.className = "word";
            word2.textContent = "單價";
            const priceText = document.createElement('p');
            priceText.textContent = `NT.${price}`;
            const cartPrice = document.createElement('div');
            cartPrice.className = "cart-price";
            cartPrice.appendChild(word2);
            cartPrice.appendChild(priceText);

            // 小計商品價錢
            const word3 = document.createElement('div');
            word3.className = "word";
            word3.textContent = "小計";
            const subtotal = document.createElement('p');
            subtotal.textContent = `NT.${price*qty}`;
            const cartSubtotal = document.createElement('div');
            cartSubtotal.className = "cart-subtotal";
            cartSubtotal.appendChild(word3);
            cartSubtotal.appendChild(subtotal);

            // 右半邊
            const right = document.createElement('div');
            right.className = "right";
            right.appendChild(cartCount);
            right.appendChild(cartPrice);
            right.appendChild(cartSubtotal);

            // 刪除按鈕
            const cartDelete = document.createElement('div');
            cartDelete.className = "cart-delete";
            cartDelete.value = j;
            j++;

            // 整個產品div
            const cartProduct = document.createElement('div');
            cartProduct.className = "cart-product";
            cartProduct.appendChild(left);
            cartProduct.appendChild(right);
            cartProduct.appendChild(cartDelete);

            cartContent.appendChild(cartProduct);

            // 計算總金額
            totalFee = totalFee + (qty * price);
        });

        deleteProduct();
        changeAmount();
    }

    // 顯示購物車目前的商品數量
    const productCount = document.querySelector("#product-number");
    productCount.textContent = list.length;

    // 顯示總金額
    const total = document.querySelector("#total");
    total.textContent = totalFee;
    total.value = totalFee;

    // 顯示運費
    const shippingFee = document.querySelector("#shipping-fee");
    if (list.length === 0) {
        shippingFee.value = 0;
    } else {
        shippingFee.value = 30;
    }
    shippingFee.textContent = shippingFee.value;

    // 顯示應付金額
    const sumPayable = document.querySelector("#total-fee");
    sumPayable.textContent = `${totalFee + shippingFee.value}`;
}

// 初始呼叫printCart function
printCart();

// 刪除商品
function deleteProduct() {
    const cartDelete = document.querySelectorAll('.cart-delete');

    for (var i = 0; i < cartDelete.length; i++) {
        cartDelete[i].addEventListener("click", (tar) => {
            list.splice(tar.target.value, 1);
            // 再把已經有新資料的list轉成string存到localstorage裡
            localStorage.setItem('list', JSON.stringify(list));
            // 把之前的資料清空
            while (cartContent.firstChild) {
                cartContent.removeChild(cartContent.firstChild);
            }
            printCart();
            addToCart();
        });
    }
}

// 改變購買商品數量
function changeAmount() {
    const cartCount = document.querySelectorAll(".amount-counting");

    for (var i = 0; i < cartCount.length; i++) {

        cartCount[i].addEventListener("change", (tar) => {
            list[tar.target.title].qty = tar.target.value;
            // 再把已經有新資料的list轉成string存到localstorage裡
            localStorage.setItem('list', JSON.stringify(list));
            // 把之前的資料清空
            while (cartContent.firstChild) {
                cartContent.removeChild(cartContent.firstChild);
            }

            printCart();
            addToCart();
        });
    }
}

// TapPay設定
TPDirect.setupSDK(12348, 'app_pa1pQcKoY22IlnSXq5m5WP5jFKzoRG58VEXpT7wU62ud7mMbDOGzCYIlzzLF', 'sandbox');

TPDirect.card.setup({
    fields: {
        number: {
            // css selector
            element: '#card-number',
            placeholder: '**** **** **** ****'
        },
        expirationDate: {
            // DOM object
            element: document.getElementById('card-expiration-date'),
            placeholder: 'MM / YY'
        },
        ccv: {
            element: '#card-ccv',
            placeholder: '後三碼'
        }
    },
    styles: {
        // Style all elements
        'input': {
            'color': 'gray'
        },
        // Styling ccv field
        'input.cvc': {
            'font-size': '16px'
        },
        // Styling expiration-date field
        'input.expiration-date': {
            'font-size': '16px'
        },
        // Styling card-number field
        'input.card-number': {
            'font-size': '16px'
        },
        // style focus state
        ':focus': {
            // 'color': 'black'
        },
        // style valid state
        '.valid': {
            'color': 'green'
        },
        // style invalid state
        '.invalid': {
            'color': 'red'
        },
        // Media queries
        // Note that these apply to the iframe, not the root window.
        '@media screen and (max-width: 400px)': {
            'input': {
                'color': 'orange'
            }
        }
    }
});

TPDirect.card.onUpdate(function (update) {
    // update.canGetPrime === true
    // --> you can call TPDirect.card.getPrime()
    if (update.canGetPrime) {
        // Enable submit Button to get prime.
        // submitButton.removeAttribute('disabled')
    } else {
        // Disable submit Button to get prime.
        // submitButton.setAttribute('disabled', true)
    }

    // cardTypes = ['mastercard', 'visa', 'jcb', 'amex', 'unknown']
    if (update.cardType === 'visa') {
        // Handle card type visa.
    }

    // number 欄位是錯誤的
    if (update.status.number === 2) {
        // setNumberFormGroupToError()
    } else if (update.status.number === 0) {
        // setNumberFormGroupToSuccess()
    } else {
        // setNumberFormGroupToNormal()
    }

    if (update.status.expiry === 2) {
        // setNumberFormGroupToError()
    } else if (update.status.expiry === 0) {
        // setNumberFormGroupToSuccess()
    } else {
        // setNumberFormGroupToNormal()
    }

    if (update.status.cvc === 2) {
        // setNumberFormGroupToError()
    } else if (update.status.cvc === 0) {
        // setNumberFormGroupToSuccess()
    } else {
        // setNumberFormGroupToNormal()
    }
});

// call TPDirect.card.getPrime when user submit form to get tappay prime
// $('form').on('submit', onSubmit)

function onSubmit(event) {
    event.preventDefault();

    // 取得 TapPay Fields 的 status
    const tappayStatus = TPDirect.card.getTappayFieldsStatus();

    // 確認是否可以 getPrime
    if (tappayStatus.canGetPrime === false) {
        alert('信用卡資訊輸入有誤，請再確認是否資訊正確');
        return false;
    }

    // Get prime
    const prime = new Promise((resolve, reject) => {
        TPDirect.card.getPrime((result) => {
            const {
                status,
                msg,
                card
            } = result;
            const {
                prime
            } = card;

            if (status !== 0) {
                console.log(`Get prime error ${msg}`);
                reject(`Get prime error ${msg}`);
            }

            resolve(prime);

            // send prime to your server, to pay with Pay by Prime API .
            // Pay By Prime Docs: https://docs.tappaysdk.com/tutorial/zh/back.html#pay-by-prime-api
        });
    });

    return prime;

}

const submitButton = document.querySelector('.checkout-btn');
const basicInfo = document.querySelector('#order-information');

// check購物車內是否有東西
function checkCart() {

    // 確認購物車內有無商品
    if (list.length > 0) {
        return true;
    } else {
        alert("購物車內沒有商品");
        return false;
    }

}

// 設定手機電子信箱正規格式
var phoneFormat = /^[09]{2}[0-9]{8}$/;
var emailFormat = /^\w+((-\w+)|(\.\w+))*@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/;

// check基本資訊是否都有填好
function checkBasciInfo() {

    const formData = new FormData(basicInfo);

    if (formData.get('name') !== "" && phoneFormat.test(formData.get('phone')) === true && formData.get('address') !== "" && emailFormat.test(formData.get('email')) === true && formData.get('time') !== null) {
        return true;
    } else {
        alert("訂購資料尚未填妥，請再確認是否資訊完整正確");
        return false;
    }
}


// 傳送資料
function postData(data) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        xhr.open("POST", `https://${hostName}/api/${apiVersion}/order/checkout`);
        xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
        xhr.setRequestHeader('Authorization', `Bearer x${access_token}`);
        xhr.onload = function () {
            resolve(this.responseText);
            return this.responseText;
        };
        xhr.onerror = function () {
            reject("Something went wrong!");
        };

        xhr.send(data);
    });
}

submitButton.addEventListener("click", () => {

    if (checkCart() !== false && checkBasciInfo() !== false && onSubmit(event) !== false) {

        // 按鈕呈現在loading的狀態
        submitButton.textContent = "";
        submitButton.classList.add('loading');


        let checkCard = onSubmit(event);
        const formData = new FormData(basicInfo);
        const subtotal = document.querySelector("#total");

        if (checkCard !== false) {
            // 取得Promise資料
            return checkCard.then((result) => {

                // 刪除list內多餘的key與值
                for (var i = 0; i < list.length; i++) {
                    delete list[i].img;
                    delete list[i].max;
                }

                var checkOutOrder = {
                    prime: result,
                    order: {
                        shipping: "delivery",
                        payment: "credit_card",
                        subtotal: subtotal.value,
                        freight: 30,
                        total: subtotal.value + 30,
                        recipient: {
                            name: formData.get('name'),
                            phone: formData.get('phone'),
                            email: formData.get('email'),
                            address: formData.get('address'),
                            time: formData.get('time')
                        },
                        list: list
                    }

                };

                checkOutOrder = JSON.stringify(checkOutOrder);

                // 送出資料並取得number
                let orderData = postData(checkOutOrder);

                orderData.then((result) => {
                    const responseMsg = JSON.parse(result);

                    // 確認是否拿到正確的資料
                    if (responseMsg.error === undefined) {
                        let orderNumber = responseMsg.data.number;
                        localStorage.removeItem('list');
                        window.location.href = `./thank-you.html?number=${orderNumber}`;
                    } else {
                        console.log(responseMsg.error);
                        alert('哪裡出錯了！請確認資料是否都正確並再填寫一次');
                        window.location.href = "../pages/cart.html";
                    }

                });

            }).catch((error) => {
                console.log(error);
            });
        }

    }

});