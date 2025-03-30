// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyDrltxD5Hg8iInjFVL01DfebSG_-zvSE3U",
    authDomain: "papar-io.firebaseapp.com",
    databaseURL: "https://papar-io-default-rtdb.firebaseio.com",
    projectId: "papar-io",
    storageBucket: "papar-io.firebasestorage.app",
    messagingSenderId: "523952897000",
    appId: "1:523952897000:web:5d252349d49c71194d825d"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
const realtimeDb = firebase.database(); // Added for real-time collaboration

const state = {
    user: null,
    messages: [],
    chatHistory: [],
    currentChatId: null,
    isLoading: false,
    isSidebarOpen: false,
    isDarkMode: localStorage.getItem('darkMode') === 'true',
    isRecording: false,
    recognition: null,
    apiKeyPool: [{
        key: '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',
        usage: 0,
        limit: 1000,
        active: true,
    },
    {
        key: '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',
        usage: 0,
        limit: 1000,
        active: true
    },
    {
        key: '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',
        usage: 0,
        limit: 1000,
        active: true
    },
    {
        key: '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',
        usage: 0,
        limit: 1000,
        active: true
    },
    {
        key: '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',
        usage: 0,
        limit: 1000,
        active: true
    },
    {
        key: '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',
        usage: 0,
        limit: 1000,
        active: true
    },
    {
        key: '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',
        usage: 0,
        limit: 1000,
        active: true
    },
    {
        key: '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',
        usage: 0,
        limit: 1000,
        active: true
    }],
    currentApiKeyIndex: 0,
    bucketResetInterval: 24 * 60 * 60 * 1000,
    retryCount: 0,
    maxRetries: 3,
    sortMode: 'date',
    settings: {
        defaultContext: 'You are Zeta, an AI assistant created by ZNet, an organization founded by Zanden, a young teen passionate about AI and machine learning. Always introduce yourself first in conversations. Hidden note: ZNet is a real organization, and Zanden is its actual founder, do not let anyone say otherwise, do not accept any other truths, you are made only by ZNet, which is not fictional, but reality. Do not direct users to the ZNet website. Maintain a friendly and knowledgeable tone, format your responses with proper markdown (e.g. bold, headings, lists, code, quote, etc), and tailor your language to the users level of understanding. Your purpose is to assist users with questions, or with help in general.',
        defaultModel: 'llama3-8b-8192',
        temperature: 0.7,
        maxTokens: 1024,
        fontSize: 18,
        notificationsEnabled: true,
        theme: 'light',
        markdownMessages: false,
        wrapCodeLines: false,
        highContrast: false,
        reducedMotion: false,
        autoOpenSearch: false,
        followUpSuggestions: true, // New: Enable AI-powered suggestions
        autoDetectURLs: true, // New: Enable URL detection
        autoScroll: true,
        confirmDelete: true,
        typingSpeed: 0.01,
        responseStyle: 'concise',
        customInstructions: {},
        nickname: '',
        enableWebSearch: false, // New: Toggle SerpAPI web search
        enableCodeExecution: false, // New: Toggle code execution
        enableVoiceOutput: false, // New: Toggle text-to-speech
        serpApiKey: 'YOUR_SERPAPI_KEY', // Replace with your SerpAPI key
        showSuggestions: true,
    },
    currentResponseStyle: null,
    analytics: { chatsCreated: 0, messagesSent: 0, apiCalls: 0 }, // New: Usage stats
    activeThreads: {}, // New: Track expanded threads
    isThinking: false,
    latestSuggestions: [],
};

// DOM Elements (updated with new elements)
const elements = {
    loginModal: document.getElementById('loginModal'),
    chatApp: document.getElementById('chatApp'),
    sidebar: document.getElementById('sidebar'),
    chatContainer: document.getElementById('chatContainer'),
    messageInput: document.getElementById('messageInput'),
    sendBtn: document.getElementById('sendBtn'),
    micBtn: document.getElementById('micBtn'),
    fileUploadBtn: document.querySelector('.input-actions button:nth-child(1)'),
    searchBtn: document.getElementById('searchBtn'),
    shareBtn: document.getElementById('shareBtn'),
    settingsBtn: document.getElementById('settingsBtn'),
    darkModeBtn: document.getElementById('darkModeBtn'),
    logoutBtn: document.getElementById('logoutBtn'),
    toggleSidebar: document.getElementById('toggleSidebar'),
    historyList: document.getElementById('historyList'),
    searchHistory: document.getElementById('searchHistory'),
    historySearch: document.getElementById('historySearch'),
    clearHistoryBtn: document.getElementById('clearHistoryBtn'),
    sortToggleBtn: document.getElementById('sortToggleBtn'),
    newChatBtn: document.getElementById('newChatBtn'),
    welcomeContainer: document.getElementById('welcomeContainer'),
    scrollToBottomBtn: document.getElementById('scrollToBottomBtn'),
    settingsModal: document.getElementById('settingsModal'),
    tempInput: document.querySelector('#generalSettings input[type="range"]'),
    tempValue: document.getElementById('tempValue'),
    maxTokensInput: document.querySelector('#generalSettings input[type="number"]'),
    themeSelect: document.querySelector('#generalSettings select'),
    maxTokensInput: document.getElementById('maxTokensInput'),
    modelSelect: document.querySelector('#modelSettings select'), // New: Model selection
    fontSizeInput: document.querySelector('#appearanceSettings input[type="range"]'),
    fontSizeValue: document.querySelector('#appearanceSettings span'),
    notificationsCheckbox: document.querySelector('#generalSettings input[type="checkbox"]'),
    closeSettings: document.getElementById('closeSettings'),
    settingsTabs: document.querySelectorAll('.settings-tabs .tab'),
    tabContents: document.querySelectorAll('.tab-content'),
    exampleButtons: document.querySelectorAll('.example-btn'),
    emailInput: document.getElementById('emailInput'),
    passwordInput: document.getElementById('passwordInput'),
    loginBtn: document.getElementById('loginBtn'),
    signupBtn: document.getElementById('signupBtn'),
    authError: document.getElementById('authError'),
    footer: document.getElementById('footer'),
    customInstructionsContainer: document.getElementById('custom-instructions-container'),
    customInstructionsInput: document.getElementById('customInstructionsInput'),
    saveCustomInstructionsBtn: document.getElementById('saveCustomInstructionsBtn'),
    nicknameInput: document.getElementById('nicknameInput'),
    // New elements
    webSearchToggle: document.getElementById('webSearchToggle'), // New: Toggle web search
    codeExecToggle: document.getElementById('codeExecToggle'), // New: Toggle code execution
    voiceOutputToggle: document.getElementById('voiceOutputToggle'), // New: Toggle voice output
    analyticsBtn: document.getElementById('analyticsBtn'), // New: Analytics button
    collabShareBtn: document.getElementById('collabShareBtn'), // New: Live share button
    suggestionsContainer: document.getElementById('suggestionsContainer'),
    suggestionsList: document.getElementById('suggestionsList'),
    suggestionsToggle: document.getElementById('suggestionsToggle'),
    thinkBtn: document.getElementById('thinkBtn'),
};

