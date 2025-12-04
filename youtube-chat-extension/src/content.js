// Content script - Pure vanilla JavaScript
console.log('YouTube Chat Extension loaded');

const API_URL = 'http://localhost:8000';
let isSidebarOpen = false;

// Get video ID from URL
function getVideoId() {
    const params = new URLSearchParams(window.location.search);
    return params.get('v');
}

// Create floating button
function createButton() {
    if (document.getElementById('yt-chat-btn')) return;

    const btn = document.createElement('button');
    btn.id = 'yt-chat-btn';
    btn.innerHTML = `
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
      <span>Chat with Video</span>
    `;

    btn.style.cssText = `
      position: fixed; bottom: 32px; right: 32px; z-index: 9998;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white; border: none; padding: 16px 24px; border-radius: 50px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15); cursor: pointer;
      display: flex; align-items: center; gap: 8px;
      font-family: -apple-system, system-ui, sans-serif;
      font-size: 14px; font-weight: 600; transition: all 0.3s;
    `;

    btn.onmouseover = () => btn.style.transform = 'scale(1.05)';
    btn.onmouseout = () => btn.style.transform = 'scale(1)';
    btn.onclick = openSidebar;

    document.body.appendChild(btn);
}

// Create sidebar
function openSidebar() {
    if (isSidebarOpen) return;
    isSidebarOpen = true;

    const videoId = getVideoId();
    if (!videoId) {
        alert('Could not detect video ID');
        return;
    }

    const btn = document.getElementById('yt-chat-btn');
    if (btn) btn.style.display = 'none';

    const sidebar = document.createElement('div');
    sidebar.id = 'yt-chat-sidebar';
    sidebar.style.cssText = `
      position: fixed; top: 0; right: 0; width: 400px; height: 100vh;
      background: white; box-shadow: -4px 0 12px rgba(0,0,0,0.1);
      z-index: 9999; display: flex; flex-direction: column;
      font-family: -apple-system, system-ui, sans-serif;
    `;

    sidebar.innerHTML = `
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; display: flex; justify-content: space-between; align-items: center;">
        <h2 style="margin: 0; font-size: 18px; font-weight: 600;">Video Chat</h2>
        <button id="close-sidebar" style="background: rgba(255,255,255,0.2); border: none; color: white; width: 32px; height: 32px; border-radius: 50%; cursor: pointer;">✕</button>
      </div>
      <div id="yt-chat-messages" style="flex: 1; overflow-y: auto; padding: 16px; background: #f9fafb;"></div>
      <div style="padding: 16px; border-top: 1px solid #e5e7eb; background: white;">
        <div style="display: flex; gap: 8px;">
          <input id="chat-input" type="text" placeholder="Ask a question..." style="flex: 1; padding: 12px; border: 1px solid #d1d5db; border-radius: 8px; font-size: 14px; outline: none;" />
          <button id="send-btn" style="background: #667eea; color: white; border: none; padding: 12px 20px; border-radius: 8px; cursor: pointer; font-weight: 600;">Send</button>
        </div>
      </div>
    `;

    document.body.appendChild(sidebar);

    document.getElementById('close-sidebar').onclick = closeSidebar;
    document.getElementById('send-btn').onclick = sendMessage;
    document.getElementById('chat-input').onkeypress = (e) => {
        if (e.key === 'Enter') sendMessage();
    };

    processVideo(videoId);
}

function closeSidebar() {
    const sidebar = document.getElementById('yt-chat-sidebar');
    if (sidebar) sidebar.remove();

    const btn = document.getElementById('yt-chat-btn');
    if (btn) btn.style.display = 'flex';

    isSidebarOpen = false;
}

// Add message to sidebar
function addMessage(text, type = 'system') {
    const messages = document.getElementById('yt-chat-messages');
    if (!messages) return console.error("Message container missing!");

    const msg = document.createElement('div');

    const colors = {
        user: 'background: #667eea; color: white; margin-left: auto;',
        assistant: 'background: white; color: #1f2937; box-shadow: 0 1px 3px rgba(0,0,0,0.1);',
        system: 'background: #fef3c7; color: #92400e; border: 1px solid #fcd34d;',
        error: 'background: #fee2e2; color: #991b1b; border: 1px solid #fca5a5;'
    };

    msg.style.cssText = `
      max-width: 80%; padding: 12px; border-radius: 12px; margin-bottom: 12px;
      font-size: 14px; line-height: 1.5; ${colors[type]}
    `;
    msg.textContent = text;

    messages.appendChild(msg);
    messages.scrollTop = messages.scrollHeight;
}

// Fetch transcript
async function processVideo(videoId) {
    addMessage('Processing video transcript... Please wait.', 'system');

    const input = document.getElementById('chat-input');
    const sendBtn = document.getElementById('send-btn');
    input.disabled = true;
    sendBtn.disabled = true;

    try {
        const res = await fetch(`${API_URL}/api/process-video`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ video_id: videoId })
        });

        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const data = await res.json();
        addMessage(`✔ Video processed! Found ${data.total_chunks} chunks. Ask me anything!`, 'system');

        input.disabled = false;
        sendBtn.disabled = false;
        input.focus();
    } catch (err) {
        addMessage(`❌ Error: ${err.message}. Backend not running?`, 'error');
    }
}

// Chat request
async function sendMessage() {
    const input = document.getElementById('chat-input');
    const question = input.value.trim();
    if (!question) return;

    addMessage(question, 'user');
    input.value = '';
    input.disabled = true;

    const videoId = getVideoId();

    try {
        const res = await fetch(`${API_URL}/api/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ video_id: videoId, question })
        });

        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();

        addMessage(data.answer, 'assistant');
    } catch (err) {
        addMessage(`❌ Error: ${err.message}`, 'error');
    } finally {
        input.disabled = false;
        input.focus();
    }
}

// Initialize only on /watch page
if (window.location.pathname === '/watch') {
    createButton();
}
