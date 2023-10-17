// ����� �����մϴ�.
var fs = require('fs');
var express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

// ������ �����մϴ�.
var app = express();
// �̵��� �����մϴ�.
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));

// ����͸� �����մϴ�.
app.get('/', function (request, response) {

    response.redirect('/login');
});

app.get('/login', function (request, response) {
  fs.readFile('login.html', function (error, data) {
    response.send(data.toString());
  }
  );
});

app.post('/login', function (request, response) {
  // ��Ű�� �����մϴ�.
  var login = request.body.login;
  var password = request.body.password;

  // ����մϴ�.
  console.log(login, password);
  console.log(request.body);

  // �α����� Ȯ���մϴ�.
  if (login == 'rint' && password == '1234') {
    // �α��� ����
    response.cookie('auth', true);
    response.redirect('/');
  } else {
    // �α��� ����
    response.redirect('/login');
  }
});

// ������ �����մϴ�.
app.listen(52273, function () {
  console.log('Server running at http://127.0.0.1:52273');
});