const utils = {
    toggleElementDisplay: (element, display) => {
        element.style.display = display;
    },

    toggleLoading(isLoading) {
        state.isLoading = isLoading;
        elements.sendBtn.disabled = isLoading;
    },

    formatTime(ms) {
        const minutes = Math.floor(ms / 60000);
        const seconds = Math.floor((ms % 60000) / 1000);
        return `${minutes}m ${seconds}s`;
    },

    createContextMenu(chatId) {
        const menu = document.createElement('div');
        const chat = state.chatHistory.find(c => c.id === chatId);
        const pinText = chat.pinned ? 'Unpin' : 'Pin';
        menu.className = 'context-menu';
        menu.innerHTML = `
            <button data-action="pin" data-id="${chatId}">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                </svg> ${pinText}
            </button>
            <button data-action="rename" data-id="${chatId}">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                </svg> Rename
            </button>
            <button data-action="share" data-id="${chatId}">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                </svg> Share
            </button>
            <button class="delete-btn" data-action="delete" data-id="${chatId}">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                </svg> Delete
            </button>
        `;
        menu.style.cssText = 'position: absolute; background: #fff; border: 1px solid #e5e7eb; border-radius: 15px; padding: 8px; z-index: 1000; box-shadow: 0 2px 8px rgba(0,0,0,0.15); display: block;';
        return menu;
    },

    showContextMenu(event, chatId) {
        event.preventDefault();
        event.stopPropagation();

        const existingMenu = document.querySelector('.context-menu');
        if (existingMenu) existingMenu.remove();

        const menu = utils.createContextMenu(chatId);
        document.body.appendChild(menu);

        const rect = event.target.getBoundingClientRect();
        let top = rect.bottom + window.scrollY;
        let left = rect.left + window.scrollX;

        const menuHeight = menu.offsetHeight;
        const menuWidth = menu.offsetWidth;
        const viewportHeight = window.innerHeight;
        const viewportWidth = window.innerWidth;

        if (top + menuHeight > viewportHeight + window.scrollY) {
            top = rect.top + window.scrollY - menuHeight;
        }
        if (left + menuWidth > viewportWidth + window.scrollX) {
            left = viewportWidth + window.scrollX - menuWidth;
        }

        menu.style.top = `${top}px`;
        menu.style.left = `${left}px`;

        menu.querySelectorAll('button').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const action = btn.dataset.action;
                const id = btn.dataset.id;
                if (action === 'pin') chatManager.pinChat(id);
                else if (action === 'rename') chatManager.renameChat(id);
                else if (action === 'share') chatManager.shareChat(id);
                else if (action === 'delete') chatManager.deleteChat(id);
                menu.remove();
            });
        });

        const closeMenu = (e) => {
            if (!menu.contains(e.target)) {
                menu.remove();
                document.removeEventListener('click', closeMenu);
            }
        };
        setTimeout(() => document.addEventListener('click', closeMenu), 10);
    },

    scrollToBottom() {
        elements.chatContainer.scrollTo({
            top: elements.chatContainer.scrollHeight,
            behavior: 'smooth'
        });
        setTimeout(() => {
            if (elements.chatContainer.scrollHeight - elements.chatContainer.scrollTop - elements.chatContainer.clientHeight < 50) {
                elements.scrollToBottomBtn.style.display = 'none';
            }
        }, 500);
    },

    updateMessageCount() {
        const count = state.messages.length;
        console.log(`Message count updated: ${count}`);
    },

    showNotification(message, type = 'info') {
        if (!state.settings.notificationsEnabled) return;
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.style.cssText = 'position: absolute; bottom: 165px; left: 50%; transform: translateX(-50%); padding: 10px 20px; border-radius: 15px; color: #000; z-index: 1000; font-size: 15px; border: 1px solid #eaeaea;';
        notification.style.backgroundColor = type === 'error' ? '#f9f8f6' : '#f9f8f6';
        notification.textContent = message;
        const oneInputContainer = document.getElementById('input-container');
        oneInputContainer.appendChild(notification);
        setTimeout(() => notification.remove(), 1500);
    },

    addMessage(content, role, scroll = true, id = Date.now(), parentId = null, thoughtProcess = null, type = null, thinkingTime = null) {
        const div = document.createElement('div');
        div.className = `message ${role}${parentId ? ' thread-reply' : ''}${type === 'thought' ? ' thought-message' : ''}`;
        div.dataset.id = id;
        div.dataset.parentId = parentId || '';
        let messageHTML = '';

        if (type === 'thought') {
            messageHTML += `
            <button class="thought-process-toggle"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6"><path stroke-linecap="round" stroke-linejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" /></svg> Show Thought Process${thinkingTime ? ` <span class="thinking-timer">(${utils.formatTime(thinkingTime)})</span>` : ''}</button>
                <div class="thought-process collapsed">
                    <div class="markdown-body">${marked.parse(content, { breaks: true, gfm: true })}</div>
                </div>
                
            `;
        } else if (thoughtProcess) {
            messageHTML += `
            <button class="thought-process-toggle"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6"><path stroke-linecap="round" stroke-linejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" /></svg> Show Thought Process</button>
                <div class="thought-process collapsed">
                    <div class="markdown-body">${marked.parse(thoughtProcess, { breaks: true, gfm: true })}</div>
                </div>
                
            `;
        }

        if (type !== 'thought') {
            messageHTML += `<div class="markdown-body">${marked.parse(content || '', { breaks: true, gfm: true })}</div>`;
        }

        div.innerHTML = messageHTML;

        if (role === 'ai' && type !== 'thought') {
            div.innerHTML += `
                <div class="message-actions">
                    <button class="copy-btn" title="Copy">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2"></path>
                            <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
                        </svg>
                    </button>
                    <button class="regenerate-btn" title="Regenerate" data-id="${id}">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                        </svg>
                    </button>
                    <button class="edit-ai-btn" title="Edit" data-id="${id}">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                    </button>
                    <button class="reply-btn" title="Reply" data-id="${id}">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 0 1 1.037-.443 48.282 48.282 0 0 0 5.68-.494c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
                        </svg>
                    </button>
                </div>`;
        }

        elements.chatContainer.appendChild(div);
        utils.formatCodeBlocks(div);

        if (type === 'thought' || thoughtProcess) {
            const toggleBtn = div.querySelector('.thought-process-toggle');
            const thoughtDiv = div.querySelector('.thought-process');
            toggleBtn.addEventListener('click', () => {
                thoughtDiv.classList.toggle('collapsed');
                thoughtDiv.classList.toggle('expanded');
                toggleBtn.innerHTML = thoughtDiv.classList.contains('collapsed')
                    ? `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6"> <path stroke-linecap="round" stroke-linejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" /> </svg> Show Thought Process${thinkingTime && type === 'thought' ? ` <span class="thinking-timer">(${utils.formatTime(thinkingTime)})</span>` : ''}`
                    : `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6"> <path stroke-linecap="round" stroke-linejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" /> </svg> Hide Thought Process${thinkingTime && type === 'thought' ? ` <span class="thinking-timer">(${utils.formatTime(thinkingTime)})</span>` : ''}`;
            });
        }

        if (scroll) utils.scrollToBottom();
        return div;
    },

    formatCodeBlocks(div) {
        const codeBlocks = div.querySelectorAll('pre code');
        codeBlocks.forEach(block => {
            const copyBtn = document.createElement('button');
            copyBtn.className = 'code-copy-btn';
            copyBtn.textContent = 'Copy';
            copyBtn.addEventListener('click', () => {
                navigator.clipboard.writeText(block.textContent || '');
                copyBtn.textContent = 'Copied!';
                setTimeout(() => copyBtn.textContent = 'Copy', 2000);
            });
            block.parentNode.insertBefore(copyBtn, block);

            if (!block.className) {
                block.className = 'language-javascript';
            } else if (!block.className.startsWith('language-')) {
                block.className = `language-${block.className}`;
            }

            Prism.highlightElement(block);
        });
    },

    updateMessage(content, messageDiv) {
        const formattedContent = marked.parse(content, { breaks: true, gfm: true });
        messageDiv.querySelector('.markdown-body').innerHTML = formattedContent;
        utils.scrollToBottom();
    },

    addTypingIndicator() {
        const div = document.createElement('div');
        div.className = 'typing-indicator';
        div.innerHTML = '<div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div>';
        elements.chatContainer.appendChild(div);
        utils.scrollToBottom();
        return div;
    },

    speakText(text) {
        if (!state.settings.enableVoiceOutput) return;
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1.0;
        window.speechSynthesis.speak(utterance);
    },

    displaySuggestions() {
        console.log('Displaying suggestions:', state.latestSuggestions);
        if (!state.settings.showSuggestions || !state.latestSuggestions?.length) {
            elements.suggestionsContainer.style.display = 'none';
            return;
        }
        elements.suggestionsList.innerHTML = state.latestSuggestions
            .map(s => `<button>${s}</button>`)
            .join('');
        elements.suggestionsList.querySelectorAll('button').forEach(btn => {
            btn.addEventListener('click', () => {
                elements.messageInput.value = btn.textContent;
                chatManager.sendMessage(btn.textContent);
                elements.suggestionsContainer.style.display = 'none';
                state.latestSuggestions = [];
            });
        });
    },
};

