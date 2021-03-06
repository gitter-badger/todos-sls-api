"use strict";

var Promise = require("bluebird");
var db = require("../database/dynamodb");

const DB_PREFIX = process.env.IS_OFFLINE ? "dev" : process.env.DB_PREFIX;

const response = (status, data) => {
  return {
    statusCode: status,
    headers: {
      "Access-Control-Allow-Origin": "*"
    },
    body: JSON.stringify(data)
  };
};


module.exports.createTodo = (event, cb) => {
  const data = JSON.parse(event.body);
  db("put", {
    TableName: DB_PREFIX + "-todos",
    Item: {
      id: data.id,
      task: data.task,
      isCompleted: data.isCompleted
    }
  })
  .then(result => {
    cb(null, response(201, {}));
  })
  .catch(err => {
    cb(
      null,
      response(500, {
        err: err
      })
    );
  });
};


module.exports.getAllTodos = (event, cb) => {
  db("scan", {
      TableName: DB_PREFIX + "-todos"
  }).then(todos => {
  cb(
      null,
      response(200, {
        result: todos
      })
    );
  })
  .catch(err => {
    cb(
      null,
      response(500, {
        err: err
      })
    );
  });
};

module.exports.updateTodo = (event, cb) => {
  const data = JSON.parse(event.body);
  db("update", {
    TableName: DB_PREFIX + "-todos",
    Key: {
      id: data.id
    },
    UpdateExpression: "set task = :task",
    ExpressionAttributeValues: {
      ":task": data.task
    }
  })
  .then(result => {
    cb(null, response(200, {}));
  })
  .catch(err => {
    cb(
      null,
      response(500, {
        err: err
      })
    );
  });
};

module.exports.deleteTodo = (event, cb) => {
  const id = event.pathParameters.id;
  db("delete", {
    TableName: DB_PREFIX + "-todos",
    Key: {
      id
    }
  })
  .then(result => {
    cb(null, response(200, {}));
  })
  .catch(err => {
    cb(
      null,
      response(500, {
        err: err
      })
    );
  });
};
