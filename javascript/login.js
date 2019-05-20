window.fbAsyncInit = function () {
    FB.init({
        appId: '382270332603829',
        cookie: true,
        xfbml: true,
        version: 'v3.2'
    });

    FB.AppEvents.logPageView();

};

(function (d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) {
        return;
    }
    js = d.createElement(s);
    js.id = id;
    js.src = "https://connect.facebook.net/zh_TW/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));


FB.getLoginStatus(function (response) {
    return new Promise((resolve, reject) => {
        resolve(statusChangeCallback(response));
        reject("Something went wrong!");
    }).then((result) => {
        var access_token = result;
        localStorage.setItem('access_token', JSON.stringify(access_token));
    });
});

function checkLoginState() {
    FB.getLoginStatus(function (response) {
        statusChangeCallback(response);
    });
}

function statusChangeCallback(response) {

    if (response.status === 'connected') {

        let access_token = response.authResponse.accessToken;

        FB.api('/me', function (response) {


            // 置換login的圖像
            document.querySelector('.login-member').style.backgroundImage = `url(https://graph.facebook.com/${response.id}/picture)`;
            document.querySelector('.login-member').style.borderRadius = '50%';
            document.querySelector('.mobile-login-member').src = `https://graph.facebook.com/${response.id}/picture`;
            document.querySelector('.mobile-login-member').style.width = "37px";
            document.querySelector('.mobile-login-member').style.paddingRight = "3px";
            document.querySelector('.mobile-login-member').style.borderRadius = '50%';

            if (document.getElementById('login') !== null) {

                // 隱藏login button
                document.getElementById('profile').style.display = "flex";
                document.getElementById('login').style.display = "none";

                // 顯示名字
                document.getElementById('FB-name').textContent = response.name;

                // 取得email並顯示
                FB.api(
                    `${response.id}`,
                    'GET', {
                        "fields": "email"
                    },
                    function (response) {
                        document.getElementById('FB-mail').textContent = response.email;
                        console.log(response.email);
                    }
                );

                // 取得大頭貼並顯示
                document.getElementById('FB-picture').style.backgroundImage = `url(https://graph.facebook.com/${response.id}/picture?type=large)`;
            }

        });

        return access_token;
    }

}