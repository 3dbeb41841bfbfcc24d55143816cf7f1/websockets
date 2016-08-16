---
title: Websockets with socket.io
type: lesson
duration: "1:30"
creator:
    name: Gerry Mathe/LDN
    updated: Marc Wright/ATL
    updated: Mike Hopper/ATL
competencies: Server Applications
---

# Websockets with socket.io

### Objectives
*After this lesson, students will be able to:*

- Describe what realtime means, and how channels & open sockets push data to clients
- Set up websockets on the server side
- Use jQuery to update the client side

### Preparation
*Before this lesson, students should already be able to:*

- Create an Express app
- Write jQuery that updates the DOM

## Web basics recap - Intro (10 mins)

Typically a Web server is waiting for clients (browsers) to make requests. Once a request is received the server processes the request and send a response to the browser that initiated the request.

But what if the server has some new information that it wants to send the clients? How can the server notify the clients of the new data?

One strategy is that each client can _poll_ the server to see if it has any new data. There are two main types of polling:

1. Short polling (AJAX based timer):

```javascript
function doShortPoll(){
    $.post('ajax/test.html', function(data) {
        alert(data);  // process results here
        setTimeout(doPoll,5000);
    });
}
```

2. Long polling. This method opens connection with the server, and the server notifies the client(s) when new data is available:

```javascript
function doLongPoll(){
    $.ajax({ url: "server", success: function(data){
        //Update your dashboard gauge
        salesGauge.setValue(data.value);
    }, dataType: "json", complete: poll, timeout: 30000 });
}
```

Many different types of applications could use these polling techniques. For example, a chatroom in an app that helps you attain highly desirable concert tickets by polling a ticket distributor so you can be notified first when tickets are available.

## What are the issues with polling?

It's _slow_! Polling every `n` seconds isn't efficient, and if you poll too often, your bandwidth will go through the roof and slow down your server.

## Enter Websockets

_WebSockets_ solves this by maintaining an open connection between the Server and the Client(s) so that the server can _push_ information to the client instantly (as soon as the data is available). Think of it like push notifications on your phone. This _push_ functionality is made possible by the fact that a WebSocket is event-based, meaning a specific event can occur or be either generated (emitted) or received (listened for) by either the server or the client.

The concept behind these event emitters and event listeners is similar to the DOM event emitters/handlers you're familiar with, but instead of listening for an `onClick` to handle, you can be listening for a _message_ event coming from the server via a socket and handle it by putting it into the client's view (via a DOM update).

Unlike HTTP requests, once a connection is established with websockets, you don't get continuous meta data like types, user-agents, cookies, dates, etc.

