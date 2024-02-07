import React, { useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useQuery, useLazyQuery, useMutation, gql } from '@apollo/client';
import { Total_Users } from '../../Graphql/users';
import './users.css';

const Users = ({ initials }) => {
    
    const gradientColor2 = `linear-gradient(135deg, #2193b0, #6dd5ed)`;
    return (
        <div className="user-avatar" style={{ background: gradientColor2, width:`${100}%`, borderRadius:'5px'}}>
            {initials}
        </div>
    );
};

export default Users;
