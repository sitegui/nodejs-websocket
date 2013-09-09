// Represents a websocket server

// new Server() creates a new ws server and starts listening for new connections
// Events: listening(), close(), error(err), connection(conn)
// secure is a boolean that indicates if it should use tls
// options is an object to be passed to net.createServer() or tls.createServer()
// callback is a function that will be added as "connection" listener
function Server(secure, options, callback) {
	var that = this
	
	if (typeof options == "function") {
		callback = options
		options = undefined
	}
	
	var onConnection = function (socket) {
		var conn = new Connection(socket, that, function () {
			that.connections.push(conn)
			that.emit("connection", conn)
		})
		conn.on("close", function () {
			var pos = that.connections.indexOf(conn)
			if (pos != -1)
				that.connections.splice(pos, 1)
		})
	}
	
	if (secure)
		this.socket = tls.createServer(options, onConnection)
	else
		this.socket = net.createServer(options, onConnection)
	
	this.socket.on("close", function () {
		that.emit("close")
	})
	this.socket.on("error", function (err) {
		that.emit("error", err)
	})
	this.connections = []
	
	// super constructor
	events.EventEmitter.call(this)
	if (callback)
		this.on("connection", callback)
}

module.exports = Server
var util = require("util")
var net = require("net")
var tls = require("tls")
var Connection = require("./Connection.js")
var events = require("events")

// Makes Server also an EventEmitter
util.inherits(Server, events.EventEmitter)

// Starts listening for connections
// callback is a function that will be added as "connection" listener
Server.prototype.listen = function (port, host, callback) {
	var that = this
	
	if (typeof host == "function") {
		callback = host
		host = undefined
	}
	
	if (callback)
		this.on("listening", callback)
		
	this.socket.listen(port, host, function () {
		that.emit("listening")
	})
	
	return this
}
