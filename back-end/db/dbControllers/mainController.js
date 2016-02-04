var mysql = require('mysql');
var _ = require('underscore')

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

//<h3> User database functions </h3>
//takes a userObj with name, email, karma, facebookKey, id, password
var addUser = function(userObj, callback){
	connection.query('INSERT INTO users SET ?', userObj, function(err, res){
		if(err){
			console.log("error inserting into users", err)
			callback(err, null)
		} else{
			console.log("last inserted Id: ", res.insertId);
			callback(null, res.insertId)
		}
	})
}

//finds a user based on the name and password inserted
//returns an array of obj's (should only be one) usefull for login
var findUser = function(name, password, callback){
	connection.query('SELECT * FROM users where name=? and password=?', [name, password], function(err, rows){
		// just do callback(err, user)
		if(err){
			console.log("Error finding user by name :", err)
			callback(err, null);
		} else{
			callback(null, rows);
		}
	})
}

var findUsersByPartial = function(string, callback){
	string+= "%"
	connection.query('SELECT * FROM users WHERE name LIKE ?', string, function(err, rows){
		// just do callback(err, user)
		if(err){
			console.log("Error finding user by partial :", err)
			callback(err, null);
		} else{
			callback(null, rows);
		}
	})	
}

//finds the user by id, useful for buy/sell events
//returns an array of obj's (should only be one)
var findUserById = function(userId, callback){
	connection.query('SELECT * FROM users WHERE id=?', [userId], function(err, rows){
		if(err){
			console.log("Error finding user by id :", err)
			callback(err,null);
		} else {
			callback(null,rows);
		}
	})
}


//finds the user by facebookKey, useful for buy/sell events
//returns an array of obj's (should only be one)
var findUserByFbKey = function(fbKey, callback){
	connection.query('SELECT * FROM users WHERE facebookKey=?', [fbKey], function(err, rows){
		if(err){
			console.log("Error finding user by facebookKey :", err)
			callback(err,null);
		} else {
			callback(null,rows);
		}
	})
}

//returns a count of the number of users in the Db
var countUsers = function(callback){
	connection.query('select count(*) from users', function(err, count){
		if(err){
			console.log("Error counting users :", err)
			callback(err, null)
		} else{
			// the response is an array of objects with the "count(*)" key
			// since we are actually doing the wildcard count that will be our key
			callback(null, count[0]['count(*)'])
		}
	})
}

//returns an array of all users, can be used for populating
var getAllUsers = function(callback){
	connection.query('select * from users', function(err, users){
		if(err){
			console.log("Error collecting users :", err)
			callback(err, null)
		} else{
			// the response is an array of objects with the "count(*)" key
			// since we are actually doing the wildcard count that will be our key
			callback(null, users)
		}
	})

}


//even though this leverages two controller methods since it is
//essentially just an update it is here
//newUserObj must have user_id and the new properties
var updateUser = function(newUserObj, callback){
	var user_id = newUserObj.id
	findUserById(user_id, function(err, userObj){
		userObj = userObj[0]
		_.extend(userObj, newUserObj)
		connection.query('UPDATE users SET ? Where ID = ?',[userObj, user_id], function (err, result) {
		    if (err){
		    	console.log("Error updating user # " + user_id)
		    	callback(err, null)
		    } else{
			    console.log('Updated user ' + user_id);
			    callback(null, userObj);
		    }
		  }
		);
	})
}

//updates the karma of a specified user this is kept as a
//seperate function because it utilized the difference rather
//than just overwriting the property, this leads to fewer
//db interactions. It CAN accept a negative value for karmaChange
var updateKarma = function(userId, karmaChange, callback){
	connection.query('UPDATE users SET karma = karma +? Where ID = ?',[karmaChange, userId], function (err, result) {
	    if (err){
	    	console.log("Error updating Karma of userId " + userId)
	    	callback(err, null)
	    } else{
		    console.log('Changed user ' + userId + '\'s karma by ' + karmaChange);
		    callback(null, userId);
	    }
	  }
	);
}


//updates the photo of a specified user
var updatePhoto = function (userId, newPhoto, callback){
	connection.query('UPDATE users SET profile_photo = ? Where facebookKey = ?',[newPhoto, userId], function (err, response) {
	    if (err){
	    	console.log("Error updating Photo of userId " + userId)
	    	callback(err, null)
	    } else{
		    console.log('Changed user ' + userId + '\'s photo to ' + newPhoto);
		    callback(null, response);
	    }
	  }
	);
}


var deleteUser = function(userId, callback){
	connection.query('DELETE FROM users WHERE id = ?',userId, function (err, response) {
    if (err) {
    	console.log("error deleting user " + userId, err)
    	callback(err, null)
    }else{
	    console.log('Deleted user number ' + userId);
	    callback(null, response);
    }
  });
}


//<h3>Transaction History functions</h3>
//userId and type
//transaction object = {user_id,target_id,type,numberShares,karma}
//type = buy/sell
//userId and target are foreign keys referencing the user schema
// var sampleTransaction = {
// 	user_id: 1,
// 	target_id: 2,
// 	type: "sell",
// 	numberShares: 15,
// 	karma: 44
// }
// addTransaction(sampleTransaction)

