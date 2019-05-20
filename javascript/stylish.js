const hostName = "api.appworks-school.tw";
const apiVersion = "1.0";
const productShow = document.querySelector("#product-list");
var productPage = 0;
var productCategory = "";

// 用AJAX連線得到回傳值
const getData = function (api) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        xhr.open('get', `https://${hostName}/api/${apiVersion}/${api}`);
        xhr.onload = function () {
            resolve(this.responseText);
        };
        xhr.onerror = function () {
            reject("Something went wrong!");
        };

        xhr.send();
    });
};

// 取得回傳值資料將JSON parse成object
const getDataShow = function (api) {

    return getData(api).then((result) => {

        const productAll = JSON.parse(result);
        productPage = productAll.paging;

        const products = productAll.data;
        printData(products);
    }).catch((error) => {
        console.log(error);
    });
};

// 建立HTML
const printData = function (data) {

    // 取得資料刪除Loading畫面
    const loading = document.querySelector(".load");

    if (isNaN(loading)) {
        productShow.removeChild(loading);
    }


    // 判斷是否有從資料庫找到商品
    if (data.length === 0) {
        const loadDiv = document.createElement("div");
        loadDiv.innerHTML = "抱歉！搜索不到相關商品，請試著換個關鍵字";
        loadDiv.className = "load";

        productShow.appendChild(loadDiv);
    }

    data.forEach(item => {
        const {
            id,
            main_image,
            price,
            title,
            colors
        } = item;


        // 要產生的html範例
        // <div class="product">
        // <a href="">
        //     <img src="http://18.214.165.31/assets/201807202140/main.jpg" alt="1">
        // </a>
        // <div class="product-colors">
        //     <div class="product-color"></div>
        //     <div class="product-color"></div>
        //     <div class="product-color"></div>
        //     <div class="product-color"></div>
        // </div>
        // <p class="description">透肌澎澎防曬襯衫</p>
        // <p>TWD.599</p>
        // </div>

        // 用dom建立物件
        const div = document.createElement("div");
        div.className = "product";

        const productLink = document.createElement("a");
        productLink.href = `./pages/product.html?id=${id}`;

        const productImg = document.createElement("img");
        productImg.src = main_image;
        productLink.appendChild(productImg);

        const productColors = document.createElement("div");
        productColors.className = "product-colors";
        colors.forEach(color => {
            const {
                code
            } = color;

            const productColor = document.createElement("div");
            productColor.className = "product-color";

            if (code === "FFFFFF") {
                productColor.style.border = "1px solid #d7d7d7";
            } else {
                productColor.style.backgroundColor = `#${code}`;
            }

            productColors.appendChild(productColor);
        });

        const productDescription = document.createElement("p");
        productDescription.className = "description";
        productDescription.textContent = title;

        const productPrice = document.createElement("p");
        productPrice.textContent = `TWD.${price}`;

        div.appendChild(productLink);
        div.appendChild(productColors);
        div.appendChild(productDescription);
        div.appendChild(productPrice);

        // 最後放入product div裡面
        productShow.appendChild(div);

    });
};

// click後切換的function
function switchCategory(category) {

    category.preventDefault();

    // current顏色，先去除之前的再針對target加上
    const rmCurrent = document.querySelector(".current");
    if (isNaN(rmCurrent)) {
        rmCurrent.classList.remove("current");
    }

    category.target.parentNode.classList.add('current');

    // 先把原本的資料刪掉，因為有設while所以會直到都沒有firstchild後才會結束迴圈，也就是都全部刪除後才會結束迴圈
    while (productShow.firstChild) {
        productShow.removeChild(productShow.firstChild);
    }

    // 在還沒取得資料前出現Loading畫面
    const loadDiv = document.createElement("div");
    loadDiv.className = "load";
    const loadImg = document.createElement("img");
    loadImg.src = "./images/loading.gif";

    loadDiv.appendChild(loadImg);
    productShow.appendChild(loadDiv);

    if (category.target.textContent === "女裝") {
        getDataShow("products/women");
        productCategory = "products/women";
    } else if (category.target.textContent === "男裝") {
        getDataShow("products/men");
        productCategory = "products/men";
    } else {
        getDataShow("products/accessories");
        productCategory = "products/accessories";
    }
}

const nav = document.querySelector("#category-nav");
nav.addEventListener("click", switchCategory);

// 電腦版的search功能
const destopSearchForm = document.querySelector("#desktop-search-form");

