'use strict';

const request = require('request');
const functions = require('firebase-functions');
const { dialogflow } = require('actions-on-google');
const app = dialogflow();

function postRequest(options) {
  return new Promise(function (resolve, reject) {
    request.post(options, function (error, res, body) {
      if (!error && res.statusCode == 200) {
        resolve(body);
      } else {
        reject(error);
      }
    });
  });
}

function getRequest(options) {
  return new Promise(function (resolve, reject) {
    request.get(options, function (error, res, body) {
      if (!error && res.statusCode == 200) {
        resolve(body);
      } else {
        reject(error);
      }
    });
  });
}

function getRandomSearch() {
  // A list of all characters that can be chosen.
  const characters = 'abcdefghijklmnopqrstuvwxyz';

  // Gets a random character from the characters string.
  const randomCharacter = characters.charAt(Math.floor(Math.random() * characters.length));
  let randomSearch = '';

  // Places the wildcard character at the beginning, or both beginning and end, randomly.
  switch (Math.round(Math.random())) {
    case 0:
    randomSearch = randomCharacter + '%20';
    break;
    case 1:
    randomSearch = '%20' + randomCharacter + '%20';
    break;
  }

  return randomSearch;
}

app.intent('Default Welcome Intent', async(conv) => {

  console.log('Query:' + conv.query);
  console.log('Response:' + conv.response);
  console.log('Request:' + conv.request.user.locale);

  var trackName, trackArtist, trackPreviewURL, trackOptions;

    /******* SPOTIFY WEB API parameters ********/
    var client_id     = '***********************'; // Your client id
    var client_secret = '***********************'; // Your secret

    // your application requests authorization
    var authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      headers: {
        'Authorization': 'Basic ' + (new Buffer.from(client_id + ':' + client_secret).toString('base64'))
      },
      form: {
        grant_type: 'client_credentials'
      },
      json: true
    };

    // post request and wait for response
    const body = await postRequest(authOptions);

    //random parameters
    const randomOffset = Math.floor(Math.random() * 1000);

    // use the access token in the response to access the Spotify Web API
    var token = body.access_token;
    var q = getRandomSearch();
    var offset = randomOffset;
    var url = 'https://api.spotify.com/v1/search?q=' + q + '&type=track&offset=' + randomOffset;
    console.log(url);

    var options = {
      url: url,
      headers: {
        'Authorization': 'Bearer ' + token
      },
      json: true
    };

    // post request and wait for response
    const body2 = await getRequest(options);

    // check if the response has a preview_url property
    var previews = [];
    body2.tracks.items.forEach((item, i) => {
      if(item.preview_url){
        //console.log(item.preview_url);
        //console.log(i);
        previews.push(i);
      }
    });

    trackOptions = previews.length;
  	const trackIndex = previews[Math.floor(Math.random() * previews.length)];
    trackName = body2.tracks.items[trackIndex].name;
    trackArtist = body2.tracks.items[trackIndex].artists[0].name;
    trackPreviewURL = body2.tracks.items[trackIndex].preview_url;

    console.log(trackName);
    console.log(trackArtist);
    console.log(trackPreviewURL);

  	let ssml;

    // Japanese response
  	if(conv.request.user.locale == "ja-JP"){
      if(trackArtist.includes("&")){
        ssml = '<speak>ドープな20秒手洗いソングを用意しました。 <break time="1"/> ' +
        '<audio clipEnd="20s" src="' + trackPreviewURL + '" />' +
        '今回のトラックは' + trackName + 'でした。ナイス手洗い！</speak>';
      }
      else if(trackName.includes("&")){
        ssml = '<speak>ドープな20秒手洗いソングを用意しました。<break time="1"/> ' +
        '<audio clipEnd="20s" src="' + trackPreviewURL + '" />' +
        '今回は' + trackArtist + 'のトラックでした。ナイス手洗い！</speak>';
      }
      else{
        ssml = '<speak>ドープな20秒手洗いソングを用意しました。<break time="1"/> ' +
        '<audio clipEnd="20s" src="' + trackPreviewURL + '" />' +
        '今回のトラックは' + trackArtist + 'の' + trackName + 'でした。ナイス手洗い！</speak>';
      }
    }
    // English response
  	else{
      if(trackArtist.includes("&")){
        ssml = '<speak>Heres a dope 20 second handwash track. <break time="1"/> ' +
        '<audio clipEnd="20s" src="' + trackPreviewURL + '" />' +
        'That was ' + trackName + '. Nice handwash!</speak>';
      }
      else if(trackName.includes("&")){
        ssml = '<speak>Heres a dope 20 second handwash track. <break time="1"/> ' +
        '<audio clipEnd="20s" src="' + trackPreviewURL + '" />' +
        'That was a track by ' + trackArtist + '. Nice handwash!</speak>';
      }
      else{
        ssml = '<speak>Heres a dope 20 second handwash track. <break time="1"/> ' +
        '<audio clipEnd="20s" src="' + trackPreviewURL + '" />' +
        'That was ' + trackName + ' by ' + trackArtist + '. Nice handwash!</speak>';
      }
    }

   	conv.close(ssml);
});

exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app);
