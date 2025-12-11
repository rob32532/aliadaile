import React from 'react';
import './WinModal.scss';

const WinModal = ({ winnerName, score, onRestart, onHome }) => {
    return (
        <div className="modal-overlay">
            <div className="win-modal-content">
                <div className="trophy">🏆</div>
                <h2 className="modal-title">Victory!</h2>
                <div className="winner-name">{winnerName}</div>
                <p className="final-score">Score: {score}</p>
                
                <div className="button-group">
                    <button className="home-btn" onClick={onHome}>
                        Menu
                    </button>
                    <button className="restart-btn" onClick={onRestart}>
                        Play Again
                    </button>
                </div>
            </div>
        </div>
    );
};

export default WinModal;