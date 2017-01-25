'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const app = express()

app.set('port', (process.env.PORT || 5000))

// Process application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}))

// Process application/json
app.use(bodyParser.json())

// Index route
app.get('/', function (req, res) {
    res.send('Hello world, I am a chat bot')
})

// for Facebook verification
  app.post('/webhook/', function (req, res) {
    var counter = 1;
    let messaging_events = req.body.entry[0].messaging
    for (let i = 0; i < messaging_events.length; i++) {
      let event = req.body.entry[0].messaging[i]
      let sender = event.sender.id

      while (counter == 1) {
      sendTextMessage(sender, "Hi, I'm a clever bot that can handle user input. You can ask me any questions you \
                        have about LemonStand! If you'd rather speak to a human, please email support@lemonstand.com.")
        }
      if (event.message && event.message.text) {
        let text = event.message.text
        if (text === 'Generic') {
            sendGenericMessage(sender)
            continue
        }
        sendTextMessage(sender, "Text received, echo: " + text.substring(0, 200))
      }
      if (event.postback) {
        let text = JSON.stringify(event.postback)
        sendTextMessage(sender, "Postback received: "+text.substring(0, 200), token)
        continue
      }
    }
    res.sendStatus(200)
  })

// Spin up the server
app.listen(app.get('port'), function() {
    console.log('running on port', app.get('port'))
})

const token = "EAAQJ2jYqGnsBANxCZCOYgfa7EvYrmso03e9pnAH9ZAdsXtbuZCCpyaoEjqo8WhfB3FOeuJ7LkbaicZA7qgeWjhkOHtliVr1M2EKo8JuYTuduZCZCOq9LzP2GjZAqK9xpZAs8yhuVkYxy0BSScs6EZBqweyyVFhafMTytWFZBdrvV5jfwZDZD";

function sendTextMessage(sender, text) {
    let messageData = { text:text }
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token:token},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })
}

function sendGenericMessage(sender) {
    let messageData = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": [{
                    "title": "Coffree Theme",
                    "subtitle": "Our most popular subscription theme",
                    "image_url": "https://coffree.lemonstand.com/resources/coffree/img/logo.png?1483671106",
                    "buttons": [{
                        "type": "web_url",
                        "url": "https://coffree.lemonstand.com",
                        "title": "Try it out!"
                    }],
                }, {
                    "title": "Happy Hour",
                    "subtitle": "A beautiful, responsive LemonStand theme",
                    "image_url": "https://d2qq4423n7kgsb.cloudfront.net/store-happyhour-568de3457ff0c/uploaded/thumbnails/12093467_150980121918941_659763134_n%202_56902ba0776c5_autoxauto-jpg-keep-ratio.jpeg?1452288928",
                    "buttons": [{
                        "type": "web_url",
                        "url": "https://happyhour.lemonstand.com",
                        "title": "Try it out!"
                    }],
                }, {
                    "title": "Zest",
                    "subtitle": "Our original LemonStand theme",
                    "image_url": "http://pic.accessify.com/thumbnails/777x423/z/zest.lemonstand.com.png",
                    "buttons": [{
                        "type": "web_url",
                        "url": "https://zest.lemonstand.com",
                        "title": "Try it out!"
                    }],
                }, {
                    "title": "Bones",
                    "subtitle": "A bare bones LemonStand theme, perfect for developers",
                    "image_url": "https://lemonstand.com/resources/ls2-production-website/images/themes/bones.jpg?1436548422",
                    "buttons": [{
                        "type": "web_url",
                        "url": "https://bones.lemonstand.com",
                        "title": "Try it out!"
                    }],
                }]
            }
        }
    }
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token:token},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })
}