destopSearchForm.addEventListener("submit", (evt) => {
    evt.preventDefault();

    // 先把原本的資料刪掉，因為有設while所以會直到都沒有firstchild後才會結束迴圈，也就是都全部刪除後才會結束迴圈
    while (productShow.firstChild) {
        productShow.removeChild(productShow.firstChild);
    }

    // 在還沒取得資料前出現Loading畫面
    const loadDiv = document.createElement("div");
    loadDiv.className = "load";
    const loadImg = document.createElement("img");
    loadImg.src = "./images/loading.gif";

    loadDiv.appendChild(loadImg);
    productShow.appendChild(loadDiv);

    // current顏色，先去除之前的再針對target加上
    const rmCurrent = document.querySelector(".current");
    if (isNaN(rmCurrent)) {
        rmCurrent.classList.remove("current");
    }

    const formData = new FormData(destopSearchForm);

    // 判別有打入關鍵字就連結search API，若無則跑出所有產品
    if (formData.get('tag') !== "") {
        getDataShow(`products/search?keyword=${formData.get('tag')}`);
    } else {
        getDataShow("products/all");
        productCategory = "products/all";
    }
});


// 手機版的search icon被點擊時開啟form input
const mobileSearch = document.querySelector("#mobile-search-icon");
const mobileSearchForm = document.querySelector("#mobile-search-form");

function searchPrint() {
    while (productShow.firstChild) {
        productShow.removeChild(productShow.firstChild);
    }

    // current顏色，先去除之前的再針對target加上
    const rmCurrent = document.querySelector(".current");
    if (isNaN(rmCurrent)) {
        rmCurrent.classList.remove("current");
    }

    // 在還沒取得資料前出現Loading畫面
    const loadDiv = document.createElement("div");
    loadDiv.className = "load";
    const loadImg = document.createElement("img");
    loadImg.src = "./images/loading.gif";

    loadDiv.appendChild(loadImg);
    productShow.appendChild(loadDiv);

    const formData = new FormData(mobileSearchForm);

    // 判別有打入關鍵字就連結search API，若無則跑出所有產品
    if (formData.get('tag') !== "") {
        getDataShow(`products/search?keyword=${formData.get('tag')}`);
    } else {
        getDataShow("products/all");
        productCategory = "products/all";
    }

    mobileSearchForm.reset();
}

mobileSearch.addEventListener("click", () => {

    if (mobileSearchForm.style.display === "none") {
        mobileSearchForm.style.display = "block";

        mobileSearch.addEventListener("click", searchPrint);

    } else {
        mobileSearchForm.style.display = "none";
    }
});

// 手機版支援enter
mobileSearchForm.addEventListener("submit", (evt) => {
    evt.preventDefault();

    // 先把原本的資料刪掉，因為有設while所以會直到都沒有firstchild後才會結束迴圈，也就是都全部刪除後才會結束迴圈
    while (productShow.firstChild) {
        productShow.removeChild(productShow.firstChild);
    }

    // current顏色，先去除之前的再針對target加上
    const rmCurrent = document.querySelector(".current");
    if (isNaN(rmCurrent)) {
        rmCurrent.classList.remove("current");
    }

    // 在還沒取得資料前出現Loading畫面
    const loadDiv = document.createElement("div");
    loadDiv.className = "load";
    const loadImg = document.createElement("img");
    loadImg.src = "./images/loading.gif";

    loadDiv.appendChild(loadImg);
    productShow.appendChild(loadDiv);

    const formData = new FormData(mobileSearchForm);

    // 判別有打入關鍵字就連結search API，若無則跑出所有產品
    if (formData.get('tag') !== "") {
        getDataShow(`products/search?keyword=${formData.get('tag')}`);
    } else {
        getDataShow("products/all");
        productCategory = "products/all";
    }
});

// 防止短時間內重複觸發
function debounce(func, delay) {
    var timer = null;
    return function () {
        var context = this;
        var args = arguments;
        clearTimeout(timer);
        timer = setTimeout(function () {
            func.apply(context, args);
        }, delay);
    };
}

window.onscroll = debounce(scrolling, 200);

// scroll資料加載
function scrolling() {

    const height1 = Math.ceil(window.innerHeight + window.scrollY + 80);
    const height2 = Math.ceil(document.body.scrollHeight);

    if (height1 >= height2) {

        if (productPage > 0 && productPage !== undefined) {
            getDataShow(`${productCategory}?paging=${productPage}`);
            // console.log(height1, height2, productPage);
        } else {
            productPage = undefined;
        }
    }
}

// 解析網址是否有參數並將相關資料印出
var paramsurl = new URL(window.location.href);
var params = paramsurl.searchParams;

if (paramsurl.search !== "") {

    for (let pair of params.entries()) {

        // 判斷如果是分類就顯示相關分類
        if (pair[0] === "category") {
            if (pair[1] === "women") {
                getDataShow("products/women");
                productCategory = "products/women";
                document.getElementById('women').classList.add('current');
            } else if (pair[1] === "men") {
                getDataShow("products/men");
                productCategory = "products/men";
                document.getElementById('men').classList.add('current');
            } else {
                getDataShow("products/accessories");
                productCategory = "products/accessories";
                document.getElementById('accessories').classList.add('current');
            }
        }

        // 判斷如果是搜尋就顯示搜尋結果
        if (pair[0] === "keyword") {
            getDataShow(`products/search?keyword=${pair[1]}`);
        }
    }
} else {
    // 取得all products
    getDataShow("products/all");
    productCategory = "products/all";
}