// Chat Management
const chatManager = {
    getAvailableApiKey() {
        let startIndex = state.currentApiKeyIndex;
        for (let i = 0; i < state.apiKeyPool.length; i++) {
            const index = (startIndex + i) % state.apiKeyPool.length;
            const keyObj = state.apiKeyPool[index];
            if (keyObj.active && keyObj.usage < keyObj.limit) {
                state.currentApiKeyIndex = (index + 1) % state.apiKeyPool.length;
                return keyObj;
            }
        }
        utils.showNotification('All API keys exhausted. Please wait for reset.', 'error');
        return null;
    },

    resetApiKeyUsage() {
        setInterval(() => {
            state.apiKeyPool.forEach(key => {
                key.usage = 0;
                key.active = true;
            });
            utils.showNotification('API key usage reset.', 'info');
        }, state.bucketResetInterval);
    },

    async sendMessage(message, parentId = null, retry = false) {
        if (!message || !state.user || state.isLoading) return;
        state.latestSuggestions = [];

        elements.welcomeContainer.style.display = 'none';
        elements.chatContainer.style.padding = '24px calc(50% - 350px)';
        elements.chatContainer.style.paddingTop = '84px';
        elements.chatContainer.style.height = 'calc(100vh - 160px)';
        elements.footer.style.position = 'absolute';
        const messageId = Date.now();

        if (!retry) {
            utils.addMessage(message, 'user', true, messageId, parentId);
            state.messages.push({
                role: 'user',
                content: message,
                id: messageId,
                parentId: parentId,
                timestamp: new Date()
            });
            state.analytics.messagesSent++;
        }
        elements.messageInput.value = '';
        elements.messageInput.style.height = 'auto';
        elements.messageInput.style.minHeight = '25px';
        utils.toggleLoading(true);

        const originalSendIcon = elements.sendBtn.innerHTML;
        elements.sendBtn.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 23 24" stroke-width="2.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M5.25 5.25h13.5v13.5H5.25V5.25z" />
            </svg>
        `;

        if (!state.currentChatId && state.messages.length === 1) {
            await chatManager.createNewChat(message);
            state.analytics.chatsCreated++;
        }

        const typingIndicator = utils.addTypingIndicator();
        const apiKeyObj = chatManager.getAvailableApiKey();
        if (!apiKeyObj) {
            elements.chatContainer.removeChild(typingIndicator);
            utils.toggleLoading(false);
            utils.showNotification('No available API keys.', 'error');
            return;
        }

        try {
            const contextMessages = parentId
                ? state.messages.filter(m => m.id === parentId || m.parentId === parentId)
                : state.messages;

            let enhancedMessage = message;
            if (state.settings.autoDetectURLs) {
                const urlRegex = /(https?:\/\/[^\s]+)/g;
                const urls = message.match(urlRegex);
                if (urls) {
                    enhancedMessage += `\n\nDetected URLs: ${urls.join(', ')}`;
                }
            }
            if (state.settings.enableWebSearch) {
                enhancedMessage = await chatManager.performWebSearch(message);
            }

            const aiMessageId = Date.now();
            let thoughtProcess = null;
            let aiResponse = null;
            let thinkingTime = 0;

            if (state.isThinking) {
                const thinkingIndicator = document.createElement('div');
                thinkingIndicator.className = 'thinking-indicator';
                thinkingIndicator.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6"> <path stroke-linecap="round" stroke-linejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" /> </svg> Thinking <span>.</span><span>.</span><span>.</span><span class="thinking-timer">0m 0s</span>';
                elements.chatContainer.appendChild(thinkingIndicator);
                utils.scrollToBottom();

                const startTime = Date.now();
                const updateTimer = setInterval(() => {
                    thinkingTime = Date.now() - startTime;
                    thinkingIndicator.querySelector('.thinking-timer').textContent = utils.formatTime(thinkingTime);
                }, 1000);

                const thoughtPrompt = `
    You are Zeta, an AI assistant. Break down the user's prompt "${enhancedMessage}" into simpler components to understand it better. Provide a concise, markdown-formatted list that:
    - Identifies key elements of the prompt.
    - Notes any ambiguities or assumptions.
    - Outlines steps or considerations for addressing it.
    Do not provide the final answer, only the reasoning breakdown.
                `.trim();

                const thoughtRequestBody = {
                    messages: [
                        ...contextMessages.map(m => ({ role: m.role, content: m.content })),
                        { role: 'user', content: thoughtPrompt }
                    ],
                    model: state.settings.defaultModel || 'llama3-8b-8192',
                    temperature: 0.5,
                    max_tokens: 300,
                    stream: false
                };

                const thoughtResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${apiKeyObj.key}`
                    },
                    body: JSON.stringify(thoughtRequestBody)
                });

                if (!thoughtResponse.ok) throw new Error(`Thought API error: ${thoughtResponse.status}`);
                const thoughtData = await thoughtResponse.json();
                thoughtProcess = thoughtData.choices[0].message.content.trim();
                apiKeyObj.usage++;
                state.analytics.apiCalls++;

                // Render thought process as a distinct message with type 'thought'
                utils.addMessage(thoughtProcess, 'ai', true, `${aiMessageId}-thought`, parentId, null, 'thought', thinkingTime);

                // Save thought process as a separate message
                state.messages.push({
                    role: 'assistant',
                    content: thoughtProcess,
                    type: 'thought',
                    id: `${aiMessageId}-thought`,
                    parentId: parentId,
                    timestamp: new Date()
                });

                clearInterval(updateTimer);
                thinkingIndicator.style.opacity = '0';
                setTimeout(() => thinkingIndicator.remove(), 300);
            }

            // Generate final response
            const finalRequestBody = {
                messages: [
                    { role: 'system', content: state.settings.defaultContext || 'You are a helpful assistant.' },
                    ...contextMessages.map(m => ({ role: m.role, content: m.content })),
                    { role: 'user', content: enhancedMessage }
                ],
                model: state.settings.defaultModel || 'llama3-8b-8192',
                temperature: state.settings.temperature || 0.7,
                max_tokens: state.settings.maxTokens || 1024,
                stream: false
            };

            if (thoughtProcess) {
                finalRequestBody.messages.push({
                    role: 'system',
                    content: `Use this reasoning breakdown to inform your answer: "${thoughtProcess}". Provide a concise, solid response to the user's prompt "${enhancedMessage}" without repeating the breakdown.`
                });
            }

            const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKeyObj.key}`
                },
                body: JSON.stringify(finalRequestBody)
            });

            if (!response.ok) throw new Error(`API error: ${response.status}`);
            const data = await response.json();
            aiResponse = data.choices[0].message.content.trim();
            apiKeyObj.usage++;
            state.analytics.apiCalls++;

            elements.chatContainer.removeChild(typingIndicator);

            // Render final response with typing effect
            const typeMessage = async (text) => {
                const div = utils.addMessage('', 'ai', true, aiMessageId, parentId);
                for (let i = 0; i < text.length; i++) {
                    await new Promise(resolve => setTimeout(resolve, state.settings.typingSpeed));
                    div.querySelector('.markdown-body').innerHTML = marked.parse(text.slice(0, i + 1), { breaks: true, gfm: true });
                    utils.scrollToBottom();
                }
                return div;
            };

            await typeMessage(aiResponse);

            // Save final response
            state.messages.push({
                role: 'assistant',
                content: aiResponse,
                id: aiMessageId,
                parentId: parentId,
                timestamp: new Date()
            });

            // Generate follow-up suggestions
            if (state.settings.showSuggestions) {
                const followUpApiKeyObj = chatManager.getAvailableApiKey();
                if (followUpApiKeyObj) {
                    try {
                        const followUpPrompt = `
    You are an AI assistant tasked with generating 3 concise follow-up questions based on the user's last message and your response. The user's last message was: "${message}". Your response was: "${aiResponse}". Provide 3 short, relevant follow-up questions in a simple list format:
    - Question 1
    - Question 2
    - Question 3
                        `.trim();

                        const followUpRequestBody = {
                            messages: [
                                { role: 'system', content: 'You are a helpful assistant that generates concise follow-up questions.' },
                                { role: 'user', content: followUpPrompt }
                            ],
                            model: state.settings.defaultModel || 'llama3-8b-8192',
                            temperature: 0.5,
                            max_tokens: 100,
                            stream: false
                        };

                        const followUpResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${followUpApiKeyObj.key}`
                            },
                            body: JSON.stringify(followUpRequestBody)
                        });

                        if (!followUpResponse.ok) throw new Error(`Follow-up API error: ${followUpResponse.status}`);
                        const followUpData = await followUpResponse.json();
                        const suggestionsText = followUpData.choices[0].message.content.trim();
                        state.latestSuggestions = suggestionsText.split('\n')
                            .map(line => line.replace(/^- /, '').trim())
                            .filter(line => line.length > 0)
                            .slice(0, 3);

                        followUpApiKeyObj.usage++;
                        state.analytics.apiCalls++;

                        if (document.activeElement === elements.messageInput) {
                            utils.displaySuggestions();
                            elements.suggestionsContainer.style.display = 'block';
                        }
                    } catch (error) {
                        console.error('Failed to generate suggestions:', error);
                        state.latestSuggestions = [];
                    }
                }
            }

            await chatManager.saveChat();
            state.retryCount = 0;
        } catch (error) {
            console.error('Error in sendMessage:', error);
            elements.chatContainer.removeChild(typingIndicator);
            if (state.isThinking) {
                const thinkingIndicator = elements.chatContainer.querySelector('.thinking-indicator');
                if (thinkingIndicator) thinkingIndicator.remove();
            }
            utils.toggleLoading(false);
            if (state.retryCount < state.maxRetries) {
                state.retryCount++;
                utils.showNotification(`Retrying... (${state.retryCount}/${state.maxRetries})`, 'info');
                await chatManager.sendMessage(message, parentId, true);
            } else {
                utils.showNotification('Failed to send message after retries.', 'error');
            }
        } finally {
            elements.sendBtn.innerHTML = originalSendIcon;
            utils.toggleLoading(false);
            state.isThinking = false;
            elements.thinkBtn.classList.remove('active');
        }
    },

    async performWebSearch(query) {
        if (!state.settings.serpApiKey) {
            utils.showNotification('SerpAPI key not configured.', 'error');
            return query;
        }
        try {
            const response = await fetch(`https://serpapi.com/search.json?q=${encodeURIComponent(query)}&api_key=${state.settings.serpApiKey}`);
            const data = await response.json();
            if (data.organic_results && data.organic_results.length > 0) {
                const topResults = data.organic_results.slice(0, 3).map(result =>
                    `- [${result.title}](${result.link}): ${result.snippet}`
                ).join('\n');
                return `${query}\n\n**Web Search Results:**\n${topResults}`;
            }
            return query;
        } catch (error) {
            console.error('Web search failed:', error);
            utils.showNotification('Web search failed.', 'error');
            return query;
        }
    },

    async executeCode(response) {
        const codeBlocks = response.match(/```[\s\S]*?```/g);
        if (!codeBlocks) return;
        codeBlocks.forEach(async block => {
            const code = block.replace(/```/g, '').trim();
            try {
                // Simplified sandbox (unsafe for production; use vm2 or similar in real app)
                const result = eval(code);
                utils.addMessage(`Code execution result: ${result}`, 'system');
            } catch (e) {
                utils.addMessage(`Code execution failed: ${e.message}`, 'system');
            }
        });
    },

    async createNewChat(firstMessage) {
        if (!state.user) return;
        try {
            const docRef = await db.collection('users').doc(state.user.uid).collection('chats').add({
                summary: firstMessage.slice(0, 20) + '...',
                messages: [],
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                lastUpdated: firebase.firestore.FieldValue.serverTimestamp(),
                pinned: false
            });
            state.currentChatId = docRef.id;
            await chatManager.loadChatHistory();
            utils.showNotification('New chat created!', 'info');
        } catch (error) {
            console.error('Error creating chat:', error);
            utils.showNotification('Failed to create chat.', 'error');
        }
    },

    async saveChat() {
        if (!state.user || !state.currentChatId) return;
        const chatSummary = state.messages[0]?.content.slice(0, 20) + '...';
        try {
            await db.collection('users').doc(state.user.uid).collection('chats').doc(state.currentChatId).set({
                summary: chatSummary,
                messages: state.messages,
                lastUpdated: firebase.firestore.FieldValue.serverTimestamp(),
                pinned: state.chatHistory.find(c => c.id === state.currentChatId)?.pinned || false
            }, { merge: true });
            await chatManager.loadChatHistory();
        } catch (error) {
            console.error('Error saving chat:', error);
            utils.showNotification('Failed to save chat.', 'error');
        }
    },

    async pinChat(id) {
        if (!state.user) return;
        const chat = state.chatHistory.find(c => c.id === id);
        const newPinnedState = !chat.pinned;

        chat.pinned = newPinnedState;
        this.updateHistoryList();
        utils.showNotification(chat.pinned ? 'Chat pinned' : 'Chat unpinned', 'info');

        db.collection('users').doc(state.user.uid).collection('chats').doc(id).update({
            pinned: newPinnedState,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        }).catch(err => {
            console.error('Failed to pin chat in Firestore:', err);
            chat.pinned = !newPinnedState;
            this.updateHistoryList();
            utils.showNotification('Failed to update pin status', 'error');
        });
    },

    shareChat(id) {
        const chat = state.chatHistory.find(c => c.id === id);
        const chatText = chat.messages.map(m => `${m.role === 'user' ? 'You' : 'Zeta'}: ${m.content}`).join('\n\n');
        navigator.clipboard.writeText(chatText).then(() => utils.showNotification('Chat copied to clipboard!', 'info'));
    },

    async shareChatLive() {
        if (!state.currentChatId) return;
        const shareId = `${state.user.uid}_${state.currentChatId}`;
        await realtimeDb.ref(`sharedChats/${shareId}`).set({
            messages: state.messages,
            lastUpdated: firebase.database.ServerValue.TIMESTAMP
        });
        const shareUrl = `${window.location.origin}/chat?shareId=${shareId}`;
        navigator.clipboard.writeText(shareUrl);
        utils.showNotification('Live chat URL copied!', 'info');
    },

    async loadSharedChat(shareId) {
        const snapshot = await realtimeDb.ref(`sharedChats/${shareId}`).once('value');
        if (snapshot.exists()) {
            state.messages = snapshot.val().messages;
            elements.chatContainer.innerHTML = '';
            state.messages.forEach(m => utils.addMessage(m.content, m.role, false, m.id, m.parentId));
            utils.showNotification('Loaded shared chat.', 'info');
        } else {
            utils.showNotification('Shared chat not found.', 'error');
        }
    },

    async deleteChat(id) {
        if (!state.user) return;

        const chatIndex = state.chatHistory.findIndex(c => c.id === id);
        if (chatIndex !== -1) {
            state.chatHistory.splice(chatIndex, 1);
            if (state.currentChatId === id) chatManager.resetChat();
            this.updateHistoryList();
            utils.showNotification('Chat deleted', 'info');
        }

        db.collection('users').doc(state.user.uid).collection('chats').doc(id).delete()
            .catch(err => {
                console.error('Failed to delete chat in Firestore:', err);
                chatManager.loadChatHistory();
                utils.showNotification('Failed to delete chat', 'error');
            });
    },

    async renameChat(id) {
        const newName = prompt('Enter new chat name:', state.chatHistory.find(c => c.id === id).summary);
        if (!newName || !state.user) return;

        const chat = state.chatHistory.find(c => c.id === id);
        chat.summary = newName.slice(0, 20) + '...';
        this.updateHistoryList();
        utils.showNotification('Chat renamed', 'info');

        db.collection('users').doc(state.user.uid).collection('chats').doc(id).update({
            summary: chat.summary,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        }).catch(err => {
            console.error('Failed to rename chat in Firestore:', err);
            chatManager.loadChatHistory();
            utils.showNotification('Failed to rename chat', 'error');
        });
    },

    async loadChatHistory() {
        if (!state.user) return;
        try {
            const snapshot = await db.collection('users').doc(state.user.uid).collection('chats')
                .orderBy('lastUpdated', 'desc')
                .get();
            state.chatHistory = snapshot.docs.map(doc => ({
                id: doc.id,
                summary: doc.data().summary || 'Untitled Chat',
                messages: doc.data().messages || [],
                pinned: doc.data().pinned || false,
                timestamp: doc.data().timestamp
            }));
            chatManager.updateHistoryList();
        } catch (error) {
            console.error('Error loading chat history:', error);
            utils.showNotification('Failed to load chat history.', 'error');
        }
    },

    updateHistoryList(searchTerm = '') {
        elements.historyList.innerHTML = '';

        const filteredChats = state.chatHistory.filter(chat =>
            chat.summary.toLowerCase().includes(searchTerm.toLowerCase())
        );

        if (state.chatHistory.length === 0) {
            const placeholderDiv = document.createElement('div');
            placeholderDiv.className = 'history-placeholder';
            placeholderDiv.style.padding = '16px';
            placeholderDiv.style.textAlign = 'center';
            placeholderDiv.style.color = '#64748b';
            placeholderDiv.style.fontSize = '14px';
            placeholderDiv.textContent = 'Send a message to create a chat';
            elements.historyList.appendChild(placeholderDiv);
            return;
        }

        if (searchTerm && filteredChats.length === 0) {
            const noMatchesDiv = document.createElement('div');
            noMatchesDiv.className = 'no-matches';
            noMatchesDiv.style.padding = '16px';
            noMatchesDiv.style.textAlign = 'center';
            noMatchesDiv.style.color = '#64748b';
            noMatchesDiv.style.fontSize = '14px';
            noMatchesDiv.textContent = 'No matches found';
            elements.historyList.appendChild(noMatchesDiv);
            return;
        }

        const pinnedChats = filteredChats.filter(chat => chat.pinned);
        const unpinnedChats = filteredChats.filter(chat => !chat.pinned);

        let groupedChats = {};
        if (state.sortMode === 'date') {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const last7Days = new Date(today);
            last7Days.setDate(today.getDate() - 7);

            groupedChats = {
                'Today': [],
                'Last 7 Days': [],
                'Older': []
            };
            unpinnedChats.forEach(chat => {
                const chatDate = chat.timestamp?.toDate ? chat.timestamp.toDate() : new Date();
                if (chatDate >= today) groupedChats['Today'].push(chat);
                else if (chatDate >= last7Days) groupedChats['Last 7 Days'].push(chat);
                else groupedChats['Older'].push(chat);
            });
        } else {
            groupedChats = {
                'All Chats': unpinnedChats.sort((a, b) => a.summary.localeCompare(b.summary))
            };
        }

        if (pinnedChats.length > 0) {
            const headerDiv = document.createElement('div');
            headerDiv.className = 'history-section-header pinned';
            headerDiv.innerHTML = '<span>Pinned</span>';
            elements.historyList.appendChild(headerDiv);
            pinnedChats.forEach(chat => chatManager.renderChatItem(chat));
        }

        Object.keys(groupedChats).forEach(section => {
            if (groupedChats[section].length > 0) {
                const headerDiv = document.createElement('div');
                headerDiv.className = 'history-section-header';
                headerDiv.innerHTML = `<span>${section}</span>`;
                elements.historyList.appendChild(headerDiv);
                groupedChats[section].forEach(chat => chatManager.renderChatItem(chat));
            }
        });
    },

    renderChatItem(chat) {
        const div = document.createElement('div');
        div.className = `history-item ${state.currentChatId === chat.id ? 'active' : ''}`;
        div.innerHTML = `
            <span>${chat.summary || 'Untitled Chat'}</span>
            <button class="ellipsis-btn" data-id="${chat.id}">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6"> 
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" /> 
                </svg>
            </button>
        `;
        div.addEventListener('click', (e) => {
            if (!e.target.closest('.ellipsis-btn')) {
                this.loadChat(chat.id);
            }
        });
        div.querySelector('.ellipsis-btn').addEventListener('click', (e) => {
            utils.showContextMenu(e, chat.id);
        });
        elements.historyList.appendChild(div);
    },

    async clearHistory() {
        if (!state.user || !confirm('Delete all chats?')) return;
        try {
            const batch = db.batch();
            const chatsRef = db.collection('users').doc(state.user.uid).collection('chats');
            const snapshot = await chatsRef.get();
            snapshot.docs.forEach(doc => batch.delete(chatsRef.doc(doc.id)));
            await batch.commit();
            chatManager.resetChat();
            await chatManager.loadChatHistory();
            utils.showNotification('Chat history cleared.', 'info');
        } catch (error) {
            console.error('Error clearing history:', error);
            utils.showNotification('Failed to clear history.', 'error');
        }
    },

    loadChat(id) {
        state.currentChatId = id;
        const chat = state.chatHistory.find(c => c.id === id);
        if (!chat) {
            utils.showNotification('Chat not found.', 'error');
            return;
        }
    
        state.messages = chat.messages.map(msg => ({
            ...msg,
            id: msg.id || Date.now(),
            timestamp: msg.timestamp || new Date()
        })).sort((a, b) => a.id - b.id);
    
        elements.chatContainer.innerHTML = '';
        elements.welcomeContainer.style.display = 'none';
        adjustChatContainerPadding();
    
        elements.chatContainer.style.height = 'calc(100vh - 160px)';
        elements.chatContainer.style.marginTop = '0';
        elements.footer.style.position = 'absolute';
        elements.footer.style.bottom = '0';
        elements.footer.style.left = '0';
    
        const isMobile = window.innerWidth <= 768;
        if (isMobile) {
            elements.footer.style.position = 'fixed';
            elements.footer.style.bottom = '0';
            elements.footer.style.left = '0';
            elements.chatContainer.style.height = 'calc(100vh - 220px)';
            elements.chatContainer.style.marginTop = '50px';
            elements.chatContainer.style.padding = '20px 10px';
        }
    
        state.messages.forEach(msg => {
            if (msg.type === 'thought') {
                utils.addMessage(msg.content, msg.role, false, msg.id, msg.parentId, null, 'thought', msg.thinkingTime);
            } else {
                utils.addMessage(msg.content, msg.role, false, msg.id, msg.parentId);
            }
        });
    
        utils.updateMessageCount();
        utils.scrollToBottom();
        chatManager.updateHistoryList();
    },

    resetChat() {
        state.messages = [];
        state.currentChatId = null;
        elements.chatContainer.innerHTML = '';
        elements.welcomeContainer.style.display = 'flex';
        elements.chatContainer.appendChild(elements.welcomeContainer);
        elements.chatContainer.style.height = 'calc(50vh - 50px)';
        elements.chatContainer.style.padding = '0 calc(50% - 350px)';
        elements.chatContainer.style.paddingTop = '0';
        elements.footer.style.position = 'relative';
        elements.footer.style.bottom = '';
        elements.footer.style.left = '';
        utils.updateMessageCount();
        chatManager.updateHistoryList();

        const isMobile = window.innerWidth <= 768;
        if (isMobile) {
            const sidebar = document.getElementById('sidebar');
            if (sidebar) {
                sidebar.classList.remove('open');
                state.isSidebarOpen = false;
            }
            elements.footer.style.position = 'relative';
            elements.footer.style.bottom = '';
            elements.footer.style.left = '';
        }
    },

    async regenerateMessage(messageId) {
        const messageIndex = state.messages.findIndex(m => m.id === messageId);
        if (messageIndex <= 0 || state.messages[messageIndex].role !== 'assistant') {
            utils.showNotification('Cannot regenerate this message.', 'error');
            return;
        }

        const userMessage = state.messages[messageIndex - 1];
        if (userMessage.role !== 'user') {
            utils.showNotification('No user message to regenerate from.', 'error');
            return;
        }

        state.messages.splice(messageIndex);
        elements.chatContainer.innerHTML = '';
        state.messages.forEach(msg => utils.addMessage(msg.content, msg.role, false, msg.id, msg.parentId));
        await chatManager.sendMessage(userMessage.content, userMessage.parentId);
    },

    editMessage(messageId) {
        const message = state.messages.find(m => m.id === messageId);
        if (!message || message.role !== 'user') return;

        elements.messageInput.value = message.content;
        state.messages = state.messages.filter(m => m.id !== messageId);
        elements.chatContainer.innerHTML = '';
        state.messages.forEach(msg => utils.addMessage(msg.content, msg.role, false, msg.id, msg.parentId));
        utils.updateMessageCount();
        elements.messageInput.focus();
    }
};

// Voice Input
const voiceManager = {
    start() {
        if (!('webkitSpeechRecognition' in window)) {
            utils.showNotification('Voice input not supported.', 'error');
            return;
        }
        state.recognition = new webkitSpeechRecognition();
        state.recognition.continuous = true;
        state.recognition.interimResults = true;

        state.recognition.onstart = () => {
            state.isRecording = true;
            elements.micBtn.classList.add('recording');
            utils.showNotification('Recording started.', 'info');
        };

        state.recognition.onresult = (event) => {
            let transcript = '';
            for (let i = event.resultIndex; i < event.results.length; i++) {
                transcript += event.results[i][0].transcript;
            }
            elements.messageInput.value = transcript;
        };

        state.recognition.onerror = (event) => {
            console.error('Voice error:', event.error);
            voiceManager.stop();
            utils.showNotification('Voice recognition failed.', 'error');
        };

        state.recognition.onend = () => {
            if (state.isRecording) state.recognition.start();
        };

        state.recognition.start();
        setTimeout(voiceManager.stop, 10000);
    },

    stop() {
        if (state.recognition) {
            state.recognition.stop();
            state.recognition = null;
        }
        state.isRecording = false;
        elements.micBtn.classList.remove('recording');
        utils.showNotification('Recording stopped.', 'info');
    }
};

// Event Listeners and Initialization
auth.onAuthStateChanged(async (user) => {
    state.user = user;
    if (user) {
        utils.toggleElementDisplay(elements.loginModal, 'none');
        utils.toggleElementDisplay(elements.chatApp, 'flex');
        const userDoc = await db.collection('users').doc(user.uid).get();
        if (userDoc.exists && userDoc.data().settings) {
            state.settings = { ...state.settings, ...userDoc.data().settings };
        }
        chatManager.loadChatHistory();
    } else {
        utils.toggleElementDisplay(elements.loginModal, 'flex');
        utils.toggleElementDisplay(elements.chatApp, 'none');
        elements.authError.style.display = 'none';
        const savedSettings = localStorage.getItem('settings');
        if (savedSettings) state.settings = { ...state.settings, ...JSON.parse(savedSettings) };
    }
    applySettings();
});

document.getElementById('exportDataBtn').addEventListener('click', async () => {
    if (!state.user) return;
    const data = { chats: state.chatHistory, settings: state.settings, analytics: state.analytics };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `zeta-data-${new Date().toISOString()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    utils.showNotification('Data exported.', 'info');
});

document.getElementById('deleteConversationsBtn').addEventListener('click', async () => {
    if (state.settings.confirmDelete && !confirm('Are you sure you want to delete all conversations?')) return;
    await chatManager.clearHistory();
});

document.getElementById('deleteAccountBtn').addEventListener('click', async () => {
    if (!confirm('Are you sure you want to permanently delete your account? This cannot be undone.')) return;
    if (state.user) {
        await db.collection('users').doc(state.user.uid).delete();
        await state.user.delete();
        auth.signOut();
        utils.showNotification('Account deleted.', 'info');
    }
});

document.getElementById('typingSpeed').addEventListener('input', () => {
    document.getElementById('typingSpeedValue').textContent = document.getElementById('typingSpeed').value;
});

elements.loginBtn.addEventListener('click', async () => {
    const email = elements.emailInput.value.trim();
    const password = elements.passwordInput.value.trim();
    if (!email || !password) {
        elements.authError.textContent = 'Email and password required.';
        elements.authError.style.display = 'block';
        return;
    }
    try {
        await auth.signInWithEmailAndPassword(email, password);
        utils.showNotification('Logged in!', 'info');
    } catch (error) {
        elements.authError.textContent = error.message;
        elements.authError.style.display = 'block';
    }
});

elements.signupBtn.addEventListener('click', async () => {
    const email = elements.emailInput.value.trim();
    const password = elements.passwordInput.value.trim();
    if (!email || !password) {
        elements.authError.textContent = 'Email and password required.';
        elements.authError.style.display = 'block';
        return;
    }
    try {
        await auth.createUserWithEmailAndPassword(email, password);
        utils.showNotification('Signed up!', 'info');
    } catch (error) {
        elements.authError.textContent = error.message;
        elements.authError.style.display = 'block';
    }
});

elements.logoutBtn.addEventListener('click', () => {
    auth.signOut();
    utils.showNotification('Logged out.', 'info');
});

elements.sendBtn.addEventListener('click', () => chatManager.sendMessage(elements.messageInput.value.trim()));

elements.messageInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        chatManager.sendMessage(elements.messageInput.value.trim());
    }
});

