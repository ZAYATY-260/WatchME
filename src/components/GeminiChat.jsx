import { useState } from "react";
import { Bot } from "lucide-react";
import { sendToGemini } from "../api/geminiChat";

export default function GeminiChat() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const reply = await sendToGemini(input);
      setMessages((prev) => [...prev, { sender: "gemini", text: reply }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { sender: "gemini", text: "⚠️ Gemini failed. Try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* FAB button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-50 bg-red-600 hover:bg-red-700 text-white p-4 rounded-full shadow-lg"
      >
        <Bot className="w-6 h-6" />
      </button>

      {/* Chat box */}
      {open && (
        <div className="fixed bottom-24 right-6 w-80 bg-white text-black p-4 rounded-lg shadow-xl z-50 border border-gray-300 flex flex-col max-h-[70vh] overflow-hidden">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-bold text-lg">💬 Gemini Chat</h3>
            <button onClick={() => setOpen(false)} className="text-red-600 text-xl font-bold">
              &times;
            </button>
          </div>

          <div className="flex-1 overflow-y-auto mb-3 pr-1 space-y-2">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`px-3 py-2 rounded-lg text-sm ${
                  msg.sender === "user"
                    ? "bg-red-600 text-white self-end ml-auto"
                    : "bg-gray-100 text-black self-start"
                }`}
              >
                {msg.text}
              </div>
            ))}
            {loading && <div className="text-gray-400 text-sm">Gemini is thinking...</div>}
          </div>

          <form onSubmit={handleSend} className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything..."
              className="flex-1 px-3 py-2 text-sm border rounded border-gray-300 focus:outline-none"
            />
            <button
              type="submit"
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm font-semibold"
            >
              Send
            </button>
          </form>
        </div>
      )}
    </>
  );
}
