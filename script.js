const info = $('#metainfo'); //영화 정보가 출력될 부분
const dInfo = document.getElementById('dateInfo');//날짜정보 출력 부분
const list = 
document.getElementById('list'); //BoxOffice 리스트 출력될 부분
const search = document.getElementById('search'); //검색버튼
const date = document.getElementById('date'); //날짜 입력창

var boxData; //boxoffice data response를 저장할 변수

const preboxUrl = "http://www.kobis.or.kr/kobisopenapi/webservice/rest/boxoffice/searchDailyBoxOfficeList.json"; //boxoffice open api에 요청할 url(미완성)
const boxKey = "d3239064e41255cba5f6e17345e4facc"; //boxoffice open api key

search.addEventListener('click', getDate); // 검색 버튼 눌렀을 때 boxOffice 조회하기

function getDate() { //입력받은 날짜를 원하는 형식으로 바꿔서 boxUrl에 합치기
  $(list).empty(); //list 초기화
  var preDate = date.value; //입력받은 date 형식: yyyy-mm-dd
  var dateArray = preDate.split("-"); //-를 기준으로 문자열 나누기
  var targetDate = "";
  for(var i=0; i < dateArray.length; i++) {
    targetDate += dateArray[i]; //나눈 문자열 합치기
  }
  if(dateArray[0]<2010) {
    alert("날짜는 2010년 이후여야 합니다.");
    date.focus();//날짜 입력 창으로 focus 이동
    return; //data요청하지 않고 함수 종료
  }
  dInfo.innerHTML = targetDate + " BoxOffice"; //검색 결과에 날짜 표시
  var boxUrl = preboxUrl + "?key=" + boxKey + "&targetDt=" + targetDate;
  boxSendHttpRequest('GET', boxUrl);
}

function boxSendHttpRequest(method, url) { 
  const xhr1 = new XMLHttpRequest();
  xhr1.addEventListener("readystatechange", function() {
    if(this.readyState === 4) {
      if(this.status != 200 && this.status != 201) { //status가 200이나 201이 아니면 알림창 띄우기
        alert("Box Office 정보를 불러올 수 없습니다: " + this.status);//알림창과 함께 status정보 출력
      }
    }
  });
  xhr1.open(method, url);
  xhr1.responseType = 'json';
  xhr1.onload = () => {
    var data = xhr1.response;
    boxData = data.boxOfficeResult.dailyBoxOfficeList;
    boxList(boxData);//boxoffice 랭킹을 화면에 출력하는 함수
  };
  xhr1.send();
}

function boxList(boxData) {
  var num; //Ranking number
  for (var i = 0; i < boxData.length; ++i) {
    var temp = document.createElement("div"); // create div element
    temp.setAttribute("style", "padding:0px; margin:0; width:100%; display:flex; justify-content:center; align-items:center;"); //div element의 style 설정 
    num = i+1; 
    temp.innerHTML += "<span style='margin-left:-50px; margin-right:20px; font-weight:700; font-size:32px;'>" + num + "</span><button type='button' style='width:80%; border:none; background-color:#f9f9f9; color:#121212; border-top-left-radius: 15px; border-bottom-right-radius: 15px; outline:none; padding:20px 0; margin:20px 0; font-weight:700; font-size:32px; cursor: pointer;' id='boxBtn"+i+"'>" + boxData[i].movieNm + "</button><br><br><br>"; //span element에 랭킹 출력, button에 영화 이름 출력
    list.appendChild(temp); //list 내부에 temp 추가

    var boxBtn = document.getElementById('boxBtn'+ i);
    boxBtn.addEventListener('click', getTitleAndDate); //i번째 버튼을 클릭할 경우 i번째 영화 이름과 개봉일을 얻어내는 함수
  }
}

// Youtube 조회하기
const v = document.getElementById('video');
const mvTitle = document.getElementById('mvTitle');
const mvEngDt = document.getElementById('mvEngDt');
const premvUrl = "http://api.koreafilm.or.kr/openapi-data2/wisenut/search_api/search_json2.jsp?collection=kmdb_new2&detail=Y&ServiceKey=OI3A656D7FUU93R5GM8X";
var title = "";//영화 정보 open api에 요청할 url (미완성)
var openDate = ""; //개봉일 저장할 변수

