import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import GlassCard from '../../components/GlassCard';
import ScrollReveal from '../../components/ScrollReveal';

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  status: 'unread' | 'read';
  created_at: string;
}

export default function MessagesList() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [statusFilter, setStatusFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [copied, setCopied] = useState(false);

  const fetchMessages = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const { data, error } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMessages(data || []);
    } catch (err) {
      console.error('Error fetching contact messages:', err);
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  useEffect(() => {
    const channel = supabase
      .channel('admin-messages-realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'contact_messages'
        },
        () => {
          fetchMessages(true);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleOpenMessage = async (msg: ContactMessage) => {
    setSelectedMessage(msg);
    setCopied(false);

    if (msg.status === 'unread') {
      // Optimistic update
      setMessages((prev) =>
        prev.map((m) => (m.id === msg.id ? { ...m, status: 'read' } : m))
      );

      try {
        const { error } = await supabase
          .from('contact_messages')
          .update({ status: 'read' })
          .eq('id', msg.id);

        if (error) {
          console.error('Error marking message as read:', error);
          fetchMessages(true);
        }
      } catch (err) {
        console.error('Error marking message as read:', err);
      }
    }
  };

  const copyEmailToClipboard = (email: string) => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const filteredMessages = messages.filter((m) => {
    if (statusFilter === 'unread') return m.status === 'unread';
    if (statusFilter === 'read') return m.status === 'read';
    return true;
  });

  const unreadCount = messages.filter((m) => m.status === 'unread').length;

  return (
    <div className="space-y-8 text-left pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            Contact Messages
            {unreadCount > 0 && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                {unreadCount} Unread
              </span>
            )}
          </h1>
          <p className="text-slate-400 mt-1">
            Review inquiries submitted from the website contact form.
          </p>
        </div>

        {/* Filter */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 uppercase font-semibold">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="bg-slate-950 border border-slate-800 text-xs text-white rounded-lg px-3 py-2 focus:outline-none focus:border-primary"
          >
            <option value="all">All Messages ({messages.length})</option>
            <option value="unread">Unread ({unreadCount})</option>
            <option value="read">Read ({messages.length - unreadCount})</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Message List */}
          <div className={`${selectedMessage ? 'lg:col-span-6' : 'lg:col-span-12'} space-y-3 transition-all duration-300`}>
            {filteredMessages.length === 0 ? (
              <GlassCard className="p-8 text-center text-slate-500" hoverEffect={false}>
                No messages match the current filter.
              </GlassCard>
            ) : (
              filteredMessages.map((msg) => {
                const isSelected = selectedMessage?.id === msg.id;
                const isUnread = msg.status === 'unread';

                return (
                  <GlassCard
                    key={msg.id}
                    onClick={() => handleOpenMessage(msg)}
                    className={`p-4 cursor-pointer border transition-all duration-200 ${
                      isSelected
                        ? 'border-cyan-500/50 bg-slate-900/60 shadow-lg shadow-cyan-500/5'
                        : isUnread
                        ? 'border-cyan-500/30 bg-slate-900/40 hover:border-cyan-500/50 font-medium'
                        : 'border-white/5 bg-slate-900/10 hover:border-slate-700 opacity-80 hover:opacity-100'
                    }`}
                    hoverEffect={false}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2.5 min-w-0">
                        {/* Status Indicator Badge */}
                        <span
                          className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${
                            isUnread ? 'bg-cyan-400 animate-pulse shadow-sm shadow-cyan-400' : 'bg-slate-700'
                          }`}
                        />
                        <span className={`text-sm truncate ${isUnread ? 'font-bold text-white' : 'text-slate-300'}`}>
                          {msg.name}
                        </span>
                      </div>

                      <span className="text-[11px] font-mono text-slate-500 whitespace-nowrap">
                        {new Date(msg.created_at).toLocaleString([], {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>

                    <div className="mt-1 ml-5">
                      <p className="text-xs text-slate-400 truncate">{msg.email}</p>
                      <p className={`text-xs mt-2 line-clamp-2 ${isUnread ? 'text-slate-200 font-normal' : 'text-slate-400'}`}>
                        {msg.message}
                      </p>
                    </div>
                  </GlassCard>
                );
              })
            )}
          </div>

          {/* Selected Message Detail Panel */}
          {selectedMessage && (
            <div className="lg:col-span-6">
              <ScrollReveal>
                <GlassCard className="p-6 border border-cyan-500/30 bg-slate-900/80 sticky top-24 space-y-6">
                  <div className="flex items-start justify-between pb-4 border-b border-slate-800">
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-xl font-bold text-white">{selectedMessage.name}</h2>
                        <span
                          className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                            selectedMessage.status === 'unread'
                              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                              : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          {selectedMessage.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <a
                          href={`mailto:${selectedMessage.email}`}
                          className="text-xs text-cyan-400 hover:underline"
                        >
                          {selectedMessage.email}
                        </a>
                        <button
                          onClick={() => copyEmailToClipboard(selectedMessage.email)}
                          className="text-[11px] text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 px-2 py-0.5 rounded transition-colors"
                        >
                          {copied ? '✓ Copied' : 'Copy'}
                        </button>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedMessage(null)}
                      className="text-slate-400 hover:text-white text-lg p-1"
                      title="Close message detail"
                    >
                      ✕
                    </button>
                  </div>

                  <div>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 block mb-2">
                      Received On
                    </span>
                    <p className="text-xs text-slate-300 font-mono">
                      {new Date(selectedMessage.created_at).toLocaleString()}
                    </p>
                  </div>

                  <div>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 block mb-2">
                      Full Message
                    </span>
                    <div className="p-4 rounded-lg bg-slate-950/80 border border-slate-800 text-sm text-slate-200 whitespace-pre-wrap leading-relaxed max-h-64 overflow-y-auto">
                      {selectedMessage.message}
                    </div>
                  </div>

                  {(() => {
                    const replySubject = 'RE: Codewave Studio Inquiry';
                    const replyBody = `Hi ${selectedMessage.name},\n\n\n\n--- Original Message ---\nFrom: ${selectedMessage.name} <${selectedMessage.email}>\nDate: ${new Date(selectedMessage.created_at).toLocaleString()}\nMessage:\n${selectedMessage.message}`;
                    
                    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(selectedMessage.email)}&su=${encodeURIComponent(replySubject)}&body=${encodeURIComponent(replyBody)}`;
                    const mailtoUrl = `mailto:${selectedMessage.email}?subject=${encodeURIComponent(replySubject)}&body=${encodeURIComponent(replyBody)}`;

                    return (
                      <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
                        {/* Direct Gmail Web Composer */}
                        <a
                          href={gmailUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 min-w-[150px] inline-flex items-center justify-center gap-2 text-xs font-bold px-4 py-2.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 border border-red-500/30 transition-all cursor-pointer shadow-sm hover:shadow-red-500/10"
                        >
                          <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L12 9.545l8.073-6.052C21.69 2.28 24 3.434 24 5.457z" />
                          </svg>
                          Reply via Gmail
                        </a>

                        {/* Default Mail App (mailto:) */}
                        <a
                          href={mailtoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center gap-2 text-xs font-semibold px-3.5 py-2.5 rounded-lg bg-slate-800/80 hover:bg-slate-750 text-slate-300 hover:text-white border border-slate-700 transition-colors cursor-pointer"
                          title="Open default OS or mobile email application"
                        >
                          <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 002-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          Mail App
                        </a>

                        {/* Copy Email Address */}
                        <button
                          onClick={() => copyEmailToClipboard(selectedMessage.email)}
                          className="inline-flex items-center justify-center gap-2 text-xs font-semibold px-3.5 py-2.5 rounded-lg border border-slate-700 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
                        >
                          {copied ? '✓ Copied' : 'Copy Email'}
                        </button>
                      </div>
                    );
                  })()}
                </GlassCard>
              </ScrollReveal>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
