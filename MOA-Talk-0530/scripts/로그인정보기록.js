
// Moa-Talk-v1
const firebaseConfig = {
    apiKey: "AIzaSyC8lMAGDzFO5nyb44TSs6E1AlMR9b0NtoE",
    authDomain: "moa-talk-v1.firebaseapp.com",
    projectId: "moa-talk-v1",
    storageBucket: "moa-talk-v1.appspot.com",
    messagingSenderId: "186325830287",
    appId: "1:186325830287:web:9fb1ab0b6f2f3d9ccf3efa"
  };
  



firebase.initializeApp(firebaseConfig);
// Firestore 데이터베이스 참조 생성
var db = firebase.firestore();


document.addEventListener("DOMContentLoaded", function()  {
    // logout_btn()
    // console.log('로그아웃됨')
});


function logout_btn(){
    Kakao.API.request({
        url: '/v1/user/unlink',
        })
        .then(function(response) {
            console.log(response);
        })
        .catch(function(error) {
            console.log(error);
        });
    }

Kakao.init("5a7810f2e55520a6f52af8b54206cd0c");

function kakaoLogin() {
    Kakao.Auth.authorize({ 
    redirectUri: 'http://127.0.0.1:5500/htmls/친구등록.html',
    scope: 'friends,talk_message,profile_nickname,profile_image,account_email,name,gender,age_range,birthday,birthyear,phone_number',
    //   serviceTerms: 'account_email,profile_image',
    //   prompt: 'login',
    state: 'userme,sendfriend_feed',
    });
}
    
function handleRedirect() {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    console.log(code)
    if (code) {
        fetchToken(code);
        requestUserInfo()
    }
}


function fetchToken(code) {
    const REST_API_KEY = '6f2795f9419c7ca29e9ecb0de151c830';
    const REDIRECT_URI = 'http://127.0.0.1:5500/htmls/친구등록.html';

    fetch('https://kauth.kakao.com/oauth/token', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
        },
        body: `grant_type=authorization_code&client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&code=${code}`
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
        
        Kakao.Auth.setAccessToken(data.access_token);
        
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}

window.onload = function() {
    handleRedirect();
};


async function updateFirestore() {
    const updatePromises = [];
    const 회원가입 = JSON.parse(localStorage.getItem('회원가입'));
    updatePromises.push(
        new Promise(function(resolve, reject) {
            var docRef = db.collection("고객명단").doc(회원가입.가입아이디);
        
            docRef.set({
                등록정보: firebase.firestore.FieldValue.arrayUnion(회원가입.등록정보)
            })
            .then(function() {
                console.log("회원가입 완료");
                resolve();
            })
            .catch(function(error) {
                console.error("회원가입 오류:", error);
                reject(error);
            });
        })
    );

    try {
        await Promise.all(updatePromises);
        console.log("모든 데이터 업데이트 완료");
        window.location = 'http://127.0.0.1:5500/htmls/메인페이지.html'
    } catch (error) {
        console.error("업데이트 중 오류 발생:", error);
    }
}

// 실제 호출할 때 requestUserInfo 함수 내에서 updateFirestore 호출
async function requestUserInfo() {
    try {
        const res = await Kakao.API.request({
            url: '/v2/user/me',
        });

        console.log(res);

        const 로그인정보 = {
            이름: res['kakao_account'].name || "",
            연령대: res['kakao_account'].age_range || "",
            생일: res['kakao_account'].birthday || "",
            이메일: res['kakao_account'].email || "",
            성별: res['kakao_account'].gender || "",
            전화번호: res['kakao_account'].phone_number || "",
            닉네임: res['kakao_account'].profile?.nickname || ""
        };

        const 회원가입 = {
            가입아이디: `${로그인정보['이름']}-${로그인정보['이메일']}`,
            등록정보: 로그인정보
        };

        console.log(회원가입);

        // 로컬 스토리지에 저장
        localStorage.setItem('회원가입', JSON.stringify(회원가입));

        // Firestore 업데이트 호출
        await updateFirestore();
        // window.location = 'http://127.0.0.1:5500/htmls/메인페이지.html?code'
    } catch (err) {
        console.error('사용자 정보를 요청하는 데 실패했습니다:', err);
        alert('failed to request user information: ' + JSON.stringify(err));
    }
}
