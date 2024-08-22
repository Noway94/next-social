"use client";

import { useState, useEffect } from "react";
import { io } from 'socket.io-client';
import Peer from 'simple-peer'; // Import Peer
import { sendMessage, getMessages } from "@/lib/actions";
import FriendsComponent from "@/components/FriendsComponent";

type Friend = {
  following: {
    id: string;
    username: string;
    avatar: string | null;
  };
};

type Message = {
  id: number;
  content: string;
  sender: {
    username: string;
  };
};

type Props = {
  friends: Friend[];
  userId: string;
};

const socket = io({ path: '/api/socket' }); // Initialize the socket outside the component

const MessageComponent = ({ friends, userId }: Props) => {
  const [selectedFriendId, setSelectedFriendId] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [receivingCall, setReceivingCall] = useState(false);
  const [caller, setCaller] = useState("");
  const [callerSignal, setCallerSignal] = useState<any>(null);
  const [callAccepted, setCallAccepted] = useState(false);
  const [peer, setPeer] = useState<Peer.Instance | null>(null);
  const [unreadMessages, setUnreadMessages] = useState<{ [key: string]: boolean }>({});

  const selectedFriend = friends.find(friend => friend.following.id === selectedFriendId);
  const selectedFriendUsername = selectedFriend ? selectedFriend.following.username : "";

  useEffect(() => {
    if (selectedFriendId) {
      const fetchMessages = async () => {
        const messages = await getMessages(userId, selectedFriendId);
        setMessages(messages);
        setUnreadMessages((prevUnread) => ({
          ...prevUnread,
          [selectedFriendUsername]: false,
        }));
      };

      fetchMessages();
    }
  }, [selectedFriendId, userId, selectedFriendUsername]);

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      setStream(stream);
    });

    socket.on('receiveMessage', (message) => {
      if (message.sender.username !== userId) {
        setMessages((prevMessages) => [...prevMessages, message]);
        setUnreadMessages((prevUnread) => ({
          ...prevUnread,
          [message.sender.username]: true,
        }));
      }
    });

    socket.on('typing', (data) => {
      if (data.userId === selectedFriendId) {
        setIsTyping(data.isTyping);
      }
    });

    socket.on('callUser', (data) => {
      setReceivingCall(true);
      setCaller(data.from);
      setCallerSignal(data.signal);
    });

    socket.on('callAccepted', (signal) => {
      setCallAccepted(true);
      peer?.signal(signal);
    });

    return () => {
      socket.off('receiveMessage');
      socket.off('typing');
      socket.off('callUser');
      socket.off('callAccepted');
    };
  }, [userId, selectedFriendId, peer]);

  const handleStartChat = (friendId: string) => {
    setSelectedFriendId(friendId);
    setMessages([]);
    setUnreadMessages((prevUnread) => ({
      ...prevUnread,
      [friendId]: false,
    }));
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      const message = await sendMessage(selectedFriendId, newMessage);
      socket.emit('sendMessage', message);
      setNewMessage("");
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value);
    socket.emit('typing', { userId, isTyping: e.target.value.length > 0 });
  };

  const callUser = (id: string) => {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: stream!,
    });

    peer.on('signal', (data) => {
      socket.emit('callUser', { userToCall: id, signal: data, from: userId });
    });

    peer.on('stream', (stream) => {
      const audio = document.createElement('audio');
      audio.srcObject = stream;
      audio.play();
    });

    setPeer(peer);
  };

  const answerCall = () => {
    setCallAccepted(true);
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: stream!,
    });

    peer.on('signal', (data) => {
      socket.emit('answerCall', { signal: data, to: caller });
    });

    peer.on('stream', (stream) => {
      const audio = document.createElement('audio');
      audio.srcObject = stream;
      audio.play();
    });

    peer.signal(callerSignal);
    setPeer(peer);
  };

  return (
    <div className="flex flex-col md:flex-row">
      <FriendsComponent
        currentUserId={userId}
        friends={friends}
        onStartChat={handleStartChat}
        unreadMessages={unreadMessages} // Pass unreadMessages as a prop
      />
      <div className="w-full md:w-3/4 p-4">
        {selectedFriendId ? (
          <div>
            <h2 className="text-xl font-bold mb-4">Chat with {selectedFriendUsername}</h2>
            <div className="mb-4">
              {messages.map((msg) => (
                <div key={msg.id} className="mb-2">
                  <strong>{msg.sender.username}:</strong> {msg.content}
                </div>
              ))}
              {isTyping && <div className="text-gray-500"> is typing...</div>}
            </div>
            <input
              type="text"
              value={newMessage}
              onChange={handleTyping}
              placeholder="Type a message"
              className="border p-2 w-full"
            />
            <button onClick={handleSendMessage} className="mt-2 p-2 bg-blue-500 text-white">
              Send
            </button>
            <button onClick={() => callUser(selectedFriendId)} className="mt-2 p-2 bg-green-500 text-white">
              Call
            </button>
            {receivingCall && !callAccepted && (
              <div>
                <h1>{caller} is calling...</h1>
                <button onClick={answerCall} className="mt-2 p-2 bg-blue-500 text-white">
                  Answer
                </button>
              </div>
            )}
          </div>
        ) : (
          <p>Select a friend to start chatting</p>
        )}
      </div>
    </div>
  );
};

export default MessageComponent;
