import React, { useState, useEffect, useRef } from 'react';
import { Button, TextField, Paper, IconButton } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { useHiddenContext } from './hiddencontext';
import './chat.css';
import Avatar from './avatar';
import mssg from "./system-solid-47-chat.gif";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const Chat = ({ sockett }) => {
    const { hiddenword , updateUserpoints } = useHiddenContext();
    const gradientColor = `linear-gradient(135deg, #001F3F, #001F7F)`;
   
    const [message, setMessage] = useState('');
    const [chatMessages, setChatMessages] = useState([]);
    const [iscorrect, setcorr] = useState(0);
    const [indforpoints, setind] = useState(10);
    const [ischat,setchat] = useState(true);

    const messagesRef = useRef(null);

    useEffect(() => {
        sockett?.on('chat for frontend', ({ username, message }) => {
            setChatMessages((prevMessages) => [...prevMessages, { username, message }]);
            messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
        });
        sockett?.on('Usernamepoints initialize', (usernamepoints) => {
            updateUserpoints(usernamepoints);
        });
        sockett?.on('Standings', (usernamepoints) => {
            updateUserpoints(usernamepoints);
        });
        sockett?.on('Standingss', (x) => {
            setind(x);
        });
        sockett?.on('Restart points and index',(space) => {
            setcorr(0);
            setind(10);
            setchat(true);
        });
        sockett?.on('Chat send disable',(space) => {
            setchat(false);
        });
    }, [sockett]);

    const handleSendMessage = () => {
        if(localStorage.getItem('token')!=null){
            if (message.trim() !== '' && ischat) {
                sockett?.emit('chat message for backend', { username: localStorage.getItem('name'), message });
                setMessage('');
                if (iscorrect == 0 && message==hiddenword) {
                    sockett.emit('Points up', { username: localStorage.getItem('name'), indforpoints });
                    setcorr(1);
                }
            }
        }
        else{
            toast("Oops! Login required.");
        }
    };

    return (
        <div className='w-full h-full flex flex-col'>
            <Paper elevation={3} className="chat-container flex flex-col h-full" style={{opacity:'1',position:'relative',background: gradientColor}} >
                <div className="flex flex-col" style={{position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 2 ,height:'100%',width:'100%',justifyContent:'center'}}>
                <div className="chat-messages overflow-x-hidden flex-1" style={{opacity:'1',overflowX:'hidden'}}ref={messagesRef}>
                    {chatMessages.map((msg, index) => (
                        <div key={index} className='chat-message my-3 flex flex-row text-base mx-auto gap-3 md:px-5 lg:px-1 xl:px-5 md:max-w-3xl lg:max-w-[40rem] xl:max-w-[48rem] group'>
                            <div className='h-full' style={{marginLeft:'0.5rem',marginTop:'1.5rem'}}>
                                <Avatar email={msg.username} size={30}/>
                            </div>
                            <div className='h-full w-4/6'>
                                <strong style={{ fontSize:'80%', color:'rgb(43, 110, 190)'}}>{msg.username}</strong> 
                                <div style={{ overflowWrap:'break-word',color:'whitesmoke', width:'100%', backgroundColor:'rgb(43, 110, 200)',borderRadius:'0.375rem',padding:'0.125rem',paddingLeft:'0.3rem'}}>{hiddenword === msg.message.toLowerCase() ? <div style={{color:'lightgreen'}}>Correct</div> : msg.message}</div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="chat-input" style={{height:'12%'}}>
                    <div className='flex h-full'>
                        <div style={{ height: '80%', width: '13%', marginLeft:'2%',marginBottom:'0.3rem',marginTop:'0.3rem' }}>
                            <img src={mssg} style={{height:'50%%',width:'100%',marginBottom:'0.3rem'}} alt="Texture Background" />
                        </div>
                        <input type='text'
                                className='w-full'
                                style={{borderRadius:'5px', marginLeft:'10px', marginBottom:'5px',marginTop:'0.3rem', height:'80%'}}
                                placeholder='  Type a message' 
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                onKeyUp={(e) => e.key==='Enter' && handleSendMessage()}>
                            
                        </input>
                        <IconButton size='small' style={{marginBottom:'7px',marginTop:'0.3rem'}} onClick={handleSendMessage} color="primary" aria-label="send message" disabled={!ischat}>
                            <SendIcon/>
                        </IconButton>
                    </div>
                </div>
                </div>
            </Paper>
        </div>
    );
};

export default Chat;
