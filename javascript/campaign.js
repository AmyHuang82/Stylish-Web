var slides = 0;
var circle = 0;

function getCampaignShow(api) {
    return getData(api).then((result) => {
        const campaignAll = JSON.parse(result);
        const campaigns = campaignAll.data;
        printCampaign(campaigns);

        slides = document.querySelectorAll('#story .story');
        slides[0].style.zIndex = "3";
        slides[1].style.zIndex = "2";

        circle = document.querySelectorAll('.circles .circle');
        circle[0].className = 'active';

        switchSlide();

    }).catch((error) => {
        console.log(error);
    });
}

const campaignDiv = document.querySelector("#story");
const circlesNav = document.querySelector(".circles");

const printCampaign = function (campaigns) {

    campaigns.forEach(item => {
        const {
            product_id,
            picture,
            story
        } = item;

        const container = document.createElement("div");
        container.className = "container";

        const campaignLink = document.createElement("a");
        campaignLink.href = `./pages/product.html?id=${product_id}`;

        const storyDiv = document.createElement("div");
        storyDiv.className = "story";

        // "\r\n"代表在分行處split
        const words = story.split("\r\n");
        let content = "";

        // 抓出字串資料並再換行後加上<br>
        for (var i = 0; i < words.length - 1; i++) {
            content += (words[i] + "<br>");
        }

        // 將內容放進story div中
        container.innerHTML = content;

        const lastLine = document.createElement("div");
        lastLine.className = "last-line";
        lastLine.innerHTML = words[words.length - 1];
        container.appendChild(lastLine);

        storyDiv.appendChild(container);

        storyDiv.style.backgroundImage = `url('https://api.appworks-school.tw${picture}')`;

        campaignLink.appendChild(storyDiv);
        campaignDiv.appendChild(campaignLink);

    });

    // 小圓圈nav
    for (var i = 0; i < campaigns.length; i++) {
        const circle = document.createElement("div");
        circle.className = "circle";
        circle.title = i;
        circlesNav.appendChild(circle);
    }

};

getCampaignShow("marketing/campaigns");

// 淡入淡出效果時間控制
var currentSlide = 0;
setInterval(nextSlide, 10000);

function removeCurrent(currentSlide) {
    slides[currentSlide].className = 'story showing-right-out';
    circle[currentSlide].className = 'circle';
}

function activeCurrent(currentSlide) {
    slides[currentSlide].className = 'story showing-right';
    circle[currentSlide].className = 'active';
}

function nextSlide() {
    removeCurrent(currentSlide);
    currentSlide = (currentSlide + 1) % slides.length;
    activeCurrent(currentSlide);
}

function switchSlide() {

    circlesNav.addEventListener("click", (tar) => {

        if (tar.target.title !== "") {

            let circleNumber = tar.target.title;

            // 判斷如果click的順序小於目前slide的順序，就要往左滑回去
            if (circleNumber < currentSlide) {
                slides[currentSlide].className = 'story showing-left';
                circle[currentSlide].className = 'circle';

                currentSlide = circleNumber;

                slides[currentSlide].className = 'story showing-left-out';
                circle[currentSlide].className = 'active';
            } else {
                removeCurrent(currentSlide);
                currentSlide = circleNumber;
                activeCurrent(currentSlide);
            }


        }
    });

}