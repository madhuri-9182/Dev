import React, { useState } from 'react';

const Message = () => {
    const [messages, setMessages] = useState([
        { id: 1, text: "xyg@phonepe.com: There is some issue with this candidate. pratap Rana for SDE-2 Backend." },
        { id: 2, text: "abc@hdip.co.in: We will look into it soon." },
    ]);

    const [newMessage, setNewMessage] = useState("");

    const handleSendMessage = () => {
        if (newMessage.trim()) {
            setMessages([...messages, { id: messages.length + 1, text: newMessage }]);
            setNewMessage("");
        }
    };

    return (
        <div className='p-4 px-6'>
            <div>
                <h2 className="text-lg font-semibold text-black mb-2">Messages:</h2>
            </div>
            <div className="flex flex-col h-[617px] p-6 bg-gradient-to-r from-blue-500 to-blue-300 rounded-lg shadow-lg">
                <div className="flex-1 overflow-y-auto bg-transparent text-white p-4 rounded-lg border border-transparent">
                    {messages.map((message) => (
                        <p key={message.id} className="mb-2">{message.text}</p>
                    ))}
                </div>

            </div>
            <div className="mt-4">
                <label htmlFor="newMessage" className="text-black font-medium">Type Here:</label>
                <div className="flex items-center mt-2  rounded-lg px-4 py-2 bg-[#E7E4E8]">
                    <input
                        id="newMessage"
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type your message..."
                        className="flex-1 outline-none text-black bg-transparent"
                    />
                   
                    <button className='ml-5'>
                        <svg xmlns="http://www.w3.org/2000/svg" height="30px" viewBox="0 -960 960 960" width="30px" fill="#171717"><path d="M696-312q0 89.86-63.07 152.93Q569.86-96 480-96q-91 0-153.5-65.5T264-319v-389q0-65 45.5-110.5T420-864q66 0 111 48t45 115v365q0 40.15-27.93 68.07Q520.15-240 480-240q-41 0-68.5-29.09T384-340v-380h72v384q0 10.4 6.8 17.2 6.8 6.8 17.2 6.8 10.4 0 17.2-6.8 6.8-6.8 6.8-17.2v-372q0-35-24.5-59.5T419.8-792q-35.19 0-59.5 25.5Q336-741 336-706v394q0 60 42 101.5T480-168q60 1 102-43t42-106v-403h72v408Z" /></svg>
                    </button>
                    <button onClick={handleSendMessage} className="ml-3 text-blue-600 hover:text-blue-700">
                        <svg xmlns="http://www.w3.org/2000/svg" height="30px" viewBox="0 -960 960 960" width="30px" fill="#2854C5"><path d="M144-192v-576l720 288-720 288Zm72-107 454-181-454-181v109l216 72-216 72v109Zm0 0v-362 362Z" /></svg>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Message;
