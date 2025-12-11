import React, { useState } from 'react';
import './HelpButton.scss';

const HelpButton = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <div className="help-icon" onClick={() => setIsOpen(true)}>?</div>

            {isOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2 className="modal-title">Game Rules</h2>
                        <p className="modal-text">
                            Here are the rules of the game:
                            <br />
                            1. Divide into teams.
                            <br />
                            2. Explain/show the words to your team.
                            <br />
                            3. Earn points to win!
                        </p>
                        <button className="modal-ok-btn start-btn" onClick={() => setIsOpen(false)}>Ok</button>
                    </div>
                </div>
            )}
        </>
    );
};

export default HelpButton;
