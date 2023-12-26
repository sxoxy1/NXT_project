// HTML에서 요소를 가져옵니다.
const chatContainer = document.getElementById("chat-container");
const textInput = document.getElementById("text-input");
const inputBox = document.getElementById("input-box");
const keywordContainer = document.getElementById("keyword-container");
const loadingElement = document.getElementById("loading");
const chatBotBtn = document.querySelector('.chatBot-btn');
const webContainer = document.querySelector('.web-container');

let isWebContainerOpen = false;
disableLoading();
chatBotBtn.addEventListener('click', () => {
  if (isWebContainerOpen) {
    webContainer.style.bottom = '-1200px';
    isWebContainerOpen = false;
  } else {
    webContainer.style.bottom = '0';
    isWebContainerOpen = true;
  }
});
let isInputBoxVisible = false; // 처음에는 숨겨져 있음
let isChatDisabled = false; // 채팅 활성화 여부를 나타내는 변수

function toggleInputBox(event) {
    if (isInputBoxVisible) {
        hideInputbox();
    } else {
        showInputbox();
    }

    // "기타" 버튼의 기본 동작 중단
    event.preventDefault();
}
//입력창 비활성화
function hideInputbox() {
    inputBox.style.display = "none";
    isInputBoxVisible = false;
}
//입력창 활성화
function showInputbox() {
    inputBox.style.display = "block";
    isInputBoxVisible = true;
}

// 사용자가 엔터 키를 누르면 sendMessage 함수를 호출합니다.
function handleUserInput(event) {
    if (event.key === "Enter") {
        const chatMessage = document.createElement("div");
        addMessage('user',textInput.value);
        request_server(textInput.value,10,'직접 대화');
    }
}

// 채팅 입력창을 비활성화하는 함수
function disableChatInput() {
    isChatDisabled = true;
    textInput.disabled = true;
    textInput.style.backgroundColor = "#4F6D7A"; // 입력창 배경색 변경
    loadingElement.style.display = "block"; 
    console.log(loadingElement.style.display);
}

// 채팅 입력창을 활성화하는 함수
function enableChatInput() {
    isChatDisabled = false;
    textInput.disabled = false;
    textInput.style.backgroundColor = "white"; // 입력창 배경색 초기화
    loadingElement.style.display = "none"; 
    console.log(loadingElement.style.display);
}

// 로딩 비활성화 함수
function disableLoading() {
  loadingElement.style.display = "none"; 
}

// 로딩 활성화 함수
function enableLoading() {    
  loadingElement.style.display = "block"; 
}
//처음 로딩 막기
//disableLoading();


chatContainer.scrollTop = chatContainer.scrollHeight;

let stat = 1;

function API_button(keyword,status,select) {
    const button = document.createElement("button");
    button.textContent = keyword;
    button.addEventListener("click", () => request_server(keyword,status,select));
    button.className = 'keywordbutton';
    return button;
}
function request_server(message,status,select) {
    console.log(status);
    console.log(message);
    console.log(select);
    disableChatInput();
    fetch('/get_bot_response', {
        method: 'POST',
        body: new URLSearchParams({ 'status': status,'message': message,'select': select }),
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        }
    }).then(response => response.json())
    .then(data => {
        let botMessage = data.bot_response;
        addMessage("bot", botMessage);
        if (data.button) {
            console.log(data.button);
            let bot_button = data.button;
            if (data.select) {
                let user_select = data.select;
                stat = Number(data.status);
                const chatMessage = document.createElement("div");
                for (var i in bot_button) {
                    let alpha;
                    i = String(i);
                    if (i === "직접 문의하기") {
                        alpha = API_button("",9,"직접 대화");
                    }
                    else {
                        alpha = API_button(bot_button[i],stat,user_select[i]);
                    }
                    chatMessage.className = 'chat user';
                    chatMessage.appendChild(alpha);
                }
                chatContainer.appendChild(chatMessage); 
                chatContainer.scrollTop = chatContainer.scrollHeight;
                enableChatInput();
            }
            else {
                let user_select = select;
                stat = Number(data.status);
                const chatMessage = document.createElement("div");
                for (var i in bot_button) {
                    let alpha = API_button(bot_button[i],stat,user_select);
                    chatMessage.className = 'chat user';
                    chatMessage.appendChild(alpha);
                }
                chatContainer.appendChild(chatMessage); 
                chatContainer.scrollTop = chatContainer.scrollHeight;
                enableChatInput();
            }
        }
        else {
            chatContainer.scrollTop = chatContainer.scrollHeight;
            enableChatInput();
        }
    }).catch(error => {
        console.error('API 호출 중 오류가 발생했습니다.');
        alert("오류가 발생했습니다. 다시 시도해 주세요");
        enableChatInput();
    });

    textInput.value = ""; // 입력 필드 지움
    chatContainer.scrollTop = chatContainer.scrollHeight; 
    return ;
}

request_server("안녕",stat,"");