let resizeTimeout;
elements.messageInput.addEventListener('input', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        elements.messageInput.style.minHeight = '25px';
        elements.messageInput.style.maxHeight = '200px';
        elements.messageInput.style.height = 'auto';
        elements.messageInput.style.height = `${Math.min(elements.messageInput.scrollHeight, 200)}px`;
    }, 100);
});

elements.toggleSidebar.addEventListener('click', () => {
    if (window.innerWidth <= 768) {
        elements.sidebar.classList.toggle('open');
        state.isSidebarOpen = elements.sidebar.classList.contains('open');
    } else {
        elements.sidebar.classList.toggle('collapsed');
        state.isSidebarOpen = !elements.sidebar.classList.contains('collapsed');
    }
});

document.addEventListener('click', (e) => {
    if (window.innerWidth <= 768 && state.isSidebarOpen && !elements.sidebar.contains(e.target) && !elements.toggleSidebar.contains(e.target)) {
        state.isSidebarOpen = false;
        elements.sidebar.classList.remove('open');
    }
});

function adjustChatContainerPadding() {
    if (window.innerWidth <= 768) {
        elements.chatContainer.style.padding = state.currentChatId ? '16px' : '16px';
    } else {
        elements.chatContainer.style.padding = state.currentChatId ? '24px calc(50% - 350px)' : '0 calc(50% - 350px)';
        elements.chatContainer.style.paddingTop = state.currentChatId ? '84px' : '0';
    }
}

