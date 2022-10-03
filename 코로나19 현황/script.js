//일반 인증키 : R6W5Dm9WxSDjBSSsJloPdjoev%2FuGEbaC4oQmZqV4Tii4KB8w4m9QxeO%2BfyWcUWws9ntmPIzWVKlW93dNkLNsxQ%3D%3D

//http://openapi.data.go.kr/openapi/service/rest/Covid19/getCovid19NatInfStateJson?serviceKey=R6W5Dm9WxSDjBSSsJloPdjoev%2FuGEbaC4oQmZqV4Tii4KB8w4m9QxeO%2BfyWcUWws9ntmPIzWVKlW93dNkLNsxQ%3D%3D&startCreateDt=20200310&endCreateDt=20200414

let month; //월

function minusclick(){

  tmp_month = localStorage.getItem("month");
  tmp_month = parseInt(tmp_month);
  if(tmp_month == 1){
    return;
  }

  console.log(localStorage.getItem("month"));
  if(localStorage.getItem("month") == null){
    localStorage.setItem("month","3");
    month = localStorage.getItem("month");
  }
  else{
    month = localStorage.getItem("month"); //3
    month = parseInt(month);
    month--;
    localStorage.setItem("month", month);
  }
  console.log("month: " + month);

  window.location.reload();
}

function plusclick(){

  tmp_month = localStorage.getItem("month");
  tmp_month = parseInt(tmp_month);
  if(tmp_month == 12){
    return;
  }

  console.log(localStorage.getItem("month"));
  if(localStorage.getItem("month") == null){
    localStorage.setItem("month","3");
    month = localStorage.getItem("month");
  }
  else{
    month = localStorage.getItem("month"); //3
    month = parseInt(month);
    month++;
    localStorage.setItem("month", month);
  }
  console.log("month: " + month);
  window.location.reload();
}

const getXMLfromAPI = () => {

    console.log("month: " + localStorage.getItem("month"));

    const url = 'http://openapi.data.go.kr/openapi/service/rest/Covid19/getCovid19InfStateJson';
    const authKey = 'R6W5Dm9WxSDjBSSsJloPdjoev%2FuGEbaC4oQmZqV4Tii4KB8w4m9QxeO%2BfyWcUWws9ntmPIzWVKlW93dNkLNsxQ%3D%3D';

    month = localStorage.getItem("month");

    let reqURL;
    if(month == 12 || month == 10){
      reqURL = url + '?serviceKey=' + authKey + '&startCreateDt=2022' + month + '01' + '&endCreateDt=2022' + month + '31';
    }
    else if(month == 11){
      reqURL = url + '?serviceKey=' + authKey + '&startCreateDt=2022' + month + '01' + '&endCreateDt=2022' + month + '30';
    }
    else{
      if(month == 1 || month == 3 || month == 5 || month == 7 || month == 8){
        reqURL = url + '?serviceKey=' + authKey + '&startCreateDt=20220' + month + '01' + '&endCreateDt=20220' + month + '31';
      }
      else if(month == 2){
        reqURL = url + '?serviceKey=' + authKey + '&startCreateDt=20220' + month + '01' + '&endCreateDt=20220' + month + '28';
      }
      else{
        reqURL = url + '?serviceKey=' + authKey + '&startCreateDt=20220' + month + '01' + '&endCreateDt=20220' + month + '30';
      }
    }

    console.log(reqURL);
    //cross origin
    let getXML = fetch(reqURL, {method: 'GET'}).then(function(result){
        return result.text();
    }).then(function(xmlStr){
      //string 데이터를 돔 트리로 파싱
        const parser = new DOMParser();
        const doc = parser.parseFromString(xmlStr,"application/xml");

        const errorNode = doc.querySelector("parsererror");
        if(errorNode){
          console.log("error while parsing");
        }else{
          console.log(doc.documentElement.nodeName);
        }

        generateTable(doc);
    })
};

function generateTable(doc){

  const tbl = document.getElementsByTagName("table");
  console.log(tbl);
  const tblBody = document.createElement("tbody");

  const itemNum = doc.getElementsByTagName('item').length;

  for(let i = 0; i< itemNum; i++){
    const row = document.createElement("tr");

    for(let j = 0; j< 4; j++){
      let createDt;
      let decideCnt;
      let deathCnt;
      let updateDt;
      let cellText;
      let cell = document.createElement("td");
      if(j == 0){
        createDt = doc.getElementsByTagName('createDt')[i].textContent;
        cellText = document.createTextNode(createDt);
      }
      if(j == 1){
         decideCnt = doc.getElementsByTagName('decideCnt')[i].textContent;
         cellText = document.createTextNode(decideCnt);
      }
      if(j == 2){
        deathCnt = doc.getElementsByTagName('deathCnt')[i].textContent;
        cellText = document.createTextNode(deathCnt);
      }
      if(j == 3){
        if(doc.getElementsByTagName('updateDt')[i] != null){
          updateDt = doc.getElementsByTagName('updateDt')[i].textContent;
        }
        cellText = document.createTextNode(updateDt);
      }
      cell.appendChild(cellText);
      row.appendChild(cell);
    }
    tblBody.appendChild(row);
  }
  tbl[0].appendChild(tblBody);
//  document.body.appendChild(tbl[0]); //body 제일 밑에 들어감
  tbl[0].setAttribute("border", "2");

  generateLineChart(doc);
}

function generateLineChart(doc){

  let arr = [];
  let DeathCnt = [];
  let DefCnt = [];

  if(month >= 10){
    return;
  }

  const items = doc.getElementsByTagName('item');


  [...items].forEach((item, i) => {
    arr.push(i)
    DeathCnt.push(item.querySelector('deathCnt').textContent);
    console.log(item.querySelector('deathCnt').textContent);
    DefCnt.push(item.querySelector('decideCnt').textContent);
    console.log(item.querySelector('decideCnt').textContent);
  });

  DeathCnt.reverse();
  DefCnt.reverse();

  new Chart(document.getElementById("line-chart"), {
    type:'line',
    data: {
      labels: arr,
      datasets: [
        {
          data: DefCnt,
          label: '확진자수',
          borderColor : "red",
          fill: true,
        }, {
          data: DeathCnt,
          label: '사망자수',
          borderColor : "#3e95cd",
          fill: true
        }
      ]
    },
    options : {
      title: {
        display : true,
      }
    }
  })
}


(function init() { //즉시실행함수
  getXMLfromAPI();
})();
