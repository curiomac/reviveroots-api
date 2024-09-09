import { useEffect, useRef } from "react";

export const useSocket = ({ url, onMessage, onError, retryInterval = 5000, heartbeatInterval = 30000 }) => {
  const socketRef = useRef(null);
  const reconnectInterval = useRef(null);
  const heartbeatIntervalRef = useRef(null);

  const connectSocket = () => {
    socketRef.current = new WebSocket(url);
    console.log("WebSocket connection opening - in progress", socketRef.current);
    console.log('WebSocket connection on init:', socketRef.current.readyState);
    socketRef.current.onopen = () => {
      console.log("WebSocket connection opened");
      startHeartbeat();
      if (reconnectInterval.current) {
        clearInterval(reconnectInterval.current);
        reconnectInterval.current = null;
      }
      console.log("ReadyState after opening:", socketRef.current.readyState);
    };

    socketRef.current.onmessage = (event) => {
      console.log("WebSocket on message - in progress", event?.data);
      if (event?.data === "pong") {
        console.log("Received pong from server")
        return;
      }
      if (onMessage) {
        onMessage(event);
      }
    };
      
    socketRef.current.onerror = (error) => {
      console.error("WebSocket error encountered:", error);
      if (onError) {
        onError(error);
      }
    };
    
    socketRef.current.onclose = (event) => {
      console.log("WebSocket connection closed. Code:", event.code, "Reason:", event.reason, "Clean close:", event.wasClean);
      stopHeartbeat();
      attemptReconnect();
    };
  };

  const attemptReconnect = () => {
    if (!reconnectInterval.current) {
      console.log(`Attempting to reconnect in ${retryInterval / 1000} seconds...`);
      reconnectInterval.current = setInterval(() => {
        connectSocket();
      }, retryInterval);
    }
  };

  const startHeartbeat = () => {
    heartbeatIntervalRef.current = setInterval(() => {
      if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
        socketRef.current.send(JSON.stringify({ type: "ping" }));
        console.log("Sent ping to server");
      }
    }, heartbeatInterval);
  };

  const stopHeartbeat = () => {
    if (heartbeatIntervalRef.current) {
      clearInterval(heartbeatIntervalRef.current);
      heartbeatIntervalRef.current = null;
    }
  };

  const onSend = (message) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(message));
    } else {
      console.warn("WebSocket is not open. Cannot send message.");
    }
  };

  useEffect(() => {
    connectSocket(); // Establish the initial connection

    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
      if (reconnectInterval.current) {
        clearInterval(reconnectInterval.current);
      }
      stopHeartbeat(); // Clean up heartbeat interval on component unmount
    };
  }, [url, onMessage, onError]); // Dependencies to ensure the hook runs correctly

  return { onSend };
};