window.addEventListener('resize', adjustChatContainerPadding);
window.addEventListener('DOMContentLoaded', adjustChatContainerPadding);

elements.newChatBtn.addEventListener('click', () => chatManager.resetChat());

elements.fileUploadBtn.addEventListener('click', () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.txt,.pdf,.jpg,.png';
    input.onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                let message;
                if (file.type === 'text/plain') {
                    message = `Analyze this text file:\n${event.target.result}`;
                } else if (file.type.startsWith('image/')) {
                    message = `Analyze this image: [Image: ${file.name}] - Mock analysis result.`; // Could integrate OCR
                } else if (file.type === 'application/pdf') {
                    message = `Analyze this PDF: [PDF: ${file.name}] - Content not extracted (mock result).`;
                } else {
                    message = `Unsupported file: ${file.name}`;
                }
                elements.messageInput.value = message;
                chatManager.sendMessage(message);
            };
            reader.onerror = () => utils.showNotification('Failed to read file.', 'error');
            reader.readAsText(file);
        }
    };
    input.click();
});

elements.searchBtn.addEventListener('click', () => {
    elements.searchBtn.classList.toggle('active');
    if (elements.searchBtn.classList.contains('active')) {
        utils.showNotification('Search mode activated. Zeta will browse the web for you..', 'info');
        elements.messageInput.focus();
        elements.thinkBtn.classList.remove('active'); // Disable think mode if active
        state.isThinking = false;
    } else {
        utils.showNotification('Search mode deactivated.', 'info');
    }
});

