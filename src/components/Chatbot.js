import React, { useState, useRef, useEffect } from 'react';
import { Send, Upload, Loader2, History } from 'lucide-react';
import axios from 'axios';

const Chatbot = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const chatEndRef = useRef(null);

    const handleSend = async (e) => {
        e.preventDefault();
        if (input.trim() === '') return;

        setMessages([...messages, { text: input, isUser: true }]);
        setInput('');
        setIsLoading(true);

        try {
            const response = await axios.get(`http://localhost:8000/query?user_query=${encodeURIComponent(input)}`);
            setMessages(prev => [...prev, { text: response.data.response, isUser: false }]);
        } catch (error) {
            console.error('Error:', error);
            setMessages(prev => [...prev, { text: 'Sorry, an error occurred.', isUser: false }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        setIsLoading(true);
        try {
            const response = await axios.post('http://localhost:8000/upload_document', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setMessages(prev => [...prev, { text: `File "${response.data.filename}" uploaded successfully!`, isUser: false }]);
        } catch (error) {
            console.error('Error:', error);
            setMessages(prev => [...prev, { text: 'Sorry, an error occurred during file upload.', isUser: false }]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    return (
        <div className="flex flex-col h-screen bg-white text-black">
            <header className="flex justify-between items-center p-4 bg-black text-white">
                <h1 className="text-2xl font-bold">Document Chatbot</h1>
                <button
                    className="p-2 rounded-full hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400"
                    aria-label="View History"
                >
                    <History className="w-6 h-6" />
                </button>
            </header>
            <div className="flex-1 p-4 overflow-y-auto">
                {messages.map((message, index) => (
                    <div
                        key={index}
                        className={`mb-4 ${message.isUser ? 'text-right' : 'text-left'}`}
                    >
                        <div
                            className={`inline-block p-3 rounded-lg ${
                                message.isUser
                                    ? 'bg-black text-white'
                                    : 'bg-gray-100 text-black border border-gray-300'
                            }`}
                        >
                            {message.text}
                        </div>
                    </div>
                ))}
                <div ref={chatEndRef} />
            </div>
            <div className="p-4 bg-gray-100 border-t border-gray-300">
                <form onSubmit={handleSend} className="flex items-center space-x-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask a question..."
                        className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                    />
                    <button
                        type="submit"
                        className="p-2 text-white bg-black rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400"
                        aria-label="Send message"
                    >
                        <Send className="w-5 h-5" />
                    </button>
                    <label className="p-2 text-black bg-white rounded-lg cursor-pointer hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400 border border-gray-300">
                        <Upload className="w-5 h-5" />
                        <input
                            type="file"
                            onChange={handleFileUpload}
                            className="hidden"
                            aria-label="Upload document"
                        />
                    </label>
                </form>
            </div>
            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <Loader2 className="w-10 h-10 text-white animate-spin" />
                </div>
            )}
        </div>
    );
};

export default Chatbot;
