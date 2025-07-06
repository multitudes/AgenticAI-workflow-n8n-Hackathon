document.addEventListener('DOMContentLoaded', () => {
  let scenarioNumber = 0;
  const chatBox = document.getElementById('chatBox');
  const chatHistory = [];
  const sessionId = Math.random().toString(36).substring(2);
  let mediaRecorder;
  let audioChunks = [];
  let isDarkMode = true;

  function toggleTheme() {
    const body = document.body;
    const themeButton = document.getElementById('theme-toggle');
    body.classList.toggle('day-mode');
    themeButton.innerHTML = isDarkMode ? '🌙' : '☀️';
    isDarkMode = !isDarkMode;
  }

  function showSection(id) {
    document.querySelectorAll('.section').forEach(s => s.classList.remove('visible'));
    document.getElementById(id).classList.add('visible');
  }

  function addMessage(text, isUser) {
    const messageClass = isUser ? 'user' : 'llm';
    const prefix = isUser ? 'You: ' : '';
    chatBox.innerHTML += `<div class='message ${messageClass}'>${prefix}${text}</div>`;
    chatBox.scrollTop = chatBox.scrollHeight;
    chatHistory.push({ role: isUser ? 'user' : 'llm', text: text });
  }

  window.startScenario = async function(num) {
    scenarioNumber = num;
    showSection('conversationSection');
    chatBox.innerHTML = '';
    chatHistory.length = 0;
    addMessage("Connection successful.", false);
    document.getElementById('recordButton').style.display = 'inline-block';
    document.getElementById('stopButton').style.display = 'none';
  }

  window.startRecording = function() {
    navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
      mediaRecorder = new MediaRecorder(stream);
      audioChunks = [];
      mediaRecorder.ondataavailable = e => audioChunks.push(e.data);
      mediaRecorder.onstop = sendAudio;
      mediaRecorder.start();
      document.getElementById('recordButton').style.display = 'none';
      document.getElementById('stopButton').style.display = 'inline-block';
    }).catch(e => alert("Mic error: " + e.message));
  }

  window.stopRecording = function() {
    if (mediaRecorder) mediaRecorder.stop();
    document.getElementById('recordButton').style.display = 'inline-block';
    document.getElementById('stopButton').style.display = 'none';
  }

  async function sendAudio() {
    const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
    const formData = new FormData();
    formData.append('userAudio', audioBlob);
    formData.append('sessionId', sessionId);
    formData.append('scenario', scenarioNumber);

    addMessage("🎤 [voice message sent]", true);

    try {
      const response = await fetch('/webhook/audio', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();
      if (data.reply) addMessage(data.reply, false);

      if (data.replyAudio) {
        const audio = new Audio(data.replyAudio);
        audio.play();
      }
    } catch (error) {
      console.error('Error:', error);
      addMessage("❌ Voice message failed", false);
    }
  }

  window.sendMessage = async function() {
    const input = document.getElementById('userInput');
    const message = input.value.trim();
    if (!message) return;

    addMessage(message, true);
    input.value = '';

    try {
      const response = await fetch('/webhook/audio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: message,
          sessionId: sessionId,
          scenario: scenarioNumber
        })
      });

      const data = await response.json();
      if (data.reply) addMessage(data.reply, false);

      if (data.replyAudio) {
        const audio = new Audio(data.replyAudio);
        audio.play();
      }
    } catch (error) {
      console.error('Error:', error);
      addMessage("❌ Text message failed", false);
    }
  }

  window.endConversation = function() {
    fetch('/evaluate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        scenario: scenarioNumber, 
        history: chatHistory, 
        sessionId: sessionId,
        endCall: true 
      })
    })
    .then(res => res.json())
    .then(data => {
      showSection('evaluationSection');
      document.getElementById('evaluationResults').innerText =
        `Evaluation for Scenario ${scenarioNumber} completed.\nScore: ${data.score}/100\nFeedback: ${data.feedback}`;
    })
    .catch(() => {
      showSection('evaluationSection');
      document.getElementById('evaluationResults').innerText = 'Error retrieving evaluation.';
    });
  }

  window.restart = function() {
    showSection('scenarioSection');
  }
});
