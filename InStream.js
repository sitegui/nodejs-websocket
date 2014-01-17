"use strict"

// Simple wrapper for stream.Readable, used for receiving binary data

// Represents the readable stream for binary frames
// Events: readable(), end()
function InStream() {
	stream.Readable.call(this)
}

module.exports = InStream
var util = require("util")
var stream = require("stream")

// Extends the basic readable stream and implement _read
util.inherits(InStream, stream.Readable)
InStream.prototype._read = function () {}

// Add more data to the stream and fires "readable" event
InStream.prototype.addData = function (data) {
	this.push(data)
}

// Indicates there is no more data to add to the stream
InStream.prototype.end = function () {
	this.push(null)
}
