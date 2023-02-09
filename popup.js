// https://developers.google.com/web/updates/2013/01/Voice-Driven-Web-Apps-Introduction-to-the-Web-Speech-API
// https://jsfiddle.net/pi_null_mezon/ko66g88x/

let hidePreviewTimer = null;

let preview = document.createElement("div");
preview.id = "preview";
document.body.appendChild(preview);

const style = document.createElement('style');
style.textContent = `
  #preview {
  font-family: source-code-pro,Menlo,Monaco,Consolas,Courier New,monospace;
  font-size: 36px;
  position: absolute;
  display: none;
  font-weight: light;
  color: white;
  top: 20px;
  left: 20px;
  background: rgba(0, 0, 0, 0.8);
  padding: 10px;
}
#preview.complete {
      background: rgba(18, 84, 0, 0.9);
}`;
document.head.append(style);

function showPreview() {
      preview.style.display = "block";
}

function hidePreview() {
      preview.style.display = "none";
}

function onComplete(command) {
  document.querySelector("form textarea").value = "Answer in one sentence: " + command;
  document.querySelector("form button").click();
}

function startRecognizer() {
    
  if ('webkitSpeechRecognition' in window) {
    
    var recognition = new webkitSpeechRecognition();
    // Option, false is meaning that when the user stops talking, speech recognition will end
    recognition.continuous = true;
    recognition.lang = 'en-US';
    recognition.interimResults = true;

    recognition.onresult = function (event) {
      clearInterval(hidePreviewTimer);
      var result = event.results[event.resultIndex];
      if (result.isFinal) {
        preview.innerHTML = `${result[0].transcript}`; //alert('Вы продикотвали: ' + result[0].transcript);
        preview.className = 'complete';
        hidePreviewTimer = setTimeout(hidePreview, 2000);
        onComplete(result[0].transcript);
      } else {
        preview.className = '';
        preview.innerHTML = `${result[0].transcript}`;
      }
      showPreview();
    };

    recognition.onstart = function() {
    }

    recognition.onend = function() {
      console.log('Recognition completed.');
      startRecognizer();
    };

    speechSynthesis.speak(new SpeechSynthesisUtterance('Start dictating text:'));
    recognition.start();

  } else {
        alert('webkitSpeechRecognition is not supported by your browser, please use Google Chrome or Mozilla Firefox');
  }
}

startRecognizer();