var optionParams = { //youtube url의 요청변수 목록
	part: "snippet",
	key: "AIzaSyArxcpXKmBPCZdJWp8Kq5fLWXX48Y6J324",
	type: "video",
	maxResults: 10,
	regionCode: "KR",
	videoDuration: "short"
};

var preytbUrl="https://www.googleapis.com/youtube/v3/search?";
for(var option in optionParams){
	preytbUrl += option + "=" + optionParams[option] + "&";
} //youtubeUrl에 요청변수 목록 더하기 (영화 제목이 빠져 있으므로 미완성)

function getTitleAndDate() { //boxoffice의 i번째 버튼을 클릭했을 때 실행하는 함수
  var index = $(this).parent().index(); //i 얻어오기
  colorButton(index); //클릭한 버튼의 색 바꾸기
  title = boxData[index].movieNm; 
  boxDate = boxData[index].openDt; //boxoffice data 목록으로부터 개봉일 얻어오기 (yyyy-mm-dd 형식)
  var preOpenDate = boxDate.split("-"); //'-'를 기준으로 날짜 나누기
  openDate = "";
  for(var i=0; i < preOpenDate.length; i++) {
    openDate += preOpenDate[i];//개봉일 yyyymmdd형식으로 바꾸어 저장
  }
  mvTitle.value = title;//영화 제목 출력
  setUrl();//youtube와 영화 정보의 url 설정하는 함수
}

function setUrl(){
  var ytbUrl = "";
  var mvUrl = "";
  ytbUrl += preytbUrl + "q=" + encodeURI(title + "예고편"); //영화 제목에 '예고편' 붙여서 youtube에서 검색, 한글로 검색할 경우 에러 발생 가능성 있으므로 encoding 해줌
  mvUrl += premvUrl + "&title=" + title + "&releaseDts=" + openDate + "&releaseDte=" + openDate; //영화 제목으로만 검색하면 중복되는 제목도 함께 검색되므로 개봉일까지 합쳐서 영화정보 검색
  ytbSendHttpRequest('GET', ytbUrl);
  mvSendHttpRequest('GET', mvUrl);
}

function colorButton(index) {
  for(var i=0; i<10; i++) {
    document.getElementById('boxBtn'+i).setAttribute("style", "width:80%; border:none; background-color:#f9f9f9; color:#121212; border-top-left-radius: 15px; border-bottom-right-radius: 15px; outline:none; padding:20px 0; margin:20px 0; font-weight:700; font-size:32px; cursor: pointer;");
  } //모든 boxoffice 버튼의 색을 하얀색으로 초기화
  var clkBtn = document.getElementById('boxBtn'+index);
  clkBtn.setAttribute("style",
  "width:80%; border:none; background-color:#6e5bba; color:#f9f9f9; border-top-left-radius: 15px; border-bottom-right-radius: 15px; outline:none; padding:20px 0; margin:20px 0; font-weight:700; font-size:32px; cursor: pointer;") //클릭한 boxoffice 버튼의 색 보라색으로 변경
}

function ytbSendHttpRequest(method, url) {
  var xhr2 = new XMLHttpRequest();
  xhr2.addEventListener("readystatechange", function() {
    if(this.readyState === 4) {
      if(this.status != 200 && this.status != 201) {
        alert("Youtube 재생목록을 불러올 수 없습니다: " + this.status);
      }
    }
  });
	xhr2.open(method, url);
	xhr2.responseType = 'json';
  xhr2.onload = () => {
		var data = xhr2.response;
    var ytbId= data.items[0].id.videoId;
    showVideo(ytbId); //youtube 재생창 띄우는 함수
  };
	xhr2.send();
}

