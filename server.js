"use strict";

var express    = require('express'),
    mysql      = require('mysql'),
    bodyParser = require('body-parser'), // for POST 
    app        = express(),
    connpool = mysql.createPool({
      host     : 'us-cdbr-iron-east-01.cleardb.net'
      user     : "b5f80331b8bbae",
      password : "3c1aad8a"
    });

app.set('port', 3000);
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/', function(req, res, next) {
  res.type('Content-type', 'application/json'); // This server returns only JSON requests
  next();
});

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
  res.send({text: '', error: err});
}

function handleMysqlQueryErr(err, res) {
  _error(err);
  res.statusCode = 500;
  res.send({text: '', error: err});
}

///////////////////////////////////////////////////////////////////////////////
/// Server paths
///////////////////////////////////////////////////////////////////////////////

app.get('/hello/world', function(req, res) { 
  connpool.getConnection(function(err, conn) {
    if (err) {
      handleMysqlConnErr(err, res);
    } else {
      console.log("> connected.")
      res.status(200);
      res.send("{'connected':'true'}");
    }
  })
});

app.get('/get/user/events/:userid', function(req, res) {
  connpool.getConnection(function (err, conn) {
    if (err) {
      handleMysqlConnErr(err, res);
    } else {
      var qstr = "call getUserEvents(?);";
      var args = [req.params.userid];
      conn.query(qstr, args, function(err, rows, fields) {
        conn.release();
        if (err) {
          handleMysqlQueryErr(err, res);
        } else {
          res.send({text: rows[0], error: ''});
        }
      });
    }
  });
});

app.get('/create/user/group/:userid/:group', function (req, res) {
  connpool.getConnection(function (err, conn) {
    if (err) {
      handleMysqlConnErr(err, res);
    } else {
      var qstr = "call createUserGroup(?,?);";
      var args = [req.params.userid, req.params.group];
      conn.query(qstr, args, function(err, rows, fields) {
        conn.release();
        if (err) {
          handleMysqlQueryErr(err, res);
        } else {
          res.send({text: rows[0], error: ''});
        }
      });
    }
  });
});

app.listen(app.get('port'));