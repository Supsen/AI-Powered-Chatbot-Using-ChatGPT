document.addEventListener('DOMContentLoaded', () => {
    const toggleBtn = document.getElementById('toggleBtn');
    const searchBtn = document.getElementById('searchBtn');
    const newChatBtn = document.getElementById('newChatBtn');
    const authButton = document.getElementById('authButton');
    const settingsBtn = document.getElementById('settingsBtn');
    const themeToggle = document.getElementById('themeToggle');
    const dropdown = document.getElementById('dropdown');
    const sidebar = document.getElementById('sidebar');
    const themeText = document.getElementById('themeText');
    const themeIcon = document.getElementById('themeIcon');

    const header = document.getElementById('header');
    const prompt = document.getElementById('prompt');

    toggleBtn.addEventListener('click', toggleSidebar);
    settingsBtn.addEventListener('click', toggleDropdown);
    authButton.addEventListener('click', toggleAuthState);
    themeToggle.addEventListener('click', toggleTheme);

    // Sidebar Toggle
    function toggleSidebar() {
        const sidebar = document.getElementById('sidebar');
        sidebar.classList.toggle('closed');
    }

    // Dropdown Toggle
    function toggleDropdown() {
        const dropdown = document.getElementById('dropdown');
        dropdown.classList.toggle('active');
    }

    // Theme Toggle
    function toggleTheme() {
        const isLightMode = document.body.classList.toggle('light-mode');
        document.getElementById('themeText').textContent = isLightMode ? 'Dark' : 'Light';
        document.getElementById('themeIcon').className = isLightMode ? 'fas fa-moon' : 'fas fa-sun';
        document.getElementById('sidebar').classList.toggle('light-mode', isLightMode);

        // Store the theme preference
        localStorage.setItem('theme', isLightMode ? 'light-mode' : 'dark-mode');
    }

    // Apply stored theme on page load
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme === 'light-mode') {
        document.body.classList.add('light-mode');
        document.getElementById('sidebar').classList.add('light-mode');
        document.getElementById('themeText').textContent = 'Dark';
        document.getElementById('themeIcon').className = 'fas fa-moon';
    }

    // Close dropdown when clicking outside or when sidebar is closed
    document.addEventListener('click', (event) => {
        const dropdown = document.getElementById('dropdown');
        if (!dropdown.contains(event.target) && !event.target.matches('.settings-btn')) {
            dropdown.classList.remove('active');
        }
    });

    document.getElementById('sidebar').addEventListener('transitionend', () => {
        const dropdown = document.getElementById('dropdown');
        if (dropdown && document.getElementById('sidebar').classList.contains('closed')) {
            dropdown.classList.remove('active');
        }
    });

    // Auth State Toggle
    function toggleAuthState() {
        const authButton = document.getElementById('authButton');
        const authText = document.getElementById('authText');
        const authIcon = document.getElementById('authIcon');
        const isLoggedIn = authText.textContent === 'Logout';

        authText.textContent = isLoggedIn ? 'Login' : 'Logout';
        authIcon.className = isLoggedIn ? 'fas fa-sign-in-alt' : 'fas fa-sign-out-alt';
        authButton.classList.toggle('login-btn', isLoggedIn);
    }

    // ChatBox Behavior
    const chatBox = document.getElementById('chatBox');
    const sendBtn = document.getElementById('sendBtn');
    const messageInput = document.getElementById('messageInput');
    const messagesContainer = document.getElementById('chatMessages');
    const chatArea = document.getElementById('chatArea'); 
    const chatMessages = document.getElementById('chatMessages');

    // // Event listener for send button click
    // sendBtn.addEventListener('click', () => {
    //     chatBox.classList.add('active');
    //     chatArea.classList.add('active');
    //     chatMessages.classList.add('active');

    //     // Remove header and prompt elements
    //     const header = document.getElementById('header');
    //     const prompt = document.getElementById('prompt');
    //     if (header) header.remove();
    //     if (prompt) prompt.remove();
    // });

    // // Enable or disable send button based on input
    // messageInput.addEventListener('input', () => {
    //     sendBtn.disabled = !messageInput.value.trim();
    // });

    // Add a message to the chat interface
    function addMessage(content, className) {
        const messageDiv = document.createElement('div');
        messageDiv.className = className;
        messageDiv.textContent = content;
        messagesContainer.appendChild(messageDiv); 
        messagesContainer.scrollTop = messagesContainer.scrollHeight; // Scroll to the bottom
    }

    // Handle sending a message (Function sendMessage())
    async function sendMessage() {
        const userMessage = messageInput.value.trim();
        if (!userMessage) return;

        // Add the user's message to the chat
        addMessage(userMessage, 'message user-message');
        messageInput.value = ''; // Clear the input field
        sendBtn.disabled = true; // Disable send btn

        // loading indicator to the chat
        const loadingDiv = document.createElement('div');
        loadingDiv.className = 'message bot-message';
        loadingDiv.textContent = 'typing...';

        setTimeout(() => {
            if (loadingDiv.parentNode) {
                loadingDiv.textContent = 'Still thinking...';
            }
        }, 5000); // 5 seconds

        messagesContainer.appendChild(loadingDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight; // Scroll to the bottom

        try {
            const response = await fetch('/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt: userMessage }),
            });

            if (response.ok) {
                const data = await response.json();
                const botMessage = data.choices[0].message.content;
                loadingDiv.remove(); // Remove the loading spinner
                addMessage(botMessage, 'message bot-message');
            } else {
                loadingDiv.remove(); // Remove the loading spinner
                addMessage('Error: Unable to fetch response.', 'message bot-message');
            }
        } catch (error) {
            console.error('Error:', error);
            loadingDiv.remove(); // Remove the loading spinner
            addMessage('Error: Something went wrong.', 'message bot-message');
        }
    }
    // Reset ChatArea
    newChatBtn.addEventListener('click', () => { 
        location.reload(); 
    });

    // Handle User Input, Button validation
    let isFirstSend = true;

    sendBtn.addEventListener('click', () => {
        if(messageInput.value.trim() === ''){
            return;
        } else {
            handleFirstSend(); // call function for first time send
            sendMessage();
        }
    });

    messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();

            //Prevent empty textbox
            if(messageInput.value.trim() === ''){
                return;
            }

            if(isFirstSend) {
                handleFirstSend(); 
            }
            sendMessage(); 
        }
    });

    function handleFirstSend() {
        // call active class for chat elements
        chatBox.classList.add('active');
        chatArea.classList.add('active');
        chatMessages.classList.add('active');

        // Remove header and prompt elements
        if (header) header.remove();
        if (prompt) prompt.remove();

        isFirstSend = false; // mark first send as completed
    }
});