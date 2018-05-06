// initialize the express application
const express = require("express");
const app = express();



// initialize the Fitbit API client
const FitbitApiClient = require("fitbit-node");
const client = new FitbitApiClient({
	clientId: "22CRKY",
	clientSecret: "e6c33501e57853e02ec3ee39d79bb1cc",
	apiVersion: '1.2' // 1.2 is the default
});
var path = require('path');

// redirect the user to the Fitbit authorization page
app.get("/authorize", (req, res) => {
	// request access to the user's activity, heartrate, location, nutrion, profile, settings, sleep, social, and weight scopes
	res.redirect(client.getAuthorizeUrl('activity heartrate location nutrition profile settings sleep social weight', 'http://localhost:3000/callback'));
});

// handle the callback from the Fitbit authorization flow
app.get("/callback", (req, res) => {
	// exchange the authorization code we just received for an access token
	client.getAccessToken(req.query.code, 'http://localhost:3000/callback').then(result => {
		// use the access token to fetch the user's profile information
		client.get("/profile.json", result.access_token).then(results => {
			res.sendFile(path.join(__dirname + '/index2.html'));

		}).catch(err => {
			res.status(err.status).send(err);
		});
	}).catch(err => {
		res.status(err.status).send(err);
	});
});

app.get("/data", (req, res) => {
	// exchange the authorization code we just received for an access token
	client.getAccessToken(req.query.code, 'http://localhost:3000/callback').then(result => {
		// use the access token to fetch the user's profile information
		client.get("/data.json", result.access_token).then(results => {
			res.sendFile(path.join(__dirname + '/data.json'));

		}).catch(err => {
			res.status(err.status).send(err);
		});
	}).catch(err => {
		res.status(err.status).send(err);
	});
});

// launch the server
app.listen(3000);