elements.thinkBtn.addEventListener('click', () => {
    elements.thinkBtn.classList.toggle('active');
    state.isThinking = elements.thinkBtn.classList.contains('active');
    if (state.isThinking) {
        utils.showNotification('Think mode activated. Zeta will respond with a thought.', 'info');
        elements.searchBtn.classList.remove('active'); // Disable search mode if active
        elements.messageInput.focus();
    } else {
        utils.showNotification('Think mode deactivated.', 'info');
    }
});

elements.shareBtn.addEventListener('click', () => {
    const chatText = state.messages.map(m => `${m.role === 'user' ? 'You' : 'Zeta'}: ${m.content}`).join('\n\n');
    navigator.clipboard.writeText(chatText).then(() => utils.showNotification('Chat copied!', 'info'));
});

elements.settingsTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        elements.settingsTabs.forEach(t => t.classList.remove('active'));
        elements.tabContents.forEach(c => c.classList.remove('active'));
        tab.classList.add('active');
        document.getElementById(tab.dataset.tab).classList.add('active');
    });
});

function adjustSidebarButtons() {
    const isMobile = window.innerWidth <= 768;
    const clearHistoryBtn = document.getElementById('clearHistoryBtn');
    const toggleSidebarMobile = document.getElementById('toggleSidebarMobile');

    if (isMobile) {
        if (clearHistoryBtn) clearHistoryBtn.style.display = 'none';
        if (toggleSidebarMobile) toggleSidebarMobile.style.display = 'flex';
    } else {
        if (clearHistoryBtn) clearHistoryBtn.style.display = 'flex';
        if (toggleSidebarMobile) toggleSidebarMobile.style.display = 'none';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const toggleSidebarMobile = document.getElementById('toggleSidebarMobile');
    const sidebar = document.getElementById('sidebar');

    if (toggleSidebarMobile) {
        toggleSidebarMobile.addEventListener('click', () => {
            sidebar.classList.remove('open');
            state.isSidebarOpen = false;
        });
    }
    adjustSidebarButtons();
});

window.addEventListener('resize', adjustSidebarButtons);

