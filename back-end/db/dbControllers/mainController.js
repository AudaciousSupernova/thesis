var mysql = require('mysql');


var connection = mysql.createConnection({
  user: "root",
  password: "supernova",
  database: "main"
});

connection.connect(function(err){
	if(err){
		console.log("error connection to Main Db");
		return;
	}
	console.log('Connected to Main Db')
});


//takes a userObj with name, email, karma, facebookKey, id, password
var addUser = function(userObj){
	connection.query('INSERT INTO users SET ?', userObj, function(err, res){
		if(err){
			console.log("error inserting into users db", err)
		} else{
			console.log("last inserted Id: ", res.insertId);
			return res.insertId
		}
	})
}

//finds a user based on the name and password inserted
//usefull for login
var findUser = function(name, password){
	connection.query('SELECT * FROM users where name=? and password=?', [name, password], function(err, rows){
		if(err){
			console.log("Error finding user by name :", err)
		} else{
			console.log(rows)			
		}
	})
}


//finds the user by id, useful for buy/sell events
var findUserById = function(userId){
	connection.query('SELECT * FROM users where id=?', userId, function(err, rows){
		if(err){
			console.log("Error finding user by id :", err)
		} else{
			console.log(rows)			
		}
	})
}
var updateKarma = function(userId, newKarma){
	
	con.query('UPDATE users SET karma = ? Where ID = ?',[newKarma, userid], function (err, result) {
	    if (err){
	    	console.log("Error updating Karma of userId " + userId)
	    }

	    console.log('Changed ' + result.changedRows + ' rows');
	  }
	);
}

var deleteUser = function(userId){
	connection.query('DELETE FROM users WHERE id = ?',userId, function (err, result) {
    if (err) {
    	console.log("error deleting user " + userId, err)
    }else{
	    console.log('Deleted user number ' + userId);   	
    }
  });
}


module.exports = {
	connection: connection,
	addUser: addUser,
	deleteUser: deleteUser,
	findUser: findUser,
	findUserById: findUserById
}


//example code

// var db = require('../db');

// module.exports = {

//   messages: {
//     get: function (callback) {
//       // fetch all messages
//       // text, username, roomname, id
//       var queryStr = "select messages.id, messages.text, messages.roomname, users.username \
//                       from messages left outer join users on (messages.userid = users.id) \
//                       order by messages.id desc";
//       db.query(queryStr, function(err, results) {
//         callback(err, results);
//       });
//     },
//     post: function (params, callback) {
//       // create a message for a user id based on the given username
//       var queryStr = "insert into messages(text, userid, roomname) \
//                       value (?, (select id from users where username = ? limit 1), ?)";
//       db.query(queryStr, params, function(err, results) {
//         callback(err, results);
//       });
//     }
//   },
//   users: {
//     get: function (callback) {
//       // fetch all users
//       var queryStr = "select * from users";
//       db.query(queryStr, function(err, results) {
//         callback(err, results);
//       });
//     },
//     post: function (params, callback) {
//       // create a user
//       var queryStr = "insert into users(username) values (?)";
//       db.query(queryStr, params, function(err, results) {
//         callback(err, results);
//       });
//     }
//   }
// };