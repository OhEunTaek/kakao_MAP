
//지도를 표시할 div
const mapContainer = document.getElementById('map');
//교통정보를 보게하는 버튼
const tOnBtn = document.querySelectorAll(".traffic li")[0];
//교통정보를 끄게하는 버튼
const tOffBtn = document.querySelectorAll(".traffic li")[1];
//branch버튼들을 모두선택한 배열의 변수
const branchBtn = document.querySelectorAll(".branch li");

let draggable = true;
let zoomable = true;
//보여질 지도의 옵션을 설정
const mapOptions = {
  //지도의 중심좌표
  center: new kakao.maps.LatLng(37.5258975, 126.9284261),
  //지도의 확대레벨
  level: 3
};
//지도를 표시할 div와 지도옵션으로 지도를 최종 생성하는 코드
const map = new kakao.maps.Map(mapContainer, mapOptions);
//마커 생성하는 옵션을 객체형태로 각 값을 설정하고, 그 값을 배열로 변수에 저장한것
const markerOptions = [
  {
    title: "본점",//제목
    latlng: new kakao.maps.LatLng(37.5258975, 126.9284261),//지도의 위치
    imgSrc: 'img/marker1.png',//마커이미지 경로
    imgSize: new kakao.maps.Size(232, 99),//마커 이미지 크기
    imgPos: { offset: new kakao.maps.Point(116, 69) },//마커 이미지 위치
    button: branchBtn[0],//마커와 매치할 버튼의 인덱스
  },
  {
    title: "지점1",
    latlng: new kakao.maps.LatLng(35.1631139, 129.1635509),
    imgSrc: 'img/marker2.png',
    imgSize: new kakao.maps.Size(232, 99),
    imgPos: { offset: new kakao.maps.Point(116, 69) },
    button: branchBtn[1],
  },
  {
    title: "지점2",
    latlng: new kakao.maps.LatLng(37.4706014, 126.9369485),
    imgSrc: 'img/marker3.png',
    imgSize: new kakao.maps.Size(232, 99),
    imgPos: { offset: new kakao.maps.Point(116, 69) },
    button: branchBtn[2],
  }
];

markerOptions.forEach((el, index) => {
  const marker = new kakao.maps.Marker({
    map: map,//앞의map은 Marker생성시 필요한 정보를 받는 변수이고, 뒤의 map은 우리가 위에서 선언한 map이다
    position: el.latlng,//지도의 위치, 위도경도값 - 이 값은 우리가 markerOptions에 latlng값으로 저장했으므로 해당 객체배열에 접근해서 가지온다
    title: el.title,//제목값이고 위와같이 접근해서 가지고 온다
    image: new kakao.maps.MarkerImage(el.imgSrc, el.imgSize, el.imgPos),//카카오에서 제공하는 MarkerImage라는 메서드를 사용하는데()안의 매개변수자리에 필요한 값이 markerOptions에 있기 때문에 각 값을 해당객체배열에 접근해서 가지고 오는것
  });
  //branch 버튼을 클릭했을 때 해당위치로 이동 및 버튼 활성화 시키는 코드 - markerOptions의 각 인덱스의 버튼을 접근해서 click이벤트를 걸어줌
  el.button.addEventListener("click", (e) => {
    e.preventDefault();
    //모든 버튼에 반복을돌면서 on을 지우고
    branchBtn.forEach(el => el.classList.remove("on"));
    //내가 클릭한 그 el만 접근해서 on을 붙임
    el.button.classList.add("on");
    //최종적으로 클릭한 인덱스의 위도 경도값으로 moveTo함수의 매개변수로 넣어 최종 이동시킴
    moveTo(el.latlng);
  });
});
//리사이즈 해도 지도의 가운데로 마커가 세팅되게 하는 이벤트
window.onresize = () => {
  const activeBtn = document.querySelector(".branch li.on");
  //먼저 on 활성화 클래스가 있는 li를 찾아서 변수에 담음
  const activeIndex = activeBtn.getAttribute("data-index");
  //위에 변수에서 활성화 되어있는 li안의 data-index 속성값을 가져옴 - 0,1,2 같은 숫자가 담김
  moveTo(markerOptions[activeIndex].latlng);
  //moveTo함수를 이용해서 activeIndex의 위도경도로 지도를 위치시킴
}

tOnBtn.addEventListener("click", (e) => {
  e.preventDefault();
  if (tOnBtn.classList.contains('on')) return;
  map.addOverlayMapTypeId(kakao.maps.MapTypeId.TRAFFIC);
  tOnBtn.classList.add("on");
  tOffBtn.classList.remove("on");
});

tOffBtn.addEventListener("click", (e) => {
  e.preventDefault();
  if (tOffBtn.classList.contains("on")) return;
  map.removeOverlayMapTypeId(kakao.maps.MapTypeId.TRAFFIC);
  tOffBtn.classList.add("on");
  tOnBtn.classList.remove("on");
});
// 일반 지도와 스카이뷰로 지도 타입을 전환할 수 있는 지도타입 컨트롤을 생성합니다
const mapTypeControl = new kakao.maps.MapTypeControl();
// 지도에 컨트롤을 추가해야 지도위에 표시됩니다
// // kakao.maps.ControlPosition은 컨트롤이 표시될 위치를 정의하는데 TOPRIGHT는 오른쪽 위를 의미합니다
map.addControl(mapTypeControl, kakao.maps.ControlPosition.TOPRIGHT);
// 지도 확대 축소를 제어할 수 있는  줌 컨트롤을 생성합니다
const zoomControl = new kakao.maps.ZoomControl();
map.addControl(zoomControl, kakao.maps.ControlPosition.RIGHT);

setDraggable(draggable);
setZoomable(zoomable);
// 버튼 클릭에 따라 지도 확대, 축소 기능을 막거나 풀고 싶은 경우에는 map.setZoomable 함수를 사용합니다
function setZoomable(isZoomable) {
  // 마우스 휠로 지도 확대,축소 가능여부를 설정합니다
  map.setZoomable(isZoomable);
}
// 버튼 클릭에 따라 지도 이동 기능을 막거나 풀고 싶은 경우에는 map.setDraggable 함수를 사용합니다
function setDraggable(isDraggable) {
  // 마우스 드래그로 지도 이동 가능여부를 설정합니다
  map.setDraggable(isDraggable);
}
//함수가 위치시킬 값을 매개로 받아서 
function moveTo(target) {
  const moveLatlng = target; //밑에 전달해서 최종 지도를 움직임
  map.setCenter(moveLatlng);//지도를 중심으로 이동시킴
}
