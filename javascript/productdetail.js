// 取得目前頁面網址
var producturl = new URL(window.location.href);

const hostName = "api.appworks-school.tw";
const apiVersion = "1.0";

const productShow = document.querySelector("#product-list");

const getProduct = function () {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        // producturl.serch可以得到參數(ex.?id=201807242222)
        xhr.open('get', `https://${hostName}/api/${apiVersion}/products/details${producturl.search}`);
        xhr.onload = function () {
            resolve(this.responseText);
        };
        xhr.onerror = function () {
            reject("Somthing went wrong!");
        };

        xhr.send();
    });
};

const getProductShow = function () {

    return getProduct().then((result) => {

        const productAll = JSON.parse(result);
        const products = productAll.data;
        printProduct(products);

        chooseColorSize(products);

    }).catch((error) => {
        console.log(error);
    });
};


const printProduct = function (data) {

    // 取得資料刪除Loading畫面
    const loading = document.querySelector(".last-section");
    loading.style.display = "none";

    // 顯示產品
    const productInfo = document.querySelector(".main-info");
    productInfo.style.display = "block";

    const main_image = document.querySelector("#prodct-image");
    main_image.src = data.main_image;

    const title = document.querySelector("#title");
    title.textContent = data.title;

    const id = document.querySelector(".product-id");
    id.textContent = data.id;

    const price = document.querySelector(".product-price");
    price.textContent = `TWD.${data.price}`;

    data.colors.forEach(colors => {
        const {
            code,
            name
        } = colors;

        const color = document.createElement('div');
        color.className = "detail-color";
        if (code === "FFFFFF") {
            color.style.backgroundImage = 'url("../images/whiteblockfaded.png")';
        } else {
            color.style.backgroundColor = `#${code}`;
        }
        color.value = `${code}|${name}`;

        const detailColor = document.querySelector(".detail-colors");

        detailColor.appendChild(color);
    });

    data.sizes.forEach(size => {

        const detailSize = document.createElement('div');
        detailSize.className = "detail-size";
        detailSize.textContent = size;
        detailSize.value = size;

        const detailSizes = document.querySelector(".detail-sizes");
        detailSizes.appendChild(detailSize);
    });

    const detailInfo = document.querySelector(".detail-info");
    const des = data.description.split('\r\n');
    detailInfo.innerHTML = `${data.note}<br><br>${data.texture}<br>${des[0]}<br>${des[1]}<br><br>素材產地 / ${data.place}<br>加工產地 / ${data.place}<br>`;

    const story0 = document.createElement('p');
    story0.textContent = data.story;
    const story1 = document.createElement('p');
    story1.textContent = data.story;
    const img0 = document.createElement('img');
    img0.src = data.images[0];
    const img1 = document.createElement('img');
    img1.src = data.images[1];

    const bottom = document.querySelector(".bottom");
    bottom.append(story0, img0, story1, img1);
};

getProductShow();

