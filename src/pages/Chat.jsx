import { useState, useEffect, useRef } from 'react';
import { Search, MoreHorizontal, Send, Paperclip, UserPlus, Bell, Settings, Smile, FileText, Image, Calendar, Clock, Plus } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Chat() {
    const [channels, setChannels] = useState([]);
    const [activeChannel, setActiveChannel] = useState(null);
    const [messages, setMessages] = useState([]);
    const [messageInput, setMessageInput] = useState('');
    const [loading, setLoading] = useState(true);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // 模拟API请求
                const channelsData = [
                    { id: 1, name: 'General', type: 'channel', members: 16, unread: 3 },
                    { id: 2, name: 'TaskFlow Project', type: 'channel', members: 8, unread: 0 },
                    { id: 3, name: 'Design Team', type: 'channel', members: 5, unread: 1 },
                    { id: 4, name: 'Backend Development', type: 'channel', members: 7, unread: 0 },
                    { id: 5, name: 'Alex Chen', type: 'direct', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex', unread: 2 },
                    { id: 6, name: 'Sarah Johnson', type: 'direct', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah', unread: 0 },
                ];

                const messagesData = [
                    { id: 1, sender: 'Alex Chen', content: '大家好，我已经完成了前端页面的设计稿，大家可以在Figma上查看。', timestamp: '10:30 AM', senderAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex' },
                    { id: 2, sender: 'Sarah Johnson', content: '设计稿看起来很棒！我已经开始后端API的开发了。', timestamp: '10:45 AM', senderAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah' },
                    { id: 3, sender: 'Kyle Wong', content: '太好了！我们计划在下周进行第一次测试。', timestamp: '11:00 AM', senderAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Kyle' },
                    { id: 4, sender: 'Alex Chen', content: '收到，我会确保前端在测试前完成。', timestamp: '11:05 AM', senderAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex' },
                ];

                setChannels(channelsData);
                setActiveChannel(channelsData[0]);
                setMessages(messagesData);
            } catch (error) {
                console.error('Failed to fetch chat data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const sendMessage = () => {
        if (messageInput.trim()) {
            const newMessage = {
                id: messages.length + 1,
                sender: 'Kyle Wong',
                content: messageInput,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                senderAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Kyle'
            };
            setMessages([...messages, newMessage]);
            setMessageInput('');
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-white text-xl font-bold animate-pulse">Loading Chat...</div>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col font-inter">
            <div className="grid grid-cols-12 h-full gap-0">
                {/* 左侧频道列表 */}
                <div className="col-span-3 border-r border-white/5 flex flex-col">
                    <div className="p-6 border-b border-white/5">
                        <div className="relative group mb-6">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4 group-focus-within:text-primary-400 transition-colors" />
                            <input
                                type="text"
                                placeholder="Search channels..."
                                className="input-search"
                            />
                        </div>
                        <button className="w-full btn-primary">
                            <Plus className="w-4 h-4" />
                            <span>New Channel</span>
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto py-4">
                        {/* 频道分类 */}
                        <div className="px-6 mb-4">
                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Channels</p>
                            <div className="space-y-1">
                                {channels.filter(c => c.type === 'channel').map((channel) => (
                                    <motion.button
                                        key={channel.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-left transition-all ${activeChannel?.id === channel.id ? 'bg-primary-500/20 text-primary-400' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
                                        onClick={() => setActiveChannel(channel)}
                                    >
                                        <span className="font-medium">{channel.name}</span>
                                        {channel.unread > 0 && (
                                            <span className="bg-primary-500 text-white text-xs font-bold px-2 py-1 rounded-full">{channel.unread}</span>
                                        )}
                                    </motion.button>
                                ))}
                            </div>
                        </div>

                        {/* 私聊列表 */}
                        <div className="px-6">
                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Direct Messages</p>
                            <div className="space-y-1">
                                {channels.filter(c => c.type === 'direct').map((channel) => (
                                    <motion.button
                                        key={channel.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.1 }}
                                        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-left transition-all ${activeChannel?.id === channel.id ? 'bg-primary-500/20 text-primary-400' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
                                        onClick={() => setActiveChannel(channel)}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-xl overflow-hidden bg-slate-800">
                                                <img src={channel.avatar} alt={channel.name} className="w-full h-full object-cover" />
                                            </div>
                                            <span className="font-medium">{channel.name}</span>
                                        </div>
                                        {channel.unread > 0 && (
                                            <span className="bg-primary-500 text-white text-xs font-bold px-2 py-1 rounded-full">{channel.unread}</span>
                                        )}
                                    </motion.button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="p-6 border-t border-white/5">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-800">
                                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Kyle" alt="Your Avatar" className="w-full h-full object-cover" />
                            </div>
                            <div>
                                <p className="text-white font-semibold text-sm">Kyle Wong</p>
                                <p className="text-xs text-slate-500">Online</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 右侧聊天区域 */}
                <div className="col-span-9 flex flex-col">
                    {/* 聊天头部 */}
                    <div className="p-6 border-b border-white/5 flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-bold text-white">{activeChannel?.name || 'Select a channel'}</h2>
                            <p className="text-slate-500 text-sm">{activeChannel?.members || 0} members</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <button className="icon-btn">
                                <Bell className="w-5 h-5" />
                            </button>
                            <button className="icon-btn">
                                <UserPlus className="w-5 h-5" />
                            </button>
                            <button className="icon-btn">
                                <Settings className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* 聊天消息区域 */}
                    <div className="flex-1 overflow-y-auto p-6">
                        {activeChannel ? (
                            <div className="space-y-6">
                                {messages.map((message) => {
                                    const isMe = message.sender === 'Kyle Wong';
                                    return (
                                        <motion.div
                                            key={message.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                                        >
                                            {!isMe && (
                                                <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-800 flex-shrink-0 mr-3">
                                                    <img src={message.senderAvatar} alt={message.sender} className="w-full h-full object-cover" />
                                                </div>
                                            )}
                                            <div className={`max-w-[70%] ${isMe ? 'items-end' : 'items-start'} flex flex-col`}>
                                                {!isMe && (
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className="text-white font-semibold text-sm">{message.sender}</span>
                                                        <span className="text-slate-500 text-xs">{message.timestamp}</span>
                                                    </div>
                                                )}
                                                <div className={`px-4 py-3 rounded-xl ${isMe ? 'bg-primary-500 text-white' : 'bg-white/5 text-slate-300'}`}>
                                                    <p className="text-sm leading-relaxed">{message.content}</p>
                                                </div>
                                                {isMe && (
                                                    <span className="text-slate-500 text-xs mt-1">{message.timestamp}</span>
                                                )}
                                            </div>
                                        </motion.div>
                                    );
                                })}
                                <div ref={messagesEndRef} />
                            </div>
                        ) : (
                            <div className="flex items-center justify-center h-full">
                                <div className="text-center">
                                    <Send className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                                    <h3 className="text-xl font-bold text-white mb-2">Select a channel to start chatting</h3>
                                    <p className="text-slate-500">Choose from existing channels or create a new one</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* 聊天输入区域 */}
                    <div className="p-6 border-t border-white/5">
                        <div className="relative">
                            <div className="flex items-center gap-3 mb-3">
                                <button className="p-2 text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-white/5">
                                    <Paperclip className="w-4 h-4" />
                                </button>
                                <button className="p-2 text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-white/5">
                                    <Image className="w-4 h-4" />
                                </button>
                                <button className="p-2 text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-white/5">
                                    <FileText className="w-4 h-4" />
                                </button>
                                <button className="p-2 text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-white/5">
                                    <Calendar className="w-4 h-4" />
                                </button>
                                <button className="p-2 text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-white/5">
                                    <Smile className="w-4 h-4" />
                                </button>
                            </div>
                            
                            <div className="flex items-center gap-3">
                                <div className="flex-1">
                                    <input
                                        type="text"
                                        placeholder="Type a message..."
                                        className="w-full bg-white/5 border border-white/5 rounded-xl p-4 text-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500/30"
                                        value={messageInput}
                                        onChange={(e) => setMessageInput(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                                    />
                                </div>
                                <button 
                                    className="btn-primary"
                                    onClick={sendMessage}
                                >
                                    <Send className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}