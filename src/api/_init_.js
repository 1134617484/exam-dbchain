const prod_cdn = "https://static.sosoyoyo.com",
  test_cdn = "http://static.test.sosoyoyo.com";

const prod_login = "http://login.sosoyoyo.com",
  test_login = "http://login.test.sosoyoyo.com";

exports.APIURL = {
  build: "https://sapi.sosoyoyo.com",
  test: "http://sapi.test.sosoyoyo.com",
  serve: "http://192.168.2.25:8000",
  cdn: process.env.VUE_APP_FLAG === "pro" ? prod_cdn : test_cdn,
  login: process.env.VUE_APP_FLAG === "pro" ? prod_login : test_login
};
