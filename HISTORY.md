# 1.5.0
* Added: `Connection#send` as a short hand for `Connection#sendText` or `Connection#sendBinary`, depending on the data type (string or Buffer)

# 1.4.1
* Added: example to README

# 1.4.0
* Added: `extraHeaders` option in `ws.connect(URL, [options], [callback])` to let one add custom headers to the HTTP handshake request

# 1.3.0

* Added: `Connection#sendPing([data=''])`
* Added: `pong(data)` event