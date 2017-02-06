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
    var counter = 0;
    let messaging_events = req.body.entry[0].messaging
    for (let i = 0; i < messaging_events.length; i++) {
      let event = req.body.entry[0].messaging[i]
      let sender = event.sender.id
      let recipient = event.recipient.id

      if (event.message && event.message.text) {
        let text = event.message.text
        if (text === 'Themes') {
            sendTextMessage(sender, "Here are some of our popular themes! You can check out https://lemonstand.com/themes for more!")
            sendGenericMessage(sender)
            //quickReplies(sender)
            continue
        }
        if (text === 'Pricing') {
            sendTextMessage(sender, "Our plans start at $99/month and include a wide range of features to help excel your online store!")
            sendPricingMessage(sender)
            //quickReplies(sender)
            continue
        }
        if (text === 'Why LemonStand?') {
            sendTextMessage(sender, "LemonStand is a refreshing approach to e-commerce. LemonStand helps web developers, agencies and fast growing brands create beautiful online stores that stand out from the crowd. We don't charge payment transaction fees, and we provide amazing customer support. You have access to all the code for full control of the UI, and there are many beautiful themes to choose from!")
            quickReplies(sender)
            continue
        }
        if (text == 'Professional') {
            sendTextMessage(sender, "The Professional plan is meant for serious small businesses. It starts at $99/month and includes all the basic LemonStand features from cross-platform response themes, to sales analytics and much more!")
            continue
        }
        if (text === 'Growth') {
            sendTextMessage(sender, "The Growth plan starts at $199/month and includes everything the professional plan does, plus the ability to sell subscription products and customer group pricing.")
            continue
        }
        if (text === 'Premium') {
            sendTextMessage(sender, "We reserve the best for the best. Starting at $399/month we provide the best service an e-commerce platform has to offer. This includes everything the Growth plan does, plus dedicated support and higher API limits. Definitely a go to for any medium to large sized business.")
            continue
        }


        sendTextMessage(sender, "Text received, echo: " + text.substring(0, 200))
        
      }
    if (event.postback && event.postback.payload) {
        //let text1 = JSON.stringify(event.postback)
        //var obj1 = JSON.parse(text)
        //console.log(event.postback.payload)
            if (event.postback.payload === 'Professional') {
            sendTextMessage(sender, "The Professional plan is meant for serious small businesses. It starts at $99/month and includes all the basic LemonStand features from cross-platform response themes, to sales analytics and much more!")
            }   
            if (event.postback.payload === 'Growth') {
                sendTextMessage(sender, "The Growth plan starts at $199/month and includes everything the professional plan does, plus the ability to sell subscription products and customer group pricing.")
            }
            if (event.postback.payload === 'Premium') {
                sendTextMessage(sender, "We reserve the best for the best. Starting at $399/month we provide the best service an e-commerce platform has to offer. This includes everything the Growth plan does, plus dedicated support and higher API limits. Definitely a go to for any medium to large sized business.")
            }
            if (event.postback.payload === 'Get Started') {
                var c = 0;
                sendTextMessage(sender, "Hi, welcome to LemonStand 🍋 What can I help you with today?")
                c++;
                if (c === 1) {
                quickReplies(sender)
                }   
            }
            if (event.postback.payload === 'Help') {
                sendTextMessage(sender, "Please email support@lemonstand.com with any questions.")
            }
        //quickReplies(sender)
        }
      // if (event.postback) {
      //   let text = JSON.stringify(event.postback)
      //   var obj = JSON.parse(text)
      //   //sendTextMessage(sender, obj.payload, token)
      //   // Get started triggers postback
      //   quickReplies(sender)
      //   continue
      // }
    }
    res.sendStatus(200)
  })

// Spin up the server
app.listen(app.get('port'), function() {
    console.log('running on port', app.get('port'))
})

const token = "EAAQJ2jYqGnsBANxCZCOYgfa7EvYrmso03e9pnAH9ZAdsXtbuZCCpyaoEjqo8WhfB3FOeuJ7LkbaicZA7qgeWjhkOHtliVr1M2EKo8JuYTuduZCZCOq9LzP2GjZAqK9xpZAs8yhuVkYxy0BSScs6EZBqweyyVFhafMTytWFZBdrvV5jfwZDZD";

function sendTextMessage(sender, text) {
    //quickReplies(sender)
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

function quickReplies(sender) {
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token:token},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: {
    "text":"Ask me a question or pick an option below:",
    "quick_replies":[
      {
        "content_type":"text",
        "title":"Themes",
        "payload":"What themes are available?"
      },
      {
        "content_type":"text",
        "title":"Pricing",
        "payload":"DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_GREEN"
      },
      {
        "content_type":"text",
        "title":"Why LemonStand?",
        "payload":"DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_GREEN"
      }
    ]
  },
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


function sendPricingMessage(sender) {
    let messageData = {
  "attachment":{
      "type":"template",
      "payload":{
        "template_type":"button",
        "text":"Which plan would you like to learn more about?",
        "buttons":[
              {
                "type":"postback",
                "title":"Professional",
                "payload":"Professional"
              },
              {
                "type":"postback",
                "title":"Growth",
                "payload":"Growth"
              },
              {
                "type":"postback",
                "title":"Premium",
                "payload":"Premium"
              }
        ]
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




