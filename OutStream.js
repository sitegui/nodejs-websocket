/*
Simple wrapper for stream.Writable, used for sending binary data
*/

var util = require("util")
var stream = require("stream")
var frame = require("./frame.js")

// Represents the writable stream for binary frames
// Events: 
function OutStream(connection, minSize) {
	var that = this
	this.connection = connection
	this.minSize = minSize
	this.buffer = new Buffer(0)
	this.hasSent = false // Indicates if any frame has been sent yet
	stream.Writable.call(this)
	this.on("finish", function () {
		if (that.connection.readyState == that.connection.OPEN)
			// Ignore if not connected anymore
			that.connection.socket.write(frame.createBinaryFrame(that.buffer, !that.connection.server, !that.hasSent, true))
		that.connection.outStream = null
	})
}

// Extends the basic writable stream and implements _write
util.inherits(OutStream, stream.Writable)
OutStream.prototype._write = function (chunk, encoding, callback) {
	var frameBuffer
	this.buffer = Buffer.concat([this.buffer, chunk], this.buffer.length+chunk.length)
	if (this.buffer.length >= this.minSize) {
		if (this.connection.readyState == this.connection.OPEN) {
			// Ignore if not connected anymore
			frameBuffer = frame.createBinaryFrame(this.buffer, !this.connection.server, !this.hasSent, false)
			this.connection.socket.write(frameBuffer, encoding, callback)
		}
		this.buffer = new Buffer(0)
		this.hasSent = true
		if (this.connection.readyState != this.connection.OPEN)
			callback()
	} else
		callback()
}

module.exports = OutStream
