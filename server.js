"use strict";

var express    = require('express'),
    mysql      = require('mysql'),
    bodyParser = require('body-parser'), // for POST 
    app        = express(),
    connpool   = mysql.createPool({
      host     : process.env.HOST,
      user     : process.env.USER,
      password : process.env.PASS,
    });

app.set('port', process.env.PORT || 3000);
app.use(bodyParser.urlencoded({ extended: false }));

///////////////////////////////////////////////////////////////////////////////
/// Utility functions
///////////////////////////////////////////////////////////////////////////////

function _error(e) { console.error('x error:', e); }

function _warning(w) { console.error('! warning:', w); }

function _debug(m) { console.log('> debug: ', m); }

///////////////////////////////////////////////////////////////////////////////
/// Error handlers
///////////////////////////////////////////////////////////////////////////////

function handleMysqlConnErr(err, res) {
  _error(err);
  res.statusCode = 503;
  res.type('json');
  res.send({text: '', error: err});
}

function handleMysqlQueryErr(err, res) {
  _error(err);
  res.statusCode = 500;
  res.type('json');
  res.send({text: '', error: err});
}

///////////////////////////////////////////////////////////////////////////////
/// Test methods
///////////////////////////////////////////////////////////////////////////////

app.get('/mysql/connected', function(req, res) { 
  connpool.getConnection(function(err, conn) {
    if (err) {
      handleMysqlConnErr(err, res);
    } else {
      console.log("> responded to mysql/connected");
      res.status(200);
      res.type('json');
      res.send("{'connected':'true'}");
    }
  })
});

app.get('/json/test', function(req, res) {
  connpool.getConnection(function(err, conn) {
    if (err) {
      handleMysqlConnErr(err, res);
    } else {
      console.log("> responded to get json/test.");
      res.status(200);
      res.type('json');
      res.send("{'fname':'kendal', 'lname':'harland', 'age':'21'}");
    }
  })
});

app.put('/json/test', function(req, res) {
  connpool.getConnection(function(err, conn) {
    if (err) {
      handleMysqlConnErr(err, res);
    } else {
      console.log("> responded to put json/test.");
      res.status(200);
      res.type('json');
      res.send("{'fname':'kendal', 'lname':'harland', 'age':'21'}");
    }
  })
});

app.delete('/json/test', function(req, res) {
  connpool.getConnection(function(err, conn) {
    if (err) {
      handleMysqlConnErr(err, res);
    } else {
      console.log("> responded to delete json/test.");
      res.status(200);
      res.type('json');
      res.send("{'fname':'kendal', 'lname':'harland', 'age':'21'}");
    }
  })
});

app.post('/json/test', function(req, res) {
  connpool.getConnection(function(err, conn) {
    if (err) {
      handleMysqlConnErr(err, res);
    } else {
      console.log("> responded to post json/test.");
      res.status(200);
      res.type('json');
      res.send(JSON.stringify(req.body));
    }
  })
});

///////////////////////////////////////////////////////////////////////////////
/// Server paths
///////////////////////////////////////////////////////////////////////////////

app.post('/create/reservation', function(req, res) {
  connpool.getConnection(function(err, conn) {
    if (err) {
      handleMysqlConnErr(err, res);
    } else {
      console.log("> responded to post create/reservation.");
      res.status(200);
      res.type('json');
      res.send(JSON.stringify(req.body));
    }
  })
});

// app.get('/get/user/events/:userid', function(req, res) {
//   connpool.getConnection(function (err, conn) {
//     if (err) {
//       handleMysqlConnErr(err, res);
//     } else {
//       var qstr = "call getUserEvents(?);";
//       var args = [req.params.userid];
//       conn.query(qstr, args, function(err, rows, fields) {
//         conn.release();
//         if (err) {
//           handleMysqlQueryErr(err, res);
//         } else {
//           res.status(200);
//           res.type('json');
//           res.send({text: rows[0], error: ''});
//         }
//       });
//     }
//   });
// });

// app.get('/create/user/group/:userid/:group', function (req, res) {
//   connpool.getConnection(function (err, conn) {
//     if (err) {
//       handleMysqlConnErr(err, res);
//     } else {
//       var qstr = "call createUserGroup(?,?);";
//       var args = [req.params.userid, req.params.group];
//       conn.query(qstr, args, function(err, rows, fields) {
//         conn.release();
//         if (err) {
//           handleMysqlQueryErr(err, res);
//         } else {
//           res.status(200);
//           res.type('json');
//           res.send({text: rows[0], error: ''});
//         }
//       });
//     }
//   });
// });

app.listen(app.get('port'));
console.log("server running on port:", app.get('port'));