function showVideo(id) {
  v.innerHTML = '<iframe src="http://www.youtube.com/embed/' + id + '?autoplay=0" style="overflow:hidden;height:300px;width:100%;" frameborder="0" allowfullscreen></iframe>';
} //youtube 로고 이미지 없애고 iframe으로 youtube 재생창 띄우기

// 영화정보 조회하기
//영화정보 출력창을 선택하는 변수
const mvTitleEng = document.getElementById('mvTitleEng');
const mvRating = document.getElementById('mvRating');
const mvGenre = document.getElementById('mvGenre');
const mvCompany = document.getElementById('mvCompany');
const mvDirector = document.getElementById('mvDirector');
const mvActor = document.getElementById('mvActor');

const summary = document.getElementById('summary');
const poster = document.getElementById('poster');
const more = document.getElementById('more');//영화정보 database site로 이동할 버튼

var pstUrl = ""; //poster 이미지의 url
var mvSum = ""; //영화 줄거리
var dbUrl = ""; //영화정보 database 사이트로 이동할 url

function mvSendHttpRequest(method, url) {
  var xhr3 = new XMLHttpRequest();
  xhr3.addEventListener("readystatechange", function() {
    if(this.readyState === 4) {
      if(this.status != 200 && this.status != 201) {
        alert("영화 정보 목록을 불러올 수 없습니다: " + this.status);
      }
    }
  });
	xhr3.open(method, url);
	xhr3.responseType = 'json';
  xhr3.onload = () => {
		var data = xhr3.response;
    infoList = data.Data[0].Result;
    showInfo(infoList); //영화정보 출력하는 함수
  };
	xhr3.send();
}

//영화 정보 출력하는 함수
function showInfo(infoList) {
  mvEngDt.value = infoList[0].titleEng + " - " + openDate; //영화의 영어 제목과 개봉일 출력
  mvRating.value = infoList[0].rating;
  mvGenre.value = infoList[0].genre;
  mvDirector.value = infoList[0].directors.director[0].directorNm;
  mvCompany.value = infoList[0].company;
  var arrayActor = infoList[0].actors.actor; //배우 목록을 배열로 저장
  var strActor = ""; //문자열로 변환한 배우 이름 저장할 변수
  for(var i=0; i<5; i++) { //배열에 저장된 배우의 이름 문자열로 변환해서 strActor에 저장
    if( i!=4 ) {
      strActor += arrayActor[i].actorNm + ", "; //5번째 배우가 아니라면 이름 뒤에 , 붙이기
    } else {
      strActor += arrayActor[i].actorNm;
    }
  }
  mvActor.value = strActor; //배우 5명의 이름 출력
  var prePst = infoList[0].posters; //여러개의 poster 주소를 받아옴
  var pstArray = prePst.split('|'); // | 를 기준으로 poster 주소 나누기
  pstUrl = "";
  pstUrl += pstArray[0]; //첫번째 poster 주소를 저장
  mvSum = "";
  mvSum = infoList[0].plots.plot[0].plotText; //줄거리를 저장
  dbUrl = "";
  dbUrl = infoList[0].kmdbUrl;
}

// 버튼에 기능 추가하기
function openPoster() {
  if(pstUrl=="") {
    alert("검색결과가 없습니다.")
    date.focus(); //날짜 입력 창으로 focus 이동
  } else {
    var OpenWindow = window.open(pstUrl, '_blank', 'width='+250+',height='+350+',menubars=no, scrollbars=auto'); // 팝업 창에서 poster 이미지 열기
    OpenWindow;
  }
}

function openSummary() {
  if(mvSum=="") {
    alert("검색결과가 없습니다.")
    date.focus();//날짜 입력 창으로 focus 이동
  } else {
    alert(mvSum);//알림창에 줄거리 출력
  }
}

function openSite() {
  if(dbUrl=="") {
    alert("검색결과가 없습니다.")
    date.focus();//날짜 입력 창으로 focus 이동
  } else {
    var OpenWindow = window.open(dbUrl, 'Box Office');
    OpenWindow;//새 창에서 영화정보 database 사이트 열기
  }
}

