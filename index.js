"use strict"

var Server = require("./Server.js")
var Connection = require("./Connection.js")
var net = require("net")
var tls = require("tls")
var url = require("url")

// Create a WebSocket server
// options is an object to be passed to net.createServer() or tls.createServer(), with the additional property "secure" (a boolean)
// callback will be added as "connection" listener
exports.createServer = function (options, callback) {
	if (typeof options == "function" || !arguments.length)
		return new Server(false, options)
	return new Server(Boolean(options.secure), options, callback)
}

// Create a WebSocket client
// URL is a string with the format "ws://localhost:8000/chat" (the port can be ommited)
// options is an object that will be passed to net.connect() or tls.connect()
// callback will be added as "connect" listener
exports.connect = function (URL, options, callback) {
	var socket
	
	if (typeof options == "function") {
		callback = options
		options = undefined
	}
	options = options || {}
	
	URL = parseWSURL(URL)
	options.port = URL.port
	options.host = URL.host
	if (URL.secure)
		socket = tls.connect(options)
	else
		socket = net.connect(options)
	
	return new Connection(socket, URL, callback)
}

// Set the minimum size of a pack of binary data to send in a single frame
exports.setBinaryFragmentation = function (bytes) {
	Connection.binaryFragmentation = bytes
}

// Set the maximum size the internal Buffer can grow, to avoid memory attacks
exports.setMaxBufferLength = function (bytes) {
	Connection.maxBufferLength = bytes
}

// Parse the WebSocket URL
function parseWSURL(URL) {
	var parts, secure
	
	parts = url.parse(URL)
	
	parts.protocol = parts.protocol || "ws:"
	if (parts.protocol == "ws:")
		secure = false
	else if (parts.protocol == "wss:")
		secure = true
	else
		throw new Error("Invalid protocol "+parts.protocol+". It must be ws or wss")
	
	parts.port = parts.port || (secure ? 443 : 80)
	parts.path = parts.path || "/"
	
	return {path: parts.path, port: parts.port, secure: secure, host: parts.hostname}
}
