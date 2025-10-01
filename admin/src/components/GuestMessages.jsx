import { useEffect, useState } from "react";

const GuestMessages = () => {
  const [messages, setMessages] = useState();

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/contact`);
        const messages = await response.json();
        setMessages(messages);
      } catch (error) {
        console.error(error);
      }
    };
    fetchMessages();
  }, []);

  return (
    <div className="max-w-4xl mx-auto">
      {Array.isArray(messages) &&
        messages.map((message) => (
          <div>
            <p>{message.name}</p>
            <p>{message.email}</p>
            <p>{message.message}</p>
          </div>
        ))}
    </div>
  );
};

export default GuestMessages;