var addTransaction = function(transactionObj, callback){
	connection.query('INSERT INTO transactionHist SET ?', transactionObj, function(err, res){
		if(err){
			console.log("error inserting into transactionHist", err)
			callback(err, null)
		} else{
			console.log("last inserted Id: ", res.insertId);
			callback(null, res.insertId)
		}
	})
}

//takes a userId and returns a transaction history for that userId
var getTransactionHist = function(userId, callback){
	connection.query('SELECT * FROM transactionHist where user_id=?', userId, function(err, rows){
		if(err){
			console.log("Error finding transactionHist of user_id :" + userId, err)
			callback(err, null);
		} else{
			// console.log(rows)
			callback(null, rows);
		}
	})
};

var targetTransactionHist = function(targetId, callback) {

	connection.query('SELECT * FROM transactionHist where target_id=?', targetId, function(err, rows) {
		if (err) {
			console.log('Error finding transactionHist with target_id :' + targetId, err);
		} else {
			// console.log("here are the rows with targetId", rows);
			callback(null, rows);
		}
	})
}

//<h3>Score History functions</h3>
//adds a score to the users history
//do not pass a timestamp, mysql will do this for you
//type can be social or social-investment
//other types will be available in the future
//scoreObj example
// var sampleScoreObj = {
// 	user_id: 243,
// 	type: "social-investment",
// 	score: 95
// }
var addScore = function(scoreObj, callback){
	connection.query('INSERT INTO scoresHist SET ?', scoreObj, function(err, res){
		if(err){
			console.log("error inserting into scoresHist", err)
			callback(err, null)
		} else{
			console.log("last inserted Id: ", res.insertId);
			callback(null, res.insertId)
		}
	})
}

//grabs all scores for a target user
var getScores = function(userId, callback){
	connection.query('SELECT * FROM scoresHist where user_id=? ORDER BY ts', userId, function(err, rows){
		if(err){
			console.log("Error finding scoresHist of user_id :" + userId, err)
			callback(err, null);
		} else{
			// console.log(rows)
			callback(null, rows);
		}
	})
}


//<h3>Current Stocks</h3>

// Adds a stock
//example investmentObj
// {
// 	user_id:1,
// 	target_id:2,
// 	numberShares:5
// }
// Adds a stock

var addStock = function(investmentObj, callback) {
	connection.query('INSERT INTO currentStocks SET ?', investmentObj, function(err, res) {
		if (err) {
			console.log("there was an error inserting into currentStocks", err);
		} else {
			console.log("inserting into currentStocks successful");
			callback(null, res.insertId);
		}
	})
}

// Gets all stocks for a specified user
var getStocks = function(userId, callback){
  connection.query('SELECT * FROM currentStocks WHERE user_id=?', [userId], function(err, rows){
    if(err){
      console.log("Error finding userStocks by id :", err)
      callback(err,null);
    } else {
      callback(null,rows);
    }
  })
}

var getTargetStocks = function(targetId, callback) {
	connection.query('SELECT * from currentStocks WHERE target_id=?', [targetId], function(err, rows) {
		if (err) {
			console.log("Error finding stocks with target id :", err);
		} else {
			callback(null, rows);
		}
	})
}

//returns stocks of a target user for a given user
var getStockRow = function(userId, targetId, callback){
  connection.query('SELECT * FROM currentStocks WHERE user_id=? and target_id=?', [userId, targetId], function(err, rows){
    if(err){
      console.log("Error finding user by id :", err)
      callback(err,null);
    } else {
      callback(null,rows);
    }
  })
}

// Updates the stock of a specified user
var updateStock = function(userId, targetId, changeShares, callback) {
	connection.query('UPDATE currentStocks SET numberShares=numberShares +? WHERE target_id=? AND user_id=?', [changeShares, targetId, userId], function(err, result) {
		if (err) {
			console.log("Error updating stock of user", userId);
			callback(err, null)
		} else {
			console.log('Updated stock for user', userId);
			callback(null, userId);
		}
	})
}


// Deletes the stock of a specified user
var deleteStock = function(userId, targetId, callback) {
	connection.query('DELETE FROM currentStocks WHERE target_id=? AND user_id=?', [targetId, userId], function(err, response) {
		if (err) {
			console.log("Error deleting stock of user", userId);
			callback(err, null);
		} else {
			console.log("Deleted stock of user", userId);
			callback(null, userId);
		}
	})
}

module.exports = {
	connection: connection,
	addUser: addUser,
	findUser: findUser,
	findUserById: findUserById,
	updateUser: updateUser,
	updateKarma: updateKarma,
	deleteUser: deleteUser,
	countUsers: countUsers,
	getAllUsers:getAllUsers,
	findUserByFbKey: findUserByFbKey,
	updatePhoto:updatePhoto,

	//transaction methods
	addTransaction:addTransaction,
	getTransactionHist:getTransactionHist,
	targetTransactionHist: targetTransactionHist,

	//score History methods
	addScore: addScore,
	getScores: getScores,

	//Current Stock methods
	getStocks: getStocks,
	getTargetStocks: getTargetStocks,
	addStock: addStock,
	getStocks: getStocks,
	getStockRow: getStockRow,
	updateStock: updateStock,
	deleteStock: deleteStock,
	findUsersByPartial: findUsersByPartial,
}
