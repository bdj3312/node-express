
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

let 체크박스_친구목록 = [];
let 체크박스_전송목록 = [];
let 전송대상_정보 = []


const 회원가입 = JSON.parse(localStorage.getItem('회원가입'));
console.log(회원가입)

let 회원_전체_정보 = ''

function 전체_친구목록_불러오기() {
    return new Promise((resolve, reject) => {
        var docRef = db.collection("고객명단").doc('진연녹-dudtla224@naver.com');
        docRef.get().then(function(doc) {
            if (doc.exists) {
                console.log("Firestore 문서 데이터:", doc.data());
                회원_전체_정보 = doc.data();
                resolve(); // 데이터를 성공적으로 가져왔으므로 Promise를 완료합니다.
            } else {
                console.log("No such document!");
                reject("문서가 존재하지 않습니다."); // 문서가 없을 때 reject를 호출합니다.
            }
        }).catch(function(error) {
            console.error("Firestore에서 데이터를 가져오는데 오류 발생:", error);
            reject(error); // 데이터를 가져오는 도중 에러가 발생했을 때 reject를 호출합니다.
        });
    });
}


document.addEventListener("DOMContentLoaded", function() {
    전체_친구목록_불러오기().then(() => {
        var tabld_이름 = document.getElementById('전체친구목_table');
        var tbody_이름 = tabld_이름.getElementsByTagName('tbody')[0];
        
        
        

        // "추가" 버튼 클릭 시 행 추가
        var rowCountInput = 8 + 1; // 예시로 3개의 행을 추가합니다./
        // var rowCountInput = 회원_전체_정보.친구목록.length+1; // 예시로 3개의 행을 추가합니다.//
        var rowCount = 1; // 초기 행 개수/

        if (!isNaN(rowCountInput) && rowCountInput > 0) {
            for (var i = 0; i < rowCountInput - 1; i++) {
                addRow();
            }
        }

        function addRow() {
            이름변수 = 회원_전체_정보.친구목록[rowCount+165].split('---')[0]
            rowCount++; // 새로운 행을 추가할 때마다 rowCount 증가
            var 친구목록_tr = tbody_이름.insertRow(-1);
            var 체크박스_td = 친구목록_tr.insertCell(0);
            var 이름_td = 친구목록_tr.insertCell(1);
            var 그룹_td = 친구목록_tr.insertCell(2);
            체크박스_td.innerHTML = `<input type="checkbox" id="체크박스${rowCount}" placeholder="이름(자동)">`;
            이름_td.innerHTML = `<label type="text" id="이름${rowCount}">${이름변수}</label>`;
            그룹_td.innerHTML = `<label type="text" id="그룹${rowCount}">아직 없음</label>`;
        }
        

        // // 체크박스들을 가져옵니다.
        // var checkboxes = document.querySelectorAll('#전체친구목_table tbody input[type="checkbox"]');

        // // 각 체크박스에 클릭 이벤트를 추가합니다.
        // checkboxes.forEach(function(checkbox) {
        //     checkbox.addEventListener('click', function() {
        //         // 체크박스가 체크되었는지 확인합니다.
        //         if (this.checked) {
        //             // 체크된 체크박스의 id 값을 리스트에 추가합니다.
        //             clickedCheckboxes.push(this.id);
        //         } else {
        //             // 체크가 해제된 체크박스의 id 값을 리스트에서 제거합니다.
        //             var index = clickedCheckboxes.indexOf(this.id);
        //             if (index !== -1) {
        //                 clickedCheckboxes.splice(index, 1);
        //             }
        //         }

        //         // 리스트에 담긴 클릭된 체크박스의 정보를 출력합니다.
        //         console.log(clickedCheckboxes);
        //     });
        // });
                


    }).catch((error) => {
        // 데이터를 가져오는 도중 에러가 발생했을 때 실행되는 코드
        console.error("전체_친구목록_불러오기에서 오류 발생:", error);
    });
});