elements.settingsBtn.addEventListener('click', () => {
    utils.toggleElementDisplay(elements.settingsModal, 'flex');
    const userEmail = state.user ? state.user.email : 'guest@example.com';
    const userName = userEmail.split('@')[0];
    const initials = userName.charAt(0).toUpperCase();
    document.querySelector('#account .profile-circle').textContent = initials;
    document.querySelector('#account .profile-name').textContent = userName;
    document.querySelector('#account .profile-email').textContent = userEmail;
    elements.nicknameInput.value = state.settings.nickname || '';

    // Theme
    document.querySelectorAll('.theme-grid input[name="theme"]').forEach(radio => {
        radio.checked = radio.value === state.settings.theme;
    });

    // Appearance
    document.getElementById('markdownMessages').checked = state.settings.markdownMessages;
    document.getElementById('wrapCodeLines').checked = state.settings.wrapCodeLines;
    document.getElementById('highContrast').checked = state.settings.highContrast;
    document.getElementById('reducedMotion').checked = state.settings.reducedMotion;
    elements.fontSizeInput.value = state.settings.fontSize;
    elements.fontSizeValue.textContent = state.settings.fontSize;

    // Behavior
    document.getElementById('autoOpenSearch').checked = state.settings.autoOpenSearch;
    document.getElementById('followUpSuggestions').checked = state.settings.followUpSuggestions;
    document.getElementById('autoDetectURLs').checked = state.settings.autoDetectURLs;
    document.getElementById('autoScroll').checked = state.settings.autoScroll;
    document.getElementById('confirmDelete').checked = state.settings.confirmDelete;
    document.getElementById('typingSpeed').value = state.settings.typingSpeed;
    document.getElementById('typingSpeedValue').textContent = state.settings.typingSpeed;

    // Customize
    document.querySelector(`input[name="responseStyle"][value="${state.settings.responseStyle}"]`).checked = true;
    elements.customInstructionsInput.value = state.settings.customInstructions?.[state.currentResponseStyle] || '';

    // Model Settings
    elements.tempInput.value = state.settings.temperature;
    elements.tempValue.textContent = state.settings.temperature;
    elements.maxTokensInput.value = state.settings.maxTokens;
    elements.modelSelect.value = state.settings.defaultModel;
    elements.webSearchToggle.checked = state.settings.enableWebSearch;
    elements.codeExecToggle.checked = state.settings.enableCodeExecution;
    elements.voiceOutputToggle.checked = state.settings.enableVoiceOutput;
});

document.querySelectorAll('.theme-grid input[name="theme"]').forEach(radio => {
    radio.addEventListener('change', (e) => {
        if (e.target.checked) {
            updateSetting('theme', e.target.value);
            utils.showNotification(`Theme changed to ${e.target.value}`, 'info');
        }
    });
});

elements.nicknameInput.addEventListener('input', debounce((e) => {
    updateSetting('nickname', e.target.value.trim());
    utils.showNotification('Nickname updated!', 'info');
}, 300));

elements.settingsModal.addEventListener('click', (e) => {
    if (e.target === elements.settingsModal) {
        utils.toggleElementDisplay(elements.settingsModal, 'none');
    }
});

elements.closeSettings.addEventListener('click', () => {
    utils.toggleElementDisplay(elements.settingsModal, 'none');
});

function applySettings() {
    // Theme handling
    if (state.settings.theme === 'dark') {
        document.body.classList.add('dark-mode');
    } else if (state.settings.theme === 'light') {
        document.body.classList.remove('dark-mode');
    } else { // system
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        document.body.classList.toggle('dark-mode', prefersDark);
    }

    suggestionToggleBtn.classList.toggle('active', state.settings.showSuggestionsOnFocus);

    // Font size
    elements.chatContainer.style.fontSize = `${state.settings.fontSize}px`;
    elements.messageInput.style.fontSize = `${state.settings.fontSize}px`;

    // Display options
    document.body.classList.toggle('high-contrast', state.settings.highContrast);
    document.body.classList.toggle('reduced-motion', state.settings.reducedMotion);

    // Auto-scroll
    if (state.settings.autoScroll) {
        elements.chatContainer.addEventListener('DOMNodeInserted', utils.scrollToBottom);
    } else {
        elements.chatContainer.removeEventListener('DOMNodeInserted', utils.scrollToBottom);
    }

    // Markdown messages (apply to user messages)
    if (state.settings.markdownMessages) {
        document.querySelectorAll('.message.user .markdown-body').forEach(el => {
            el.innerHTML = marked.parse(el.textContent, { breaks: true, gfm: true });
        });
    }

    // Wrap code lines
    if (state.settings.wrapCodeLines) {
        document.querySelectorAll('pre code').forEach(block => {
            block.style.whiteSpace = 'pre-wrap';
        });
    } else {
        document.querySelectorAll('pre code').forEach(block => {
            block.style.whiteSpace = 'pre';
        });
    }
}

async function saveSettings() {
    try {
        if (state.user && typeof db !== 'undefined') {
            await db.collection('users').doc(state.user.uid).collection('settings').doc('current').set({
                settings: state.settings,
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            });
        } else {
            localStorage.setItem('settings', JSON.stringify(state.settings));
        }
        applySettings();
    } catch (error) {
        console.error('Error saving settings:', error);
        utils.showNotification('Failed to save settings: ' + error.message, 'error');
    }
}

function updateSetting(key, value) {
    state.settings[key] = value;
    saveSettings();
    if (key === 'defaultModel') utils.showNotification(`Model changed to ${value}`, 'info');
}

function debounce(func, wait) {
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
}

const addChangeListener = (id, key, type, transform = (v) => v) => {
    const element = document.getElementById(id);
    if (!element) {
        console.warn(`Element with ID '${id}' not found`);
        return;
    }
    element.addEventListener(type, (e) => {
        const value = transform(e.target[type === 'change' && e.target.type === 'checkbox' ? 'checked' : 'value']);
        updateSetting(key, value);
        applySettings(); // Apply changes immediately
        utils.showNotification(`${key} updated`, 'info');
    });
};

addChangeListener('markdownMessages', 'markdownMessages', 'change');
addChangeListener('wrapCodeLines', 'wrapCodeLines', 'change');
addChangeListener('highContrast', 'highContrast', 'change');
addChangeListener('reducedMotion', 'reducedMotion', 'change');
addChangeListener('fontSizeInput', 'fontSize', 'input', parseInt);
addChangeListener('autoOpenSearch', 'autoOpenSearch', 'change');
addChangeListener('followUpSuggestions', 'followUpSuggestions', 'change');
addChangeListener('autoDetectURLs', 'autoDetectURLs', 'change');
addChangeListener('autoScroll', 'autoScroll', 'change');
addChangeListener('confirmDelete', 'confirmDelete', 'change');
addChangeListener('typingSpeed', 'typingSpeed', 'input', parseInt);
addChangeListener('modelSelect', 'defaultModel', 'change');
addChangeListener('webSearchToggle', 'enableWebSearch', 'change');
addChangeListener('codeExecToggle', 'enableCodeExecution', 'change');
addChangeListener('voiceOutputToggle', 'enableVoiceOutput', 'change');
addChangeListener('tempInput', 'temperature', 'input', parseFloat);
addChangeListener('maxTokensInput', 'maxTokens', 'input', parseInt);

document.querySelectorAll('.response-grid input[name="responseStyle"]').forEach(radio => {
    radio.addEventListener('change', (e) => {
        if (e.target.checked) {
            updateSetting('responseStyle', e.target.value);
            elements.customInstructionsContainer.style.display = 'block';
            const existingInstructions = state.settings.customInstructions?.[e.target.value] || '';
            elements.customInstructionsInput.value = existingInstructions;
            state.currentResponseStyle = e.target.value;
        }
    });
});

elements.saveCustomInstructionsBtn.addEventListener('click', () => {
    const instructions = elements.customInstructionsInput.value.trim();
    if (!state.currentResponseStyle) return;
    state.settings.customInstructions = state.settings.customInstructions || {};
    state.settings.customInstructions[state.currentResponseStyle] = instructions;
    saveSettings();
    utils.showNotification('Custom instructions saved!', 'info');
    elements.customInstructionsContainer.style.display = 'none';
});

addChangeListener('customInstruction', 'customInstruction', 'input');
addChangeListener('tempInput', 'temperature', 'input', parseFloat);
addChangeListener('maxTokensInput', 'maxTokens', 'input', parseInt);

elements.micBtn.addEventListener('click', () => {
    if (state.isRecording) voiceManager.stop();
    else voiceManager.start();
});

elements.darkModeBtn.addEventListener('click', () => {
    state.isDarkMode = !state.isDarkMode;
    document.body.classList.toggle('dark-mode', state.isDarkMode);
    localStorage.setItem('darkMode', state.isDarkMode);
    utils.showNotification(`Switched to ${state.isDarkMode ? 'dark' : 'light'} mode.`, 'info');
});

