'use client'
import { useState } from 'react';
import './page.css';

const agentLanguage = 'en-US';

const languagesMap = [
  ['BG', 'Bulgarian (BG)'],
  ['ZH', 'Chinese Simplified (ZH)'],
  ['CS', 'Czech (CS)'],
  ['DA', 'Danish (DA)'],
  ['en-GB', 'English British (en-GB)'],
  ['en-US', 'English American (en-US)'],
  ['ET', 'Estonian (ET)'],
  ['FI', 'Finnish (FI)'],
  ['fr', 'French (FR)'],
  ['de', 'German (DE)'],
  ['EL', 'Greek (EL)'],
  ['HU', 'Hungarian (HU)'],
  ['ID', 'Indonesian (ID)'],
  ['IT', 'Italian (IT)'],
  ['JA', 'Japanese (JA)'],
  ['KO', 'Korean (KO)'],
  ['LT', 'Lithuanian (LT)'],
  ['LV', 'Latvian (LV)'],
  ['NB', 'Norwegian (NB)'],
  ['NL', 'Dutch (NL)'],
  ['PL', 'Polish (PL)'],
  ['pt-PT', 'Portuguese European (PT-PT)'],
  ['pt-BR', 'Portuguese Brazilian (PT-BR)'],
  ['RO', 'Romanian (RO)'],
  ['RU', 'Russian (RU)'],
  ['SK', 'Slovak (SK)'],
  ['SL', 'Slovenian (SL)'],
  ['es', 'Spanish (ES)'],
  ['SV', 'Swedish (SV)'],
  ['TR', 'Turkish (TR)'],
  ['UK', 'Ukrainian (UK)']
];

async function getTranslation(text, targetLanguage) {
  const url = `/api/translate?text=${text}&target_lang=${targetLanguage}`;
  const response = await fetch(url);
  const data = await response.json();
  return data;
}

export default function Page() {
  const [customerMessages, setCustomerMessages] = useState([]);
  const [agentMessages, setAgentMessages] = useState([]);

/* Put every message in both screens.
 * In the customer screen: if it's from the agent, prepend "Agent: ". Otherwise, prepend "Me: ".
 * In the agent screen: if it's from the agent, prepend "Me: ". Otherwise, translate the message and prepend "Customer".
 */
  async function sendMessage(sender, message) {
    // Do the customer screen
  //  let label = sender == 'Customer' ? '<span color="blue">Me:</span>' : 'Agent:';
    let label = sender == 'Customer' ? 'Me' : 'Agent';
    let newMessage = label + ": " + message;
    setCustomerMessages(prevMessages => [...prevMessages, newMessage]);

    // Do the agent screen
//    label = sender == 'Agent' ? '<span color="red">Me:</span>' : 'Customer:';
    const translatedText = await getTranslation(message, agentLanguage);
    label = sender == 'Agent' ? 'Me' : 'Customer';
    newMessage = label + ": " + message;
    setAgentMessages(prevMessages => [...prevMessages, newMessage]);
  }

  return (
    <>
      <h1>Multilingual Support Chat</h1>
      <div className="main">
        <CustomerScreen messages={customerMessages} sendMessage={sendMessage} />
        <AgentScreen messages={agentMessages} sendMessage={sendMessage} />
      </div>
    </>
  );
}

/* There will be two chat screens - one for the customer, and another for the agent.
 * Above each will be a title indicating whether this is for the customer or the agent.
 * Then comes the big screen.
 * Each screen has an area on top for information.
 * Below that is an area for people to type messages... and below that, there's another area.
 * Finally, on the bottom is a lovely "Send" button.
*/

function CustomerScreen({ messages, sendMessage }) {
 const topAreaContent = (
  <p>Talk to us in your favorite language!</p>
 );

  return (
    <ChatScreen 
      name='Customer'
      topAreaContent={topAreaContent}
      bottomAreaContent=''
      buttonText='Send'
      messages={messages}
      sendMessage={sendMessage}>   
    </ChatScreen>
  );
}

function AgentScreen({ messages, sendMessage }) {
  const {detectedLanguage, setDetectedLanguage} = useState('en-US');
  const topAreaContent = (
    <p>Detected language: {detectedLanguage}</p>
  );

  return (
    <ChatScreen 
      name='Agent' 
      topAreaContent={topAreaContent} 
      bottomAreaContent={LanguagesSelect()}
      buttonText='Translate and send'
      messages={messages}
      sendMessage={sendMessage}>  
    </ChatScreen>
  );
}

function ChatScreen({ name, topAreaContent, bottomAreaContent, buttonText, messages, sendMessage }) {
  const [message, setMessage] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    sendMessage(name, message);
    setMessage('');
  }

  return (
    <div className="personArea">
      <h2>{name}</h2>
      <div className="topArea">{topAreaContent}</div>
      <div className="screen">
        <ul className="messages">
          {messages.map((msg, key) => (
            <li key={key}>{msg}</li>
            )
          )}
        </ul>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="inputContainer">
          <input
            type="text"
            className="messageInput"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message here..."
          />
        </div>
        <div className="bottomArea">
          {bottomAreaContent}
          <button>{buttonText}</button></div>
      </form>
    </div>
  );
}

function LanguagesSelect() {
  const options = languagesMap.map(
    ([code, name]) => 
      <option key={code} value={code}>{name}</option>
  );
  return (
    <select>
      {options}
    </select>
  );
}
