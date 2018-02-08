# trading_server


open_api 불러오기 모듈화
1. setInterval 부분 module화 하기
2. setInterval 부분 클래스화(프로토타입화)하기


parsing하기
1. 그동안 불러온 데이터 parsing하기
2. 데이터구조 변경하기
=> config 파일에 파싱 내역 입력하면 알아서 parsing 할 수 있도록 구현하기

SPA 페이지 설계하기
1. event확인 페이지 : 특정 코인의 가격, 볼륨 변화량 또는 타 거래소의 시세차이량이 높은 경우에 관한 기록들을 확인 할 수 있는 페이지
2. 모든 거래소 코인 가격 페이지 : 모든 거래소의 코인 가격을 보여주는 페이지, 로그인 기능으로 특정 코인의 가격이 넘으면 알람을 받을 수 있게 해주는 기능 추가 (사실 이게 메인)


todo

input data to mysql which I get by email

input data to hbase which I get from open api

input data to redis which I want to check sepcially

hbase map reduce 공부하기



use all trading site to get the information that what coin could be raised.
cryptopia 
바이낸스
업비트
코인링크
비트렉스
폴로닉스 
Hitbtc

auto trading in bittrex

~~mail system~~

periodic request
https://stackoverflow.com/questions/30541831/make-a-request-every-one-minute-with-node-js

위는 서버를 2개를 둬야 할까? 2개에 api정보를 얻어오는 것도 편하긴 하겠지만 standalone이 가능하면 standalone이 조금 더 좋을 것 음
CICD (continuous integration and continuous delivery)
https://aws.amazon.com/blogs/compute/tag/cicd/\r\n


Question
setInterval을 꼭 restart 해야하는 이유가 있나?
setInterval을 하는 거은 openapi에서 데이터를 가져오는 것 => restart를 할 필요는 없음
=> 
setInterval을 restart하려는 이유는 open_api (정보 가져오는 부분)을 동적으로 추가하기 위함이다.
동적으로 추가하기 1
보통의 동적으로 추가하기 위해서는 config 파일로 open_api의 주소만 적어서 동적으로 추가 가능하다.
동적으로 추가하기 2
open api를 불러오는 부분에 이벤트를 입력하여 해당 이벤트가 들어오면 추가하는 방법도 있다.
===>
현재 구조에서는 동적으로 추가를 할 수 없는데 그 이유는 parsing과 불러오는 부분을 동시에 처리하고 있기 때문이다.
open_api에 불러오는 부분과 parsing하는 부분에 대해서 나누고 config파일로 해당 파라미터를 나누면 동적으로 추가가 가능할 것으로 보인다.