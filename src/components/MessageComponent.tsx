"use client";
import { useState, useEffect } from "react";
import { io } from 'socket.io-client';
import Peer from 'simple-peer';
import { sendMessage, getMessages, getUsernameById, updateMessageSeenAt } from "@/lib/actions";
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
  createdAt: string;
  seenAt?: string;
};

type Props = {
  friends: Friend[];
  userId: string;
};

const socket = io({ path: '/api/socket' });

const MessageComponent = ({ friends, userId }: Props) => {
  const [selectedFriendId, setSelectedFriendId] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [typingUser, setTypingUser] = useState<string | null>(null);
  const [username, setUsername] = useState<string>("");
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [receivingCall, setReceivingCall] = useState(false);
  const [caller, setCaller] = useState("");
  const [callerSignal, setCallerSignal] = useState<any>(null);
  const [callAccepted, setCallAccepted] = useState(false);
  const [peer, setPeer] = useState<Peer.Instance | null>(null);
  const [unreadMessages, setUnreadMessages] = useState<{ [key: string]: boolean }>({});
  const [visibleTimestamp, setVisibleTimestamp] = useState<number | null>(null);

  const selectedFriend = friends.find(friend => friend.following.id === selectedFriendId);
  const selectedFriendUsername = selectedFriend ? selectedFriend.following.username : "";

  useEffect(() => {
    const fetchUsername = async () => {
      const username = await getUsernameById(userId);
      setUsername(username || "");
    };
    fetchUsername();
  }, [userId]);

  useEffect(() => {
    if (selectedFriendId) {
      const fetchMessages = async () => {
        const messages = await getMessages(userId, selectedFriendId);
        const formattedMessages = messages.map(msg => ({
          ...msg,
          createdAt: new Date(msg.createdAt).toISOString(), // Convert Date to string
        }));
        setMessages(formattedMessages);
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
        showNotification(message.sender.username, message.content);
      }
    });
  
    socket.on('typing', (data) => {
      if (data.to === userId && data.from === selectedFriendId) {
        setIsTyping(data.isTyping);
        setTypingUser(data.username); // Set the typing user
      } else {
        setIsTyping(false);
        setTypingUser(null); // Clear typing user
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
  }, [userId, selectedFriendId, peer, username]);
  
  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value);
    const isCurrentlyTyping = e.target.value.length > 0;
    setIsTyping(isCurrentlyTyping);
    setTypingUser(null); // Clear typing user
    socket.emit('typing', { from: userId, isTyping: isCurrentlyTyping, username, to: selectedFriendId }); // Emit typing event with both userId and selectedFriendId
  };
  

  
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
      setIsTyping(false); // Reset typing state
      setTypingUser(null); // Clear typing user
      socket.emit('typing', { userId, isTyping: false, username }); // Notify others that typing has stopped
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  const handleViewMessage = async (msgId: number, senderUsername: string) => {
    if (senderUsername !== username) {
      const seenAt = new Date();
      await updateMessageSeenAt(msgId, seenAt);
      setMessages((prevMessages) => prevMessages.map((msg) =>
        msg.id === msgId ? { ...msg, seenAt: msg.seenAt || seenAt.toISOString() } : msg
      ));
    }
  };



  const callUser = (id: string) => {
    console.log("Calling user:", id); // Add log
    const peer = new Peer({ initiator: true, trickle: false, stream: stream! });
    peer.on('signal', (data) => {
      console.log("Sending signal to user:", id); // Add log
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
    console.log("Answering call from:", caller); // Add log
    setCallAccepted(true);
    const peer = new Peer({ initiator: false, trickle: false, stream: stream! });
    peer.on('signal', (data) => {
      console.log("Sending answer signal to:", caller); // Add log
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

  const toggleTimestamp = (msgId: number) => {
    setVisibleTimestamp(visibleTimestamp === msgId ? null : msgId);
  };

  const showNotification = (title: string, body: string) => {
    if (Notification.permission === "granted") {
      new Notification(title, { body });
    }
  };

  useEffect(() => {
    if (Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  }, []);

  return (
    <div className="flex flex-col md:flex-row">
      <FriendsComponent currentUserId={userId} friends={friends} onStartChat={handleStartChat} unreadMessages={unreadMessages} />
      <div className="w-full md:w-3/4 p-4">
        {selectedFriendId ? (
          <div>
            <h2 className="text-xl font-bold mb-4">Chat with {selectedFriendUsername}</h2>
            <div className="mb-4">
              {messages.map((msg) => (
                <div key={msg.id} className={`mb-2 p-2 rounded ${msg.sender.username === username ? 'bg-blue-300 text-right' : 'bg-gray-200 text-left'}`} onClick={() => { toggleTimestamp(msg.id); }}>
                  <strong className="rounded-full border border-black px-2 py-1 inline-block">
                    {msg.sender.username}
                  </strong>
                  <br />
                  {msg.content}
                  {visibleTimestamp === msg.id && (
                    <div className="text-gray-500 text-sm">
                      Sent at: {new Date(msg.createdAt).toLocaleString()}
                      {msg.seenAt && <div>Seen at: {new Date(msg.seenAt).toLocaleTimeString()}</div>}
                    </div>
                  )}
                </div>
              ))}
                      {isTyping && typingUser === selectedFriendUsername && (
                <div className="text-gray-500">{typingUser} is typing...</div>
              )}
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
            <button onClick={() => callUser(selectedFriendId)} className="mt-2 ml-5 p-2 bg-green-500 text-white">
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
