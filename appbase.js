var request = require('request')
var JSONStream = require('JSONStream')

var newStreamDocumentService = require('./get.js')
var newStreamSearchService = require('./search.js')

var appbase = {}

appbase.newClient = function newClient(args) {
	var url = args.url
	var username = args.username
	var password = args.password
	var appname = args.appname

	var client = {}

	if(url.slice(-1) === "/") {
		url = url.slice(0, -1)
	}

	client.performStreamingRequest = function performStreamingRequest(args) {
		var method = args.method
		var path = args.path
		var params = args.params
		var body = args.body
		if(!body || typeof body !== 'object') {
			body = {}
		}

		return request({
			method: method,
			url: url + '/' + appname + '/' + path,
			qs: params,
			body: JSON.stringify(body),
			auth: {
				user: username,
				pass: password
			}
		}).pipe(JSONStream.parse())
	}

	client.streamDocument = function streamDocument(args) {
		return newStreamDocumentService(client, args)
	}

	client.streamSearch = function streamSearch(args) {
		return newStreamSearchService(client, args)
	}

	return client
}

module.exports = appbase