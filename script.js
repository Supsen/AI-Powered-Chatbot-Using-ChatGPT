function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('closed');
}

function toggleDropdown() {
    const dropdown = document.getElementById('dropdown');
    dropdown.classList.toggle('active');
}

function toggleTheme() {
    const isLightMode = document.body.classList.toggle('light-mode');
    const themeText = document.getElementById('themeText');
    const themeIcon = document.getElementById('themeIcon');
    const sidebar = document.getElementById('sidebar');
    
    themeText.textContent = isLightMode ? 'Dark' : 'Light';
    themeIcon.className = isLightMode ? 'fas fa-moon' : 'fas fa-sun';
    
    // Ensure the sidebar gets updated
    if (isLightMode) {
        sidebar.classList.add('light-mode');
    } else {
        sidebar.classList.remove('light-mode');
    }

    // Store the theme preference
    localStorage.setItem('theme', isLightMode ? 'light-mode' : 'dark-mode');
}


// Apply stored theme on page load
document.addEventListener('DOMContentLoaded', () => {
    const storedTheme = localStorage.getItem('theme');
    const sidebar = document.getElementById('sidebar');
    const dropdown = document.getElementById('dropdown');
    const themeText = document.getElementById('themeText');
    const themeIcon = document.getElementById('themeIcon');
    const themeToggle = document.getElementById('themeToggle');

    // Apply stored theme
    if (storedTheme === 'light-mode') {
        document.body.classList.add('light-mode');
        sidebar.classList.add('light-mode');
        themeText.textContent = 'Dark';
        themeIcon.className = 'fas fa-moon';
        themeToggle.checked = true;
    }

    // Close dropdown when clicking outside
    document.addEventListener('click', (event) => {
        if (!dropdown.contains(event.target) && !event.target.matches('.settings-btn')) {
            dropdown.classList.remove('active');
        }
    });

    // Close dropdown when sidebar is closed
    document.getElementById('sidebar').addEventListener('transitionend', () => {
        if (sidebar.classList.contains('closed')) {
            dropdown.classList.remove('active');
        }
    });
});

// Toggle dropdown visibility
function toggleDropdown() {
    const dropdown = document.getElementById('dropdown');
    dropdown.classList.toggle('active');
}

function toggleAuthState() {
    const authButton = document.getElementById('authButton');
    const authIcon = document.getElementById('authIcon');
    const authText = document.getElementById('authText');
    
    if (authText.textContent === 'Logout') {
        // Switch to login state
        authText.textContent = 'Login';
        authIcon.className = 'fas fa-sign-in-alt';
        authButton.classList.add('login-btn'); // Optional: Add a class for login-specific styling
    } else {
        // Switch to logout state
        authText.textContent = 'Logout';
        authIcon.className = 'fas fa-sign-out-alt';
        authButton.classList.remove('login-btn'); // Optional: Remove the login-specific class
    }
}

// Begin ChatBox expan and animation *******************************************
document.addEventListener('DOMContentLoaded', () => {
    const chatMessages = document.getElementById('chatMessages');  
    const sendBtn = document.getElementById('sendBtn');
    const messageInput = document.getElementById('messageInput');

    // Disable send button initially
    sendBtn.disabled = true;

    // Enable or disable the send button based on input
    messageInput.addEventListener('input', () => {
        if (messageInput.value) {
            sendBtn.disabled = false; // Enable the button
        } else {
            sendBtn.disabled = true; // Disable the button
        }
    });

    function sendMessage() {
        const userMessage = messageInput.value.trim();

        if(userMessage) {
            
            // Add user message to chat area
            const userMessageElement = document.createElement('div');
            userMessageElement.className = 'message user-message';
            userMessageElement.textContent = userMessage;

            // Add the message to the chat area
            chatMessages.appendChild(userMessageElement);       

            // Clear the input field
            messageInput.value = '';

            // Simulate a bot response
            setTimeout(() => {
                const botMessageElement = document.createElement('div');
                botMessageElement.className = 'message bot-message';
                botMessageElement.textContent = `Bot said: "${userMessage}"`;
                chatMessages.appendChild(botMessageElement);

                // Scroll to the bottom of the chat area
                chatMessages.scrollTop = chatMessages.scrollHeight;
            }, 1000);
        }
    }
    // Event listener for the send button
    sendBtn.addEventListener('click', sendMessage);

    // Allow pressing Enter to send the message
    // messageInput.addEventListener('keydown', (event) => {
    //     if (event.key === 'Enter' && !event.shiftKey) {
    //         event.preventDefault(); // Prevent a new line in the textarea
    //         sendMessage();
    //     }
    // });
});

// End ChatBox expan and animation *******************************************
