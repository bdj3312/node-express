

function loginWithKakao() {
  Kakao.Auth.authorize({
    redirectUri: 'http://127.0.0.1:5500/htmls/메시지발송.html',
    scope:
      "friends,talk_message,profile_nickname,profile_image,account_email,name,gender,age_range,birthday,birthyear,phone_number",
    //   serviceTerms: 'account_email,profile_image',
    //   prompt: 'login',
    state: "userme,sendfriend_feed",
  });
}

function handleRedirect() {
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get("code");
  console.log(code);
  if (code) {
    fetchToken(code);
  }
  else{
    // loginWithKakao()
  }
}


function fetchToken(code) {
    const REST_API_KEY = '6f2795f9419c7ca29e9ecb0de151c830';
    const REDIRECT_URI = 'http://127.0.0.1:5500/htmls/메시지발송.html';

    fetch('https://kauth.kakao.com/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
      },
      body: `grant_type=authorization_code&client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&code=${code}`
    })
    .then(response => response.json())
    .then(data => {
      console.log('로근된거 맞지:', data);
      Kakao.Auth.setAccessToken(data.access_token);
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}

function requestUserInfo(){
    Kakao.API.request({
        url: '/v2/user/me',
        })
        .then(function(res) {
            console.log(res)
            // alert(JSON.stringify(res));
        })
        .catch(function(err) {
            loginWithKakao() 
            handleRedirect()
            // alert(
            // 'failed to request user information: ' + JSON.stringify(err)
            // );
        });
}



document.addEventListener("DOMContentLoaded", function() {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    console.log(code);
    if (code) {
        handleRedirect()
        requestUserInfo()
    }
    else{
        loginWithKakao()
    }
    
})


// function onShareButtonClick1(){
//     console.log('1')
//     loginWithKakao() 
// }


// function onShareButtonClick2(){
//     console.log('2')
//     handleRedirect()
//     requestUserInfo()
// }


// function onShareButtonClick3(){
//     console.log('3')
//     requestUserInfo()
// }