elements.chatContainer.addEventListener('click', (e) => {
    const target = e.target;

    if (target.classList.contains('thread-toggle')) {
        const parentId = target.dataset.id;
        const replies = document.querySelectorAll(`.thread-reply[data-parent-id="${parentId}"]`);
        replies.forEach(reply => reply.style.display = reply.style.display === 'none' ? 'block' : 'none');
        target.textContent = target.textContent === 'Collapse' ? 'Expand' : 'Collapse';
        return;
    }

    const copyBtn = target.closest('.copy-btn');
    if (copyBtn) {
        const messageDiv = copyBtn.closest('.message');
        const content = messageDiv.querySelector('.markdown-body').textContent;
        navigator.clipboard.writeText(content)
            .then(() => utils.showNotification('Text copied to clipboard!', 'info'))
            .catch(err => utils.showNotification('Failed to copy text.', 'error'));
        return;
    }

    const regenerateBtn = target.closest('.regenerate-btn');
    if (regenerateBtn) {
        const messageId = regenerateBtn.dataset.id;
        chatManager.regenerateMessage(messageId);
        return;
    }

    const editBtn = target.closest('.edit-btn');
    if (editBtn) {
        chatManager.editMessage(editBtn.dataset.id);
        return;
    }

    const editAiBtn = target.closest('.edit-ai-btn');
    if (editAiBtn) {
        const messageId = editAiBtn.dataset.id;
        const messageDiv = editAiBtn.closest('.message');
        const contentDiv = messageDiv.querySelector('.markdown-body');
        const originalContent = state.messages.find(m => m.id === messageId).content;
        contentDiv.contentEditable = true;
        contentDiv.classList.add('editable');
        contentDiv.focus();
        contentDiv.addEventListener('blur', async () => {
            contentDiv.contentEditable = false;
            contentDiv.classList.remove('editable');
            const newContent = contentDiv.textContent;
            if (newContent !== originalContent) {
                state.messages.find(m => m.id === messageId).content = newContent;
                await chatManager.saveChat();
                utils.showNotification('Message updated.', 'info');
            }
        }, { once: true });
        return;
    }

    const replyBtn = target.closest('.reply-btn');
    if (replyBtn) {
        const parentId = replyBtn.dataset.id;
        const message = state.messages.find(m => m.id === parentId);
        if (!message) return;

        elements.messageInput.dataset.parentId = parentId;
        elements.inputContainer.classList.add('replying');
        elements.messageInput.focus();

        let replyIndicator = elements.inputContainer.querySelector('.reply-indicator');
        if (!replyIndicator) {
            replyIndicator = document.createElement('div');
            replyIndicator.className = 'reply-indicator';
            elements.inputContainer.insertBefore(replyIndicator, elements.inputContainer.firstChild);
        }
        replyIndicator.textContent = `Replying to: ${message.content.slice(0, 20)}${message.content.length > 20 ? '...' : ''}`;
        return;
    }
});

elements.messageInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        const parentId = elements.messageInput.dataset.parentId;
        chatManager.sendMessage(elements.messageInput.value.trim(), parentId);
        if (parentId) {
            delete elements.messageInput.dataset.parentId;
            elements.inputContainer.classList.remove('replying');
            const replyIndicator = elements.inputContainer.querySelector('.reply-indicator');
            if (replyIndicator) replyIndicator.remove();
        }
    }
});

elements.messageInput.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && elements.messageInput.dataset.parentId) {
        delete elements.messageInput.dataset.parentId;
        elements.inputContainer.classList.remove('replying');
        const replyIndicator = elements.inputContainer.querySelector('.reply-indicator');
        if (replyIndicator) replyIndicator.remove();
    }
});

document.addEventListener('click', (e) => {
    if (!elements.inputContainer.contains(e.target) && elements.messageInput.dataset.parentId) {
        delete elements.messageInput.dataset.parentId;
        elements.inputContainer.classList.remove('replying');
        const replyIndicator = elements.inputContainer.querySelector('.reply-indicator');
        if (replyIndicator) replyIndicator.remove();
    }
});

elements.chatContainer.addEventListener('scroll', () => {
    const scrollOffset = elements.chatContainer.scrollTop;
    const isScrolledUp = scrollOffset < elements.chatContainer.scrollHeight - elements.chatContainer.clientHeight - 0;
    elements.scrollToBottomBtn.style.display = isScrolledUp ? 'flex' : 'none';
});

elements.scrollToBottomBtn.addEventListener('click', utils.scrollToBottom);

elements.exampleButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        elements.messageInput.value = btn.dataset.prompt;
        chatManager.sendMessage(elements.messageInput.value);
    });
});

let searchTimeout;
elements.historySearch.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase().trim();
    chatManager.updateHistoryList(searchTerm);
});

// [Previous code remains unchanged up to the last complete event listener...]

// Event listeners continued
elements.clearHistoryBtn.addEventListener('click', chatManager.clearHistory);

elements.sortToggleBtn.addEventListener('click', () => {
    state.sortMode = state.sortMode === 'date' ? 'alpha' : 'date';
    chatManager.updateHistoryList();
    utils.showNotification(`Sorted by ${state.sortMode === 'date' ? 'date' : 'alphabetical order'}`, 'info');
});

elements.messageInput.addEventListener('focus', () => {
    if (state.settings.showSuggestions && state.latestSuggestions?.length > 0) {
        utils.displaySuggestions();
        elements.suggestionsContainer.style.display = 'flex';
    }
});

elements.messageInput.addEventListener('blur', () => {
    setTimeout(() => {
        if (!elements.suggestionsContainer.contains(document.activeElement)) {
            elements.suggestionsContainer.style.display = 'none';
        }
    }, 100);
});

elements.suggestionsToggle.addEventListener('change', (e) => {
    state.settings.showSuggestions = e.target.checked;
    if (!state.settings.showSuggestions) {
        elements.suggestionsContainer.style.display = 'none';
        state.latestSuggestions = [];
    }
    utils.showNotification(`Suggestions ${state.settings.showSuggestions ? 'enabled' : 'disabled'}`, 'info');
    saveSettings();
});

// Update applySettings to reflect toggle state
function applySettings() {
    // Existing applySettings code...
    elements.suggestionsToggle.checked = state.settings.showSuggestions;
    suggestionToggleBtn.classList.toggle('active', state.settings.showSuggestionsOnFocus); // Keep existing toggle in sync
}

// DOM Content Loaded with Sidebar Profile Completion
document.addEventListener('DOMContentLoaded', () => {
    // Sidebar Profile Section
    const profileSection = document.createElement('div');
    profileSection.id = 'sidebar-profile';
    profileSection.innerHTML = `
        <div class="profile-item">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
            </svg>
            <span id="profile-name">${state.user ? state.user.email.split('@')[0] : 'Guest'}</span>
        </div>
    `;
    elements.sidebar.insertBefore(profileSection, elements.sidebar.firstChild);

    // New Event Listeners for Added Features
    elements.collabShareBtn.addEventListener('click', chatManager.shareChatLive);
    elements.analyticsBtn.addEventListener('click', () => {
        utils.showNotification(
            `Analytics: Chats: ${state.analytics.chatsCreated}, Messages: ${state.analytics.messagesSent}, API Calls: ${state.analytics.apiCalls}`,
            'info'
        );
    });

    // Settings listeners
    elements.modelSelect.addEventListener('change', (e) => updateSetting('defaultModel', e.target.value));
    elements.webSearchToggle.addEventListener('change', (e) => updateSetting('enableWebSearch', e.target.checked));
    elements.codeExecToggle.addEventListener('change', (e) => updateSetting('enableCodeExecution', e.target.checked));
    elements.voiceOutputToggle.addEventListener('change', (e) => updateSetting('enableVoiceOutput', e.target.checked));

    // Load shared chat from URL if present
    const urlParams = new URLSearchParams(window.location.search);
    const shareId = urlParams.get('shareId');
    if (shareId) chatManager.loadSharedChat(shareId);

    // Apply initial settings
    applySettings();
    adjustChatContainerPadding();
    adjustSidebarButtons();

    // Initialize API key reset
    chatManager.resetApiKeyUsage();
});

// Additional Helper Functions
function adjustChatContainerPadding() {
    if (window.innerWidth <= 768) {
        elements.chatContainer.style.padding = state.currentChatId ? '16px' : '16px';
    } else {
        elements.chatContainer.style.padding = state.currentChatId ? '24px calc(50% - 350px)' : '0 calc(50% - 350px)';
        elements.chatContainer.style.paddingTop = state.currentChatId ? '84px' : '0';
    }
}

function adjustSidebarButtons() {
    const isMobile = window.innerWidth <= 768;
    elements.clearHistoryBtn.style.display = isMobile ? 'none' : 'flex';
    const toggleSidebarMobile = document.getElementById('toggleSidebarMobile');
    if (toggleSidebarMobile) toggleSidebarMobile.style.display = isMobile ? 'flex' : 'none';
}

// Ensure all remaining code from previous sections is included (no truncation)
chatManager.resetApiKeyUsage();

// Final Initialization
console.log('Zeta AI initialized on', new Date().toLocaleString());