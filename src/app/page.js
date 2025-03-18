'use client'
import { useState } from 'react';
import './page.css';

const agentLangCode = 'en-US';
const defaultLangCode = 'en-US';

const languagesMap = new Map ([
  ['BG', 'Bulgarian'],
  ['ZH', 'Chinese Simplified'],
  ['CS', 'Czech'],
  ['DA', 'Danish'],
  ['EN-GB', 'English (British)'],
  ['EN-US', 'English (American)'],
  ['ET', 'Estonian'],
  ['FI', 'Finnish'],
  ['FR', 'French'],
  ['DE', 'German'],
  ['EL', 'Greek'],
  ['HU', 'Hungarian'],
  ['ID', 'Indonesian'],
  ['IT', 'Italian'],
  ['JA', 'Japanese'],
  ['KO', 'Korean'],
  ['LT', 'Lithuanian'],
  ['LV', 'Latvian'],
  ['NB', 'Norwegian'],
  ['NL', 'Dutch'],
  ['PL', 'Polish'],
  ['PT-PT', 'Portuguese (European)'],
  ['PT-BR', 'Portuguese (Brazilian)'],
  ['RO', 'Romanian'],
  ['RU', 'Russian'],
  ['SK', 'Slovak'],
  ['SL', 'Slovenian'],
  ['ES', 'Spanish'],
  ['SV', 'Swedish'],
  ['TR', 'Turkish'],
  ['UK', 'Ukrainian']
]);

async function getTranslation(text, targetLangCode) {
  const url = `/api/translate?text=${text}&target_lang=${targetLangCode}`;
  const response = await fetch(url);
  const data = await response.json();
  return data;
}

export default function Page() {
  const [customerMessages, setCustomerMessages] = useState([]);
  const [agentMessages, setAgentMessages] = useState([]);
  const [customerLangCode, setCustomerLangCode] = useState(defaultLangCode);
  const [selectedLangCode, setSelectedLangCode] = useState(defaultLangCode);

/* Put every message in both screens.
 * In the customer screen: if it's from the agent, translate the message into the customer's detected language and prepend "Agent: ". Otherwise, prepend "Me: ".
 * In the agent screen: if it's from the agent, prepend "Me: ". Otherwise, translate the message and prepend "Customer".
 */
  async function sendMessage(sender, message) {
    let translatedMessage, translationResponse;

    // Do the customer screen
  //  let label = sender == 'Customer' ? '<span color="blue">Me:</span>' : 'Agent:';

    if (sender == 'Agent') {
      translationResponse = await getTranslation(message, selectedLangCode);
      translatedMessage = translationResponse.text;
    }
    else {
      translatedMessage = message;
    }

    let label = sender == 'Customer' ? 'Me' : 'Agent';
    let newMessage = label + ": " + translatedMessage;
    setCustomerMessages(prevMessages => [...prevMessages, newMessage]);

    // Do the agent screen.
    // If this is from the customer, translate their message into the agent's language, then update detected language.
//    label = sender == 'Agent' ? '<span color="red">Me:</span>' : 'Customer:';
    if (sender == 'Customer') {
      translationResponse = await getTranslation(message, agentLangCode);
      translatedMessage = translationResponse.text;
      setCustomerLangCode(translationResponse.source_lang);
      setSelectedLangCode(translationResponse.source_lang);
    } else {
      translatedMessage = message;
    }

    label = sender == 'Agent' ? 'Me' : 'Customer';
    newMessage = label + ": " + translatedMessage;
    setAgentMessages(prevMessages => [...prevMessages, newMessage]);
  }

  return (
    <>
      <h1>Multilingual Support Chat</h1>
      <div className="main">
        <CustomerScreen messages={customerMessages} sendMessage={sendMessage} />
        <AgentScreen messages={agentMessages} sendMessage={sendMessage} customerLangCode={customerLangCode} selectedLangCode={selectedLangCode} setSelectedLangCode={setSelectedLangCode}/>
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

function AgentScreen({ messages, sendMessage, customerLangCode, selectedLangCode, setSelectedLangCode }) {
  const topAreaContent = (
    <p>Customer is speaking <span className="detectedLang">{languagesMap.get(customerLangCode)}</span></p>
  );

  return (
    <ChatScreen 
      name='Agent' 
      topAreaContent={topAreaContent} 
      bottomAreaContent={<LanguagesSelect selectedLangCode={selectedLangCode} setSelectedLangCode={setSelectedLangCode} />}
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

function LanguagesSelect({selectedLangCode, setSelectedLangCode}) {
  const options = Array.from(languagesMap.entries()).map(
    ([code, name]) => 
      <option key={code} value={code}>{name}</option>
  );

  return (
    <select
      onChange = {(e) => setSelectedLangCode(e.target.value)}
      value = {selectedLangCode}
    >
      {options}
    </select>
  );
}
