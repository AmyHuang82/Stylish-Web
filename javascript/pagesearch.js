// 電腦版的search功能
const destopSearchForm = document.querySelector("#desktop-search-form");

destopSearchForm.addEventListener("submit", (evt) => {
    evt.preventDefault();

    const formData = new FormData(destopSearchForm);

    // 判斷有打入關鍵字就連結回index並帶入參數，若無就沒有動作
    if (formData.get('tag') !== "") {
        window.location.href = `../index.html?keyword=${formData.get('tag')}`;
    }

});


// 手機版的search icon被點擊時開啟form input
const mobileSearch = document.querySelector("#mobile-search-icon");
const mobileSearchForm = document.querySelector("#mobile-search-form");

mobileSearch.addEventListener("click", () => {

    if (mobileSearchForm.style.display === "none") {
        mobileSearchForm.style.display = "block";

        mobileSearch.addEventListener("click", () => {

            const formData = new FormData(mobileSearchForm);

            // 判斷有打入關鍵字就連結回index並帶入參數，若無就沒有動作
            if (formData.get('tag') !== "") {
                window.location.href = `../index.html?keyword=${formData.get('tag')}`;
            }
        });
    } else {
        mobileSearchForm.style.display = "none";
    }
});

// 手機版支援enter
mobileSearchForm.addEventListener("submit", (evt) => {
    evt.preventDefault();

    const formData = new FormData(mobileSearchForm);

    // 判斷有打入關鍵字就連結回index並帶入參數，若無就沒有動作
    if (formData.get('tag') !== "") {
        window.location.href = `../index.html?keyword=${formData.get('tag')}`;
    }
});