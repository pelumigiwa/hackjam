const jwt = require('jsonwebtoken');

var secretKey = '783b3s9i3jiis9g3hss83h3b8s7b393h3u',
    user = 'shuntigs@gmail.com',
    token = jwt.sign({ expiresIn: '0', data: user }, secretKey);


jwt.verify(token, secretKey, function(err, decoded) {
    if (err) {
        console.log('err: ', err.message)
    } else {
        console.log(decoded.data);
    }
});