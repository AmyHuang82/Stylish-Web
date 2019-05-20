// 解析網址是否有參數並將相關資料印出
var paramsurl = new URL(window.location.href);
var params = paramsurl.searchParams;

if (paramsurl.search !== "") {

    for (let pair of params.entries()) {

        // 判斷如果是訂單編號就將編號存起來
        if (pair[0] === "number") {
            var orderNumber = pair[1];
        }
    }
}

// 填入訂單編號
const orderNumberDiv = document.querySelector('#orderNumber');

orderNumberDiv.textContent = orderNumber;