import React, { useState, useEffect } from 'react';
import { IconButton, Modal, Backdrop, Fade, Typography, Paper } from '@mui/material';
import { useLocation } from 'react-router-dom';
import { useHiddenContext } from './hiddencontext';
import { useQuery, useLazyQuery, useMutation, gql } from '@apollo/client';
import { Total_Users } from '../../Graphql/users';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Standings = ({ sockett }) => {
    const { usernamepoints } = useHiddenContext();
    const [sortedUsernamePoints, setSortedUsernamePoints] = useState([]);
    const [open, setOpen] = useState(false);
    const [isClicked, setIsClicked] = useState(false);
    const me = localStorage.getItem('name');

    const location = useLocation();
    const id = location.pathname.split('/')[2];

    const [totalNoUsers, setNumberUsers] = useState(-1);
    const [getMyValues, { loading, error, data: myValues }] = useLazyQuery(Total_Users, { fetchPolicy: 'cache-and-network' });

    useEffect(() => {
        if (totalNoUsers != -1) {
            setNumberUsers(myValues.TotalUsers.username.length);
        }
    }, [myValues]);

    const isvalid = async () => {
        if (totalNoUsers === -1) {
            setNumberUsers(0);
        }
        await getMyValues({ variables: { input: { roomid: id } }, });
    };

    useEffect(() => {
        if (usernamepoints.length > 0) {
            const sortedPoints = [...usernamepoints].sort((a, b) => b.value - a.value);
            setSortedUsernamePoints(sortedPoints);
        }
    }, [usernamepoints]);


    const handleOpen = () => {
        if (localStorage.getItem('token') != null) {
            isvalid();
            setOpen(true);
            setIsClicked(true);
            setTimeout(() => {
                setIsClicked(false);
            }, 100);
        }
        else {
            toast("Oops! Login required.");
        }
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div className='h-full w-full'>
            <IconButton
                onClick={handleOpen}
                style={{
                    height: '100%',
                    width: '100%',
                    background: 'linear-gradient(45deg, #2176F3, #21ABF3)',
                    backgroundSize: 'cover',
                    borderRadius: '0px',
                    boxShadow: 'inset 0 0 20px rgba(0, 0, 255, 0.8)',
                    transition: 'background 0.3s, transform 0.3s',
                    transform: isClicked ? 'scale(0.8)' : 'scale(1)',
                }}
            >
                <Typography fontSize={{ sm: '0.5rem', md: '1rem', lg: '1.5rem' }} style={{ marginLeft: '5px', color: 'white' }}>
                    Standings
                </Typography>
            </IconButton>


            <Modal open={open} onClose={handleClose}>
                <Fade in={open}>
                    <Paper style={{ borderRadius: '5px', maxWidth: 300, width: '100%', height: '80%', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                        <div className='flex flex-col align-items-center justify-content-center h-1/6 w-full' style={{ borderRadius: '5px', backgroundColor: 'black', color: 'white' }}>
                            <b style={{ fontSize: '2rem' }}>Players <b style={{ color: '#5476dc' }}>{sortedUsernamePoints.length}</b></b>
                        </div>
                        {/* <hr></hr> */}
                        <div className='flex flex-col w-full h-4/5 overflow-x-hidden'>
                            {sortedUsernamePoints.map(({ value, username }, index) => (
                                value > 0 ?
                                    <div key={index} style={{ marginTop: '0.125rem', marginBottom: '0.125', fontFamily: 'Single Day' }}>
                                        <div key={index} className='flex flex-col align-items-center justify-content-center' >
                                            <b style={{ fontSize: '20px' }}>{username == me ? <div style={{ color: 'green' }}><u>{index + 1}. You</u></div> : (index + 1) + '. ' + username}</b>
                                            <i style={{ fontSize: '13px' }}>{value} points</i>
                                        </div>
                                        <hr></hr>
                                    </div>
                                    :
                                    <div key={index} style={{ marginTop: '0.125rem', marginBottom: '0.125', fontFamily: 'Single Day' }}>
                                        <div key={index} className='flex flex-col align-items-center justify-content-center' >
                                            <b style={{ fontSize: '20px' }}>{username == me ? <div style={{ color: 'green' }}><u>{index + 1}. You</u></div> : (index + 1) + '. ' + username}</b>
                                            <i style={{ color: 'red', fontSize: '13px' }}>{value} points</i>
                                        </div>
                                        <hr style={{ color: 'black' }}></hr>
                                    </div>
                            ))}
                        </div>
                    </Paper>
                </Fade>
            </Modal>
        </div>
    );
};

export default Standings;
