import React from 'react';
import { useNavigate } from 'react-router-dom';

import HelpButton from '../components/HelpButton';

const Home = () => {
    const navigate = useNavigate();

    return (
        <div className="page home-page">
            <HelpButton />
            <h1 className="title">Aliadaile</h1>
            <button className="start-btn" onClick={() => navigate('/teams')}>Start</button>
        </div>
    );
};

export default Home;
