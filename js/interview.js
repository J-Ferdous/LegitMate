        // DOM Elements
        const DOM = {
            chatWindow: document.getElementById('chat-window'),
            userInput: document.getElementById('user-input'),
            sendButton: document.getElementById('send-button'),
            micButton: document.getElementById('mic-button'),
            clearChat: document.getElementById('clear-chat'),
            suggestQuestions: document.getElementById('suggest-questions'),
            quickActionBtns: document.querySelectorAll('.quick-action-btn')
        };

        // YouTube Video Suggestions
        const YOUTUBE_VIDEO_SUGGESTIONS = {
            "general": [
                { title: "The Art of the Interview: How to Prepare & Succeed", url: "https://youtu.be/ppf9j8x0LA8?si=13xmCXsTSVCwWC7L" },
                { title: "20 Common Interview Questions and How to Answer Them", url: "https://youtu.be/BoZpcibb-JI?si=_X4GwwQDmz6c3UUo" }
            ],
            "tell me about yourself": [
                { title: "How to Answer 'Tell Me About Yourself' (Perfect Pitch)", url: "https://youtu.be/XNAIDss2Slc?si=6QoxIBaNuXGKerFx" },
                { title: "The Best Way to Answer 'Tell Me About Yourself'", url: "https://youtu.be/TMIuybN-XVI?si=rOleIZOoEEW3BDzO" }
            ],
            "strengths": [
                { title: "How to Answer 'What Are Your Greatest Strengths?'", url: "https://youtu.be/gCJsGsZ3hhU?si=NAXrCppD3yUIP95o" },
                { title: "Identifying Your Top Professional Strengths", url: "https://youtu.be/gCJsGsZ3hhU?si=_bc0ci8qIGWe0LFq" }
            ],
            "weakness": [
                { title: "How to Answer 'What is Your Greatest Weakness?'", url: "https://youtu.be/pmWEePmqdLk?si=NtiL17-1MbNiCEsK" },
                { title: "Turning Weaknesses into Strengths (Interview Tip)", url: "https://youtube.com/shorts/9ChypLPsuIM?si=3-Ssw1QpS7rM49Ig" }
            ],
            "why us": [
                { title: "How to Answer 'Why Do You Want To Work Here?'", url: "https://youtu.be/6OW2QIzg4VI?si=IAL70c4QcYRRW-Xe" },
                { title: "Researching Companies for Interview Success", url: "https://youtu.be/GlFBUudaA0s?si=JSByD8_FC7TMHpqA" }
            ],
            "why this role": [
                { title: "Why are you interested in this role? (Best Answer)", url: "https://youtu.be/XnCYh4DRaeQ?si=P4b4yG_jxCspAO1X" }
            ],
            "star method": [
                { title: "STAR Method Explained (Situation, Task, Action, Result)", url: "https://youtu.be/uQEuo7woEEk?si=Ti-Q-6pIkpl34WEe" },
                { title: "Behavioral Interview Questions: STAR Method Examples", url: "https://youtu.be/2uM7gYuOvr4?si=Inh82_kcIFHMAaHI" }
            ],
            "behavioral questions": [
                { title: "Top 10 Behavioral Interview Questions & Answers", url: "https://www.youtube.com/watch?v=W3o80eR879E" },
                { title: "Mastering Behavioral Interviews with STAR", url: "https://www.youtube.com/watch?v=Tg_vS_R9y1c" }
            ],
            "conflict": [
                { title: "How to Answer: 'Tell Me About a Conflict'", url: "https://youtu.be/CgZRtOLwcS8?si=g8llkxPXC-Y379ZH" }
            ],
            "challenge": [
                { title: "How to Answer: 'Tell Me About a Challenge You Faced'", url: "https://youtu.be/FHJRwUsVIkI?si=3WcLF8vpwjBx4Gop" }
            ],
            "failure": [
                { title: "How to Answer: 'Tell Me About a Time You Failed'", url: "https://youtu.be/YuVqJZqxJJY?si=z-mFh9bGwjh0ixa-" }
            ],
            "teamwork": [
                { title: "How to Answer: 'Describe a Teamwork Experience'", url: "https://youtu.be/6zuFtWNFs_s?si=ERdphJoisxAHJezS" }
            ],
            "where do you see yourself": [
                { title: "How to Answer 'Where Do You See Yourself in 5 Years?'", url: "https://youtu.be/tt4TF1wqz9U?si=S_KJ5qKYXPZVv5Ol" }
            ],
            "career goals": [
                { title: "Discussing Your Career Goals in an Interview", url: "https://youtu.be/z3L-i6ROQec?si=8xZVeJOkIGD01qsA" }
            ],
            "system design": [
                { title: "System Design Interview Crash Course", url: "https://youtu.be/L9TfZdODuFQ?si=dw57WoIv3D_a0j_j" },
                { title: "Grokking System Design Interview: Pointers", url: "https://youtu.be/w8xZkx-4wFo?si=h3y6NiX8olqxgv-d" }
            ],
            "coding interview": [
                { title: "How to Ace the Coding Interview: Full Guide", url: "https://youtu.be/Q4C3ZRJLnac?si=37D_4AOJmbcXHdSQ" },
                { title: "Data Structures & Algorithms for Interview Prep", url: "https://youtu.be/PG4t_6qjxz0?si=H-n3p0auh23WRsSC" }
            ],
            "questions to ask": [
                { title: "Best Questions to Ask in an Interview (Turn the Tables!)", url: "https://youtu.be/jzqOLoorgOs?si=biPMTHSqM37hUO7f" },
                { title: "Smart Questions to Ask Interviewers", url: "https://youtu.be/5-cba5niZs8?si=Su8TwJNZV3W9KYCN" }
            ],
            "salary expectation": [
                { title: "How to Answer 'What Are Your Salary Expectations?'", url: "https://youtu.be/Qhr7Cy7YLrM?si=iZn5bF_7fodk37fL" }
            ],
            "thank you note": [
                { title: "How to Write a Perfect Interview Thank You Note", url: "https://youtu.be/gSbV3q_MMbg?si=Q5XZC60OB9I_e1Ca" }
            ]
        };

        // Interview Prompts
        const interviewPrompts = [
            {
                keywords: ["hi", "hello", "hey"],
                response: "Hello there! I'm your Interview Prep Assistant. What interview question or topic would you like to discuss today?",
                videos: YOUTUBE_VIDEO_SUGGESTIONS["general"]
            },
            {
                keywords: ["tell me about yourself", "introduce yourself", "about you"],
                response: "This is your chance to shine! Craft a concise, compelling narrative (1-2 minutes) that connects your past experience to the role. Focus on a 'present, past, future' structure, highlighting relevant skills and achievements.",
                videos: YOUTUBE_VIDEO_SUGGESTIONS["tell me about yourself"]
            },
            {
                keywords: ["strengths", "best qualities", "what are your strengths"],
                response: "Identify 2-3 key strengths directly applicable to the job description. Provide concrete examples using the STAR method (Situation, Task, Action, Result) to illustrate how you've demonstrated these strengths and the positive outcomes you achieved.",
                videos: YOUTUBE_VIDEO_SUGGESTIONS["strengths"]
            },
            {
                keywords: ["weakness", "greatest challenge", "areas for improvement", "what is your greatest weakness"],
                response: "Choose a genuine weakness, but one that is not critical to the job and that you are actively working to improve. Frame it positively by focusing on the steps you're taking for growth and what you've learned. Avoid clichés or disguised strengths.",
                videos: YOUTUBE_VIDEO_SUGGESTIONS["weakness"]
            },
            {
                keywords: ["why us", "why this company", "why here", "why legitmate"],
                response: "Show genuine enthusiasm and specific knowledge about the company. Research their mission, values, recent projects, culture, and achievements. Explain how your values align with theirs and how your skills can directly contribute to their success.",
                videos: YOUTUBE_VIDEO_SUGGESTIONS["why us"]
            },
            {
                keywords: ["why this role", "why this job", "interested in this position"],
                response: "Clearly articulate your passion for the role and how it aligns with your career aspirations. Highlight specific aspects of the job description that excite you and explain how your skills and experiences make you a perfect fit.",
                videos: YOUTUBE_VIDEO_SUGGESTIONS["why this role"]
            },
            {
                keywords: ["star method", "behavioral questions", "situational questions", "describe a time when"],
                response: "The STAR method (Situation, Task, Action, Result) is indispensable for behavioral questions. It helps you structure your answers into compelling stories. Always aim to provide quantifiable results where possible. Think of examples for common themes like teamwork, conflict, overcoming challenges, and leadership.",
                videos: YOUTUBE_VIDEO_SUGGESTIONS["star method"].concat(YOUTUBE_VIDEO_SUGGESTIONS["behavioral questions"])
            },
            {
                keywords: ["conflict", "disagreement", "difficult person"],
                response: "When discussing conflict, use the STAR method. Focus on your professional actions to resolve the situation, your communication skills, and the positive outcome or learning experience. Emphasize problem-solving, not blame.",
                videos: YOUTUBE_VIDEO_SUGGESTIONS["conflict"]
            },
            {
                keywords: ["challenge", "difficult situation", "obstacle"],
                response: "Describe a significant professional challenge you faced. Use the STAR method to explain the situation, your role, the actions you took to overcome it, and the positive results or lessons learned. This showcases your problem-solving and resilience.",
                videos: YOUTUBE_VIDEO_SUGGESTIONS["challenge"]
            },
            {
                keywords: ["failure", "mistake", "regret"],
                response: "It's okay to discuss a professional failure, but focus on the valuable lessons learned and how you've applied them to avoid similar mistakes in the future. Demonstrate self-awareness and a growth mindset.",
                videos: YOUTUBE_VIDEO_SUGGESTIONS["failure"]
            },
            {
                keywords: ["teamwork", "collaboration"],
                response: "Share an example where you successfully collaborated with a team. Highlight your contributions, how you supported others, resolved differences, and worked together to achieve a common goal. Use the STAR method.",
                videos: YOUTUBE_VIDEO_SUGGESTIONS["teamwork"]
            },
            {
                keywords: ["where do you see yourself", "career goals", "future plans"],
                response: "Align your 3-5 year career goals with the opportunities the company offers. Show ambition and a desire for growth within the organization, demonstrating that you've thought about your trajectory and how this role fits into it.",
                videos: YOUTUBE_VIDEO_SUGGESTIONS["where do you see yourself"].concat(YOUTUBE_VIDEO_SUGGESTIONS["career goals"])
            },
            {
                keywords: ["system design", "design interview", "architectural interview"],
                response: "System design interviews evaluate your ability to create scalable, reliable, and maintainable systems. Focus on clarifying requirements, high-level design, component breakdown, trade-offs, and scaling considerations. Practice common systems like URL shorteners, news feeds, or chat apps.",
                videos: YOUTUBE_VIDEO_SUGGESTIONS["system design"]
            },
            {
                keywords: ["coding interview", "technical challenge", "data structures", "algorithms"],
                response: "Mastering data structures and algorithms is key. Practice extensively on platforms like LeetCode. During the interview, think out loud, clarify constraints, consider edge cases, and test your solution. Don't be afraid to ask clarifying questions!",
                videos: YOUTUBE_VIDEO_SUGGESTIONS["coding interview"]
            },
            {
                keywords: ["questions to ask", "my questions", "do you have any questions"],
                response: "Always have thoughtful questions prepared! This shows your engagement and interest. Ask about team culture, growth opportunities, company challenges, or how success is measured in the role. Avoid asking about salary or benefits until an offer is made.",
                videos: YOUTUBE_VIDEO_SUGGESTIONS["questions to ask"]
            },
            {
                keywords: ["salary expectation", "compensation", "pay"],
                response: "Research industry averages for your role, experience, and location. It's often strategic to provide a range rather than a fixed number. If possible, try to defer the exact discussion until later stages when you have a clearer understanding of the role's full scope.",
                videos: YOUTUBE_VIDEO_SUGGESTIONS["salary expectation"]
            },
            {
                keywords: ["thank you note", "follow up", "post interview"],
                response: "Send a personalized thank-you note within 24 hours of your interview. Reiterate your interest in the role, briefly mention something specific you discussed, and thank them for their time. This reinforces your professionalism.",
                videos: YOUTUBE_VIDEO_SUGGESTIONS["thank you note"]
            },
            {
                keywords: ["culture", "work environment", "team dynamic"],
                response: "When asking about culture, probe into specific examples. 'How does the team celebrate successes?' or 'What's the typical decision-making process?' can reveal more than generic questions. For answering, emphasize your adaptability and collaborative spirit.",
                videos: YOUTUBE_VIDEO_SUGGESTIONS["questions to ask"]
            }
        ];

        // Toggle mobile menu
        function toggleMenu() {
            const nav = document.querySelector('nav');
            nav.classList.toggle('active');
        }

        // Auto-resize textarea
        DOM.userInput.addEventListener('input', function() {
            this.style.height = 'auto';
            this.style.height = (this.scrollHeight) + 'px';
        });

        // Add message to chat
        function appendMessage(sender, text, videos = []) {
            const messageDiv = document.createElement('div');
            messageDiv.classList.add('chat-message', `${sender}-message`);

            const paragraph = document.createElement('p');
            paragraph.innerHTML = text;
            messageDiv.appendChild(paragraph);

            // Add timestamp
            const timeDiv = document.createElement('div');
            timeDiv.classList.add('message-time');
            const now = new Date();
            timeDiv.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            messageDiv.appendChild(timeDiv);

            if (videos.length > 0) {
                const videoList = document.createElement('ul');
                videoList.classList.add('video-suggestions');
                const header = document.createElement('p');
                header.innerHTML = '<br><strong>Recommended Video Resources:</strong>';
                messageDiv.appendChild(header);
                
                videos.forEach(video => {
                    const listItem = document.createElement('li');
                    listItem.innerHTML = `<a href="${video.url}" target="_blank" rel="noopener noreferrer"><i class="fab fa-youtube"></i> ${video.title}</a>`;
                    videoList.appendChild(listItem);
                });
                messageDiv.appendChild(videoList);
            }

            DOM.chatWindow.appendChild(messageDiv);
            DOM.chatWindow.scrollTop = DOM.chatWindow.scrollHeight;
        }

        // Show typing indicator
        function showTypingIndicator() {
            const typingDiv = document.createElement('div');
            typingDiv.classList.add('typing-indicator');
            typingDiv.id = 'typing-indicator';
            
            for (let i = 0; i < 3; i++) {
                const dot = document.createElement('div');
                dot.classList.add('typing-dot');
                typingDiv.appendChild(dot);
            }
            
            DOM.chatWindow.appendChild(typingDiv);
            DOM.chatWindow.scrollTop = DOM.chatWindow.scrollHeight;
        }

        // Remove typing indicator
        function removeTypingIndicator() {
            const typingIndicator = document.getElementById('typing-indicator');
            if (typingIndicator) {
                typingIndicator.remove();
            }
        }

        // Get bot response
        async function getBotResponse(userMessage) {
            const lowerCaseMessage = userMessage.toLowerCase().trim();
            let botResponseText = "";
            let suggestedVideos = [];

            // Try to find a matching prompt
            const matchedPrompt = interviewPrompts.find(prompt =>
                prompt.keywords.some(keyword => lowerCaseMessage.includes(keyword))
            );

            if (matchedPrompt) {
                botResponseText = matchedPrompt.response;
                suggestedVideos = matchedPrompt.videos;
            } else {
                botResponseText = "I'm still learning, but I can offer some general advice. Could you try rephrasing your question or ask about common topics like 'Tell me about yourself', 'STAR method', 'Weakness', 'System Design', or 'Salary expectations'?";
                suggestedVideos = YOUTUBE_VIDEO_SUGGESTIONS["general"];
            }

            // Simulate processing time
            await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));
            
            removeTypingIndicator();
            appendMessage('bot', botResponseText, suggestedVideos);
        }

        // Send message function
        function sendMessage() {
            const userMessage = DOM.userInput.value.trim();
            if (userMessage) {
                appendMessage('user', userMessage);
                DOM.userInput.value = '';
                DOM.userInput.style.height = 'auto';
                
                showTypingIndicator();
                getBotResponse(userMessage);
            }
        }

        // Event Listeners
        DOM.sendButton.addEventListener('click', sendMessage);
        
        DOM.userInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        });

        DOM.clearChat.addEventListener('click', () => {
            DOM.chatWindow.innerHTML = '';
            appendMessage('bot', "Hello! I'm your Interview Prep Assistant. What interview question or topic would you like to prepare for today?", YOUTUBE_VIDEO_SUGGESTIONS["general"]);
        });

        DOM.suggestQuestions.addEventListener('click', () => {
            appendMessage('bot', "Here are some common interview questions you might want to practice:<br><br>" +
                "• Tell me about yourself<br>" +
                "• What are your strengths?<br>" +
                "• What is your greatest weakness?<br>" +
                "• Why do you want to work here?<br>" +
                "• Where do you see yourself in 5 years?<br>" +
                "• Tell me about a time you faced a challenge<br>" +
                "• How do you handle conflict?<br>" +
                "• What are your salary expectations?<br>" +
                "• Do you have any questions for us?");
        });

        // Quick action buttons
        DOM.quickActionBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const question = btn.getAttribute('data-question');
                DOM.userInput.value = question;
                sendMessage();
            });
        });

        // Voice recognition
        let recognition = null;
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            recognition = new SpeechRecognition();
            recognition.continuous = false;
            recognition.interimResults = false;
            
            recognition.onstart = function() {
                DOM.micButton.classList.add('listening');
            };
            
            recognition.onresult = function(event) {
                const transcript = event.results[0][0].transcript;
                DOM.userInput.value = transcript;
                DOM.micButton.classList.remove('listening');
            };
            
            recognition.onerror = function() {
                DOM.micButton.classList.remove('listening');
            };
            
            recognition.onend = function() {
                DOM.micButton.classList.remove('listening');
            };
            
            DOM.micButton.addEventListener('click', () => {
                if (DOM.micButton.classList.contains('listening')) {
                    recognition.stop();
                } else {
                    recognition.start();
                }
            });
        } else {
            DOM.micButton.style.display = 'none';
        }

        // Initialize the page
        window.addEventListener('load', () => {
            DOM.userInput.focus();
        });