// 顏色或尺寸被選擇時css改變
function chooseColorSize(data) {

    const select = document.querySelector(".detail-feature");
    const cart = document.querySelector(".add-to-cart");

    // 控制數字加減
    const minus = document.querySelector(".minus");
    const plus = document.querySelector(".plus");
    const count = document.querySelector(".count");
    count.value = 0;

    const colorNav = document.querySelector(".detail-colors");
    const sizeNav = document.querySelector(".detail-sizes");

    // 紀錄所有顏色和尺寸div
    const colors = document.querySelectorAll(".detail-color");
    const sizes = document.querySelectorAll(".detail-size");

    // 紀錄目前的選擇
    var currentColor = 0;
    var currentColorName = 0;
    var currentSize = 0;
    var currentAmount = count.value;
    var currentMax = 0;

    // 判斷剛開始沒選擇尺寸顏色和數量的時候不能加入購物車
    if (currentColor === 0 || currentSize === 0) {
        cart.className = "add-to-cart-faded";
    }

    colorNav.addEventListener("click", (tar) => {

        // 清除之前被active的color
        for (let i = 0; i < colors.length; i++) {
            if (colors[i].className === "detail-color-active") {
                colors[i].className = "detail-color";
            }
        }

        if (tar.target.value !== undefined && tar.target.className !== "detail-color-faded") {
            tar.target.className = "detail-color-active";

            let i = tar.target.value.split("|");
            currentColor = i[0];
            currentColorName = i[1];

            // 將count歸0重新計算
            count.value = 0;
            count.textContent = count.value;
            currentAmount = count.value;
        }
    });

    sizeNav.addEventListener("click", (tar) => {

        // 清除之前被active的size
        for (let i = 0; i < sizes.length; i++) {
            if (sizes[i].className === "detail-size-active") {
                sizes[i].className = "detail-size";
            }
        }

        if (tar.target.value !== undefined && tar.target.className !== "detail-size-faded") {
            tar.target.className = "detail-size-active";
            currentSize = tar.target.value;

            // 將count歸0重新計算
            count.value = 0;
            count.textContent = count.value;
            currentAmount = count.value;
        }
    });


    plus.addEventListener("click", () => {
        count.value++;
        count.textContent = count.value;
        currentAmount = count.value;
    });

    minus.addEventListener("click", () => {

        if (count.value > 0) {
            count.value--;
            count.textContent = count.value;
            currentAmount = count.value;
        }

    });

    select.addEventListener("click", () => {

        // 判斷庫存是否足夠
        data.variants.forEach(item => {
            let {
                color_code,
                size,
                stock
            } = item;

            if (currentColor === color_code && currentSize === size) {

                cart.className = "add-to-cart";
                cart.textContent = "加入購物車";
                currentMax = stock;

                // 判斷目前購物車中有沒有買相同的商品
                for (let i = 0; i < list.length; i++) {
                    if (list[i].color.code === color_code && list[i].size === size) {
                        // 若有相同的商品就要把庫存扣除
                        stock = stock - list[i].qty;
                    }
                }

                if (stock === 0) {
                    cart.className = "add-to-cart-faded";
                    cart.textContent = "(目前品項已無庫存)";
                    currentAmount = 0;
                    count.value = 0;
                    count.textContent = currentAmount;

                    // 顏色就不能再選
                    for (let i = 0; i < colors.length; i++) {
                        if (colors[i].value === currentColor) {
                            colors[i].className = "detail-color-faded";
                        }
                    }

                    // 尺寸不能再選
                    for (let i = 0; i < sizes.length; i++) {
                        if (sizes[i].value === currentSize) {
                            sizes[i].className = "detail-size-faded";
                        }
                    }

                } else {
                    stock = stock - currentAmount;

                    if (stock < 0) {
                        currentAmount = stock + currentAmount;
                        stock = 0;
                        count.value = currentAmount;
                        count.textContent = currentAmount;

                        alert(`抱歉！您選擇的品項庫存只剩${currentAmount}件，謝謝`);
                    }
                }

            }

            // 判斷其他顏色是否庫存足夠，如果不夠就算沒被選也要反灰
            for (let i = 0; i < colors.length; i++) {
                if (currentSize === size && colors[i].value === color_code) {
                    if (currentAmount <= stock && stock !== 0) {
                        if (colors[i].className === "detail-color-faded") {
                            colors[i].className = "detail-color";
                        }
                    } else {
                        if (colors[i].className === "detail-color") {
                            colors[i].className = "detail-color-faded";
                        }
                    }
                }
            }


            // 判斷其他尺寸是否庫存足夠，如果不夠就算沒被選也要反灰
            for (let i = 0; i < sizes.length; i++) {
                if (currentColor === color_code && sizes[i].value === size) {

                    if (currentAmount <= stock && stock !== 0) {
                        if (sizes[i].className === "detail-size-faded") {
                            sizes[i].className = "detail-size";
                        }
                    } else {
                        if (sizes[i].className === "detail-size") {
                            sizes[i].className = "detail-size-faded";
                        }
                    }

                }
            }

        });

    });

    // 當「加到購物車」被點選後將選到的商品放進localStorage
    cart.addEventListener("click", () => {
        if (cart.className === "add-to-cart" && currentAmount > 0) {

            let j = 0;

            alert("成功加入購物車");

            if (list.length > 0) {
                for (let i = 0; i < list.length; i++) {
                    // 判斷資料內有沒有一模一樣的商品被買過
                    if (list[i].id === data.id && list[i].color.name === currentColorName && list[i].size === currentSize) {
                        list[i].qty = list[i].qty + currentAmount;
                    } else {
                        j++;
                    }
                }

                // 當j的數字等於list陣列的長度就代表沒有買過一模一樣的商品，所以需要再新增一個
                if (j === list.length) {
                    let buyProduct = {};
                    currentSize;
                    buyProduct.id = data.id;
                    buyProduct.name = data.title;
                    buyProduct.price = data.price;
                    buyProduct.color = {
                        "name": `${currentColorName}`,
                        "code": `${currentColor}`
                    };
                    buyProduct.size = currentSize;
                    buyProduct.qty = currentAmount;
                    buyProduct.img = data.main_image;
                    buyProduct.max = currentMax;

                    // 把新的資料push加到list陣列裡
                    list.push(buyProduct);
                }

                // 再把已經有新資料的list轉成string存到localstorage裡
                localStorage.setItem('list', JSON.stringify(list));


            } else {
                let buyProduct = {};
                currentSize;
                buyProduct.id = data.id;
                buyProduct.name = data.title;
                buyProduct.price = data.price;
                buyProduct.color = {
                    "name": `${currentColorName}`,
                    "code": `${currentColor}`
                };
                buyProduct.size = currentSize;
                buyProduct.qty = currentAmount;
                buyProduct.img = data.main_image;
                buyProduct.max = currentMax;

                // 把新的資料push加到list陣列裡
                list.push(buyProduct);

                // 再把已經有新資料的list轉成string存到localstorage裡
                localStorage.setItem('list', JSON.stringify(list));
            }

            // 顯示目前加到購物車的商品數量
            addToCart();

            console.log(localStorage);
        }
    });
}