function 그룹탭에_추가(){

    var checkboxes = document.querySelectorAll('#전체친구목_table tbody input[type="checkbox"]');

    checkboxes.forEach(function(checkbox) {
        if (checkbox.checked) {
            체크박스_친구목록.push(checkbox.id);
        }
    });

    
    var tabld_이름 = document.getElementById('메시지대상_table');
    var tbody_이름 = tabld_이름.getElementsByTagName('tbody')[0];
    var tbody_tr_개수 = tbody_이름.querySelectorAll('tr');

    // 각 <tr> 요소를 반복하면서 삭제합니다.
    tbody_tr_개수.forEach(function(row) {
        // 현재 <tr> 요소를 삭제합니다.
        row.parentNode.removeChild(row);
    });

    
    
    console.log(tbody_tr_개수);

    // "추가" 버튼 클릭 시 행 추가
    var rowCountInput = 체크박스_친구목록.length+1; // 예시로 3개의 행을 추가합니다./
    // var rowCountInput = 회원_전체_정보.친구목록.length+1; // 예시로 3개의 행을 추가합니다.//
    var rowCount = 0; // 초기 행 개수/

    if (!isNaN(rowCountInput) && rowCountInput > 0) {
        for (var i = 0; i < rowCountInput - 1; i++) {
            addRow();
        }
    }

    function addRow() {
        이름변수 = document.getElementById(체크박스_친구목록[rowCount].replace('체크박스','이름')).innerText
        rowCount++; // 새로운 행을 추가할 때마다 rowCount 증가
        var 친구목록_tr = tbody_이름.insertRow(-1);
        var 전송_체크박스_td = 친구목록_tr.insertCell(0);
        var 전송_이름_td = 친구목록_tr.insertCell(1);
        var 호칭_td = 친구목록_tr.insertCell(2);
        var 존대_체크박스_td = 친구목록_tr.insertCell(3);
        전송_체크박스_td.innerHTML = `<input type="checkbox" id="전송_체크박스${rowCount}" placeholder="이름(자동)">`;
        전송_이름_td.innerHTML = `<label type="text" id="전송_이름${rowCount}">${이름변수}</label>`;
        호칭_td.innerHTML = `<label type="text" id="전송_호칭${rowCount}">아직 없음</label>`;
        존대_체크박스_td.innerHTML = `<input type="checkbox" id="존대_체크박스${rowCount}" placeholder="이름(자동)">`;
    }
    체크박스_친구목록 = []
    

    // console.log('apfhd')
    
}



// 메시지를 작성하는 함수입니다.
function 메시치창으로이동() {
    전송대상_정보 = []
    체크박스_전송목록 = []
    
    var checkboxes = document.querySelectorAll('#메시지대상_table tbody input[type="checkbox"]');

    checkboxes.forEach(function(checkbox) {
        if (checkbox.checked) {
            체크박스_전송목록.push(checkbox.id);
        }
    });
    // console.log(체크박스_전송목록)
    체크박스_전송목록.forEach(function(전송목록) {
        // 현재 <tr> 요소를 삭제합니다.
        // console.log(전송목록)
        전송정보 = {
            이름 : document.getElementById(전송목록.replace('전송_체크박스','전송_이름')).innerText,
            호칭 : document.getElementById(전송목록.replace('전송_체크박스','전송_호칭')).innerText,
            존대 : document.getElementById(전송목록.replace('존대_체크박스','전송_호칭')).checked
        }

        전송대상_정보.push(전송정보);
    });


    console.log(전송대상_정보)


    var confirmReload = confirm(`${전송대상_정보.length} 명에게 전송하시겠습니까?`);
    
    // 확인을 받은 경우에만 새로고침을 수행합니다.
    if (confirmReload) {
        console.log('승인 눌림')
        localStorage.setItem('전송대상_정보', JSON.stringify(전송대상_정보));
        window.location = 'http://127.0.0.1:5500/htmls/메시지발송.html?code'
    }
    else{
        console.log('취소 눌림')
    }


}