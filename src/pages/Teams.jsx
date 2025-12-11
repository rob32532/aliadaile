import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import './Teams.scss';

import HelpButton from '../components/HelpButton';

const Teams = () => {
    const navigate = useNavigate();
    const [teams, setTeams] = useState(['']);

    const handleAddTeam = () => {
        setTeams([...teams, '']);
    };

    const handleRemoveTeam = (index) => {
        const newTeams = [...teams];
        newTeams.splice(index, 1);
        if (newTeams.length === 0) {
            setTeams(['']);
        } else {
            setTeams(newTeams);
        }
    };

    const handleTeamChange = (index, value) => {
        const newTeams = [...teams];
        newTeams[index] = value;
        setTeams(newTeams);
    };

    return (
        <div className="page teams-page">
            <div className="back-arrow" onClick={() => navigate('/')}>←</div>
            <HelpButton />

            <h1 className="title">Teams</h1>

            <div className="teams-list">
                {teams.map((team, index) => (
                    <div key={index} className="team-item">
                        <input
                            type="text"
                            value={team}
                            onChange={(e) => handleTeamChange(index, e.target.value)}
                            className="team-input"
                            placeholder="Team name"
                        />
                        <span className="remove-icon" onClick={() => handleRemoveTeam(index)}>×</span>
                    </div>
                ))}
                <div className="add-btn" onClick={handleAddTeam}>+</div>
            </div>

            <button className="start-btn" onClick={() => navigate('/settings', { state: { teams } })}>Continue</button>
        </div>
    );
};

export default Teams;