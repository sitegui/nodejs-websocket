/*
Simple wrapper for stream.Readable, used for receiving binary data
*/

var util = require("util")
var stream = require("stream")

// Represents the readable stream for binary frames
// Events: readable(), end()
function InStream() {
	this.buffer = new Buffer(0)
	this.ended = false
	stream.Readable.call(this)
}

// Extends the basic readable stream and implement _read
util.inherits(InStream, stream.Readable)
InStream.prototype._read = function (size) {
	if (this.buffer.length) {
		this.push(this.buffer)
		this.buffer = new Buffer(0)
	} else if (this.ended)
		this.push(null)
	else
		this.push("")
}

// Add more data to the stream and fires "readable" event
InStream.prototype.addData = function (data) {
	this.buffer = Buffer.concat([this.buffer, data], this.buffer.length+data.length)
}

// Indicates there is no more data to add to the stream
InStream.prototype.end = function () {
	this.ended = true
}

module.exports = InStream
