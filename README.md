# 초기 환경 설정

아래 내용을 참고로 환경 변수를 설정한다. 환경 변수는 mongodb 접속 URL, Access Token, Refresh Token 해시값이다.

```
DATABASE_URI=mongodb://127.0.0.1:27017/ollmaai
ACCESS_TOKEN_SECRET=secret
REFRESH_TOKEN_SECRET=refresh
```

# Sample 정보 추가

mongodb 에서 아래 명령을 내려 테스트 데이터를 추가한다. 
암호화된 bcrypt 값은 https://www.toptal.com/developers/bcrypt/ 에서 Cost를 10으로 해서 넣어보면 얻을 수 있다.

```
db.users.insertOne({
    username: 'user',
    password: '$2b$10$2tUSpbvfUKHbFYUKDuyxLuEv31VwcsEXkB54BBlvxXOy/tSWRkMPa',
    roles: { User: 2001 },
    refreshToken: []
  })
```

# 관리자 및 에디터 내역 추가

관리자 / 에디터는 users 에 특정 정보를 추가로 넣어주어야한다.

```
db.users.updateOne({username: 'user'}, {$set: {roles: {User: 2001, Admin: 5150}}})

```