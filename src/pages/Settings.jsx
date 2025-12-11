import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import HelpButton from '../components/HelpButton';
import './Settings.scss';

const Settings = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [pointsToWin, setPointsToWin] = useState(24);
    const [timePerTurn, setTimePerTurn] = useState(2);

    const { teams } = location.state || { teams: [] };

    return (
        <div className="page settings-page">
            <div className="back-arrow" onClick={() => navigate(-1)}>←</div>
            <HelpButton />

            <h1 className="title">Settings</h1>

            <div className="settings-container">
                <div className="setting-item">
                    <div className="setting-label-container">
                        <span className="setting-label">Number of points to win: </span>
                        <span className="setting-value">{pointsToWin}</span>
                    </div>
                    <div className="slider-container">
                        <span className="slider-min">20</span>
                        <input
                            type="range"
                            min="20"
                            max="40"
                            value={pointsToWin}
                            onChange={(e) => setPointsToWin(e.target.value)}
                            className="slider"
                        />
                        <span className="slider-max">40</span>
                    </div>
                </div>

                <div className="setting-item">
                    <div className="setting-label-container">
                        <span className="setting-label">Time for one turn: </span>
                        <span className="setting-value">{timePerTurn} min</span>
                    </div>
                    <div className="slider-container">
                        <span className="slider-min">0.1</span>
                        <input
                            type="range"
                            step="0.1"
                            min="0.1"
                            max="5"
                            value={timePerTurn}
                            onChange={(e) => setTimePerTurn(e.target.value)}
                            className="slider"
                        />
                        <span className="slider-max">5</span>
                    </div>
                </div>
            </div>

            <button className="start-btn" onClick={() => navigate('/game', { state: { teams, pointsToWin, timePerTurn } })}>Continue</button>
        </div>
    );
};

export default Settings;
