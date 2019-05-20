// localStorage.clear();
// console.log(localStorage);

// 先把目前的JSON資料string轉成object
var list = JSON.parse(localStorage.getItem('list')) || [];

if (localStorage.getItem('access_token') !== "undefined") {
    var access_token = JSON.parse(localStorage.getItem('access_token'));
}

addToCart();

function addToCart() {

    // 計算目前加入購物車的商品數量
    var count = 0;

    for (var i = 0; i < list.length; i++) {
        count = parseInt(list[i].qty) + parseInt(count);
    }

    // 將數量顯示在購物車的數字上
    const cartCount = document.querySelectorAll(".cart-count");
    cartCount[0].innerHTML = count;
    cartCount[1].innerHTML = count;

}