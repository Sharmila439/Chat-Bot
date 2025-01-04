
const chatInput=document.querySelector(".chat-input textarea");
const sendChatBtn=document.querySelector(".chat-input span");
const chatbox=document.querySelector(".chatbox");
const chatbotToggler=document.querySelector(".chatbot-toggler");
const chatbotCloseBtn=document.querySelector(".close-btn");
let userMessage;
const API_KEY="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";
const inputInitHeight = chatInput.scrollHeight;
const createChatLi=(message,className)=>{
    
    //Create a chat <li> element with passed messaage and className
    const chatLi=document.createElement("li");
    chatLi.classList.add("chat",className);
    let chatContent=className==="outgoing" ?  `<p></p>` : `<span class="material-symbols-outlined">smart_toy</span><p></p>`;
    chatLi.innerHTML=chatContent;
    chatLi.querySelector("p").textContent=message;
    return chatLi;
}
 const generateResponse=(incomingChatLi) =>{
    const API_URL ="https://api.openai.com/v1/chat/completions";
    const messaageElement=incomingChatLi.querySelector("p")
    const requestOptions={
        method:"POST",
        headers:{
            "Content-Type" : "application/json",
            "Authorization": `Bearer ${API_KEY}`
        },
        body:JSON.stringify({
            "model": "gpt-4o-mini",
            "store": true,
            "messages": [
              {"role": "user", "content": userMessage}
            ]
          })
    }
    //Send POST request to API,get response
   fetch(API_URL, requestOptions).then(res => res.json()).then(data =>{
        messaageElement.textContent = data.choices[0].message.content;
    })
   .catch((error) =>{
       messaageElement.classList.add("error");
       messaageElement.textContent="Oops! Something went wrong.Please try again.";
    }).finally(() => chatbox.scrollTo(0,chatbox.scrollHeight));

}
const handleChat = () => {
    userMessage = chatInput.value.trim();
    if(!userMessage) return;
    chatInput.value="";
    chatInput.style.height=`${inputInitHeight }px`;

//Append the user's message to the chatbox
    chatbox.appendChild(createChatLi(userMessage,"outgoing"));
    chatbox.scrollTo(0,chatbox.scrollHeight);

    setTimeout(() =>{
        // Diaplay "thinking..." message while waiting for the response
        const incomingChatLi = createChatLi("Thinking...","incoming")
         chatbox.appendChild(incomingChatLi);
         chatbox.scrollTo(0,chatbox.scrollHeight);
         generateResponse(incomingChatLi);
    },600 )
    
}


chatInput.addEventListener("input",() =>{
    //Adjust the height of the textarea based on its content
    chatInput.style.height=`${inputInitHeight }px`;
    chatInput.style.height=`${chatInput.scrollHeight }px`;
})
chatInput.addEventListener("keydown",(e) =>{
    //If Enter key is pressed without shift key and thw window
    //width is greater than 800px the chat
    if(e.key === "Enter" && !e.shiftkey && window.innerWidth >800){
        e.preventDefault();
        handleChat();
    }
})
sendChatBtn.addEventListener("click",handleChat);
chatbotCloseBtn.addEventListener("click",() =>document.body.classList.remove("show-chatbot"));
chatbotToggler.addEventListener("click",() =>document.body.classList.toggle("show-chatbot"));
