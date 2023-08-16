import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import {MainContainer,ChatContainer,MessageList,Message,MessageInput,TypingIndicator} from '@chatscope/chat-ui-kit-react'

const API_KEY = "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";

function App() {
  const [messages, setMessages] = useState([{
    message: "hello I'm ChatGpt",
    sender:"ChatGpt",
  }])
  const [typing,setTyping] = useState(false)
  const handleSend = async(message)=>{
    // create a meesage object with input message
    const newMessage = {
      message: message,
      sender:'user',
      direction:'outgoing',
    }
    //update the new message with old messages and update the state of messages
    const newMessages = [...messages,newMessage];//old msg+new msg;
    setMessages(newMessages)

    //set a typing indicator like(chatgpt is typing)
    setTyping(true);

    //process messages to chatgpt api
    await giveMessageToChatgpt(newMessages)

  }
   async function giveMessageToChatgpt(chatMessages){
     // chat messages {sender:"user" ,message:"the message content here"}
     // api meesages {role:"user" ,content:"the message content here"}
     let apiMessage = chatMessages.map((messageObject)=>{
         let role = ""
         if(messageObject.sender==="ChatGpt"){
           role = "assistant"
       }else role = "user"
       return {role: role, content: messageObject.message}
     })
     
     //role:user->who sends the messages , role:assistant-> who responds to messages
     //role: system -> general explanation of our nature and how we want to talk to system

     const systemMessage = {
       role:"system",
       content :"explain like i'M a rookie in computer science"
     }

     const apiRequestBody = {
       "model": "gpt-3.5-turbo",
       "messages" : [systemMessage,...apiMessage]
     }

     await fetch("https://api.openai.com/v1/chat/completions",{
       method: "POST",
       headers :{
         "Authorization" : "Bearer "+API_KEY ,
         "Content-Type" : "application/json"
       },
       body : JSON.stringify(apiRequestBody)
     }).then(data => {
       return data.json();
     }).then(data => {
       console.log(data);
      //  console.log(data.choices[0].message.content);
      //  setMessages(
      //    [...chatMessages,{
      //      message: data.choices[0].message.content,
      //      sender : "ChatGPT"
      //    }]
      //  )
       setTyping(false);
     })
   }
  return (
    <>
    <div className="App">
      <div style={{position:"relative",height:"700px",width:"800px"}}>
        <MainContainer>
          <ChatContainer>
            <MessageList
            typingIndicator={(typing)? <TypingIndicator content="ChatGpt is typing"/>:null}
            >
              {messages.map((message,i)=>{
                return <Message key={i} model={message}/>
              })}
            </MessageList>
            <MessageInput placeholder="Type Here" onSend={handleSend}></MessageInput>
          </ChatContainer>
        </MainContainer>
      </div>
    </div>
    </>
  )
}

export default App
