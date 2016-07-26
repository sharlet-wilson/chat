var mongoose = require('mongoose');
var Message= mongoose.model('Message');
module.exports= function(io,sockets){
	io.on('connection', function(socket){
	  socket.on('userjoin',function(sender, receiver){
	    sockets.push({id:socket.id, sender:sender, receiver:receiver});
	  });
	  socket.on('chatMessage',function(sender, message, receiver){
	    var msg = new Message();
	    msg.content = message;
	    msg.from = sender;
	    msg.to = receiver; 
	    msg.save(function(err){
	      if(err) console.log(err);
	    });
	    for (var i = 0; i < sockets.length; i++) {
	      if((sockets[i].sender==sender && sockets[i].receiver==receiver)||(sockets[i].sender==receiver && sockets[i].receiver==sender))
	        socket.broadcast.to(sockets[i].id).emit( 'chatMessage', sender, message, receiver);
	    }
	  });
	  socket.on('disconnect',function(){
	    var sender, receiver;
	    for (var i = 0; i < sockets.length; i++) {
	      if(sockets[i].id == socket.id)
	      {
	        sender=sockets[i].sender;
	        receiver=sockets[i].receiver;
	        sockets.splice(i,1);
	        break;
	      }
	    }
	  });
	  socket.on('logout',function(){
	    var sender, receiver;
	    for (var i = 0; i < sockets.length; i++) {
	      if(sockets[i].id == socket.id)
	      {
	        sender=sockets[i].sender;
	        receiver=sockets[i].receiver;
	        break;
	      }
	    }
	    for (var i = 0; i < sockets.length; i++){
	      if(sockets[i].sender==sender)
	        socket.broadcast.to(sockets[i].id).emit('sessionEnd');
	    }
	  });
	});
}