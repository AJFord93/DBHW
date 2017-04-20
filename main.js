const mysql = require("mysql"),
inquirer = require("inquirer"),
table = require("console.table");

// create the connection information for the sql database
var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "root",
  database: "agency_contacts"
});

// connect to the mysql server and sql database
connection.connect(function(err) {
  if (err) throw err;
  console.log("Connected: " + connection.threadId);
});

//user prompt for options

let start = function() {
  inquirer.prompt({
    name: "initOptions",
    type: "list",
    message: "What would you like to do?",
    choices: ['View ALL', 'Add Contact', 'Update Contact']
  }).then(function(userInput){
    //based on answer either view, add or update contacts
    switch (userInput.initOptions) {
      case 'View ALL':
      viewContacts();
      break;

      case 'Add Contact':
      addContact();
      break;

      case 'Update Contact':
      updateContact();
      break;
    }
  });
};

start();

let viewContacts = function() {
connection.query("SELECT * FROM models", function(err, res){
  console.table(res);
});
start();
}

//add contact to mySQL Database (Models Table)
let addContact = function(){
  inquirer.prompt([

    {
    name: "first_name",
    type: "input",
    message: "Please ENTER First Name."
  }, {
    name: "last_name",
    type: "input",
    message: "Please ENTER Last Name."
  }, {
    name: "phone",
    type: "input",
    message: "Please ENTER Phone Number (xxx) xxx-xxxx."
  }, {
    name: "email",
    type: "input",
    message: "Please ENTER Email."
  }, {
    name: "current_city",
    type: "input",
    message: "Please ENTER model's current city."
  }
]).then(function(answer) {
  connection.query("INSERT INTO models SET ?", {
    first_name: answer.first_name,
    last_name: answer.last_name,
    phone: answer.phone,
    email: answer.email,
    current_city: answer.current_city
  }, function(err, res) {
    if(err) throw err;
    });
  });

  start();
}; // check semi-colons

let updateContact = function() {
  connection.query("SELECT * FROM models", function(err, results){
    if (err) throw err;
    console.table(results);

  inquirer.prompt([
    {
    name: "selectContact",
    type: "rawlist",
    choices: function(){
      let modelsArray = [];
      for(var i = 0; i < results.length; i++){
        modelsArray.push(results[i].first_name); //Con-cat last name too?
      }
      return modelsArray;
    },
    message: "Select a model to update contact information."
  }


]).then(function(answer){
  let model = answer.selectContact;

  inquirer.prompt([
    {
      name: "fieldSelect",
      type: 'list',
      message: 'Which field would you like to update?',
      choices: ['Phone', 'Email', 'Current City']
      }
  ]).then(function(update){
    //based on answer either view, add or update contacts
    switch (update.fieldSelect) {
      case 'Phone':
      updatePhone();
      break;

      case 'Email':
      updateEmail();
      break;

      case 'Current City':
      updateCity();
      break;
    }
  });
});

// let updatePhone = function() {
//   connection.query("SELECT * FROM models WHERE first_name = " + model)
// }



}) //query close
}; // function close
