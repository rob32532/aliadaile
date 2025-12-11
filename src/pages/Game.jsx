import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import * as Tone from 'tone';
import Card from '../components/Card';
import WinModal from '../components/WinModal';
import { eWords, mWords, hWords } from '../components/words';
import { explainComplications, showComplications } from '../components/complications';
import './Game.scss';

const Game = () => {
    const navigate = useNavigate();
    const location = useLocation();
    
    const { teams = [], pointsToWin = 24, timePerTurn = 2 } = location.state || {};

    const [deck, setDeck] = useState([]);
    const [activeCardIndex, setActiveCardIndex] = useState(null);
    const [isFlipped, setIsFlipped] = useState(false);
    const [timeLeft, setTimeLeft] = useState(timePerTurn * 60);
    const [scores, setScores] = useState(teams.map(() => 0));
    const [isGameStarted, setIsGameStarted] = useState(false);
    const [isDeckOpen, setIsDeckOpen] = useState(false);
    const [isExiting, setIsExiting] = useState(false);

    const [gameWinner, setGameWinner] = useState(null);

    const [currentTeamIndex, setCurrentTeamIndex] = useState(0);
    const [selectedWordIndices, setSelectedWordIndices] = useState([]);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const generateCards = (count, startId) => {
        let availableE = [...eWords].sort(() => 0.5 - Math.random());
        let availableM = [...mWords].sort(() => 0.5 - Math.random());
        let availableH = [...hWords].sort(() => 0.5 - Math.random());

        return Array.from({ length: count }, (_, i) => {
            const cardWords = [];

            for (let j = 0; j < 2; j++) {
                if (availableE.length > 0) cardWords.push(availableE.pop());
            }
            for (let j = 0; j < 2; j++) {
                if (availableM.length > 0) cardWords.push(availableM.pop());
            }
            for (let j = 0; j < 1; j++) {
                if (availableH.length > 0) cardWords.push(availableH.pop());
            }

            const type = Math.floor(Math.random() * 4) + 1;
            let subtitle = '';
            let complication = null;

            switch (type) {
                case 1:
                    subtitle = 'Explain';
                    break;
                case 2:
                    subtitle = 'Show';
                    break;
                case 3:
                    subtitle = 'Explain';
                    complication = explainComplications[Math.floor(Math.random() * explainComplications.length)];
                    break;
                case 4:
                    subtitle = 'Show';
                    complication = showComplications[Math.floor(Math.random() * showComplications.length)];
                    break;
                default:
                    subtitle = 'Explain';
            }

            return {
                id: startId + i,
                title: 'Aliadaile',
                subtitle,
                type,
                complication,
                words: cardWords
            };
        });
    };

    useEffect(() => {
        const deckSize = isMobile ? 10 : 20;
        const newDeck = generateCards(deckSize, 0);
        setDeck(newDeck);
    }, [isMobile]);


    const playTimeUpSound = () => {
        const synth = new Tone.PolySynth(Tone.Synth, {
            oscillator: { type: "sine" },
            envelope: {
                attack: 0.01,
                decay: 0.3,
                sustain: 0,
                release: 1.2
            }
        }).toDestination();
        
        synth.volume.value = -2;

        const now = Tone.now();
        synth.triggerAttackRelease("G5", "0.5", now);
        synth.triggerAttackRelease("C6", "0.5", now + 0.2);
    };

    useEffect(() => {
        let soundInterval = null;

        if (timeLeft === 0 && activeCardIndex !== null && !gameWinner) {
            playTimeUpSound();
            soundInterval = setInterval(() => {
                playTimeUpSound();
            }, 3000);
        }

        return () => {
            if (soundInterval) clearInterval(soundInterval);
        };
    }, [timeLeft, activeCardIndex, gameWinner]);

    useEffect(() => {
        let timer = null;
        if (activeCardIndex !== null && isFlipped && !gameWinner) {
            timer = setInterval(() => {
                setTimeLeft(prev => {
                    if (prev <= 0) {
                        playTimeUpSound();
                        clearInterval(timer);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        } else {
            if (activeCardIndex === null) {
                setTimeLeft(timePerTurn * 60);
            }
        }

        return () => {
            if (timer) clearInterval(timer);
        };
    }, [activeCardIndex, isFlipped, timePerTurn, gameWinner]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins} min ${secs} sec`;
    };

    const handleStartGame = async () => {
        await Tone.start();
        setIsGameStarted(true);
        setTimeout(() => {
            setIsDeckOpen(true);
        }, 100);
    };

    const handleCardClick = (index) => {
        if (activeCardIndex !== null) return;
        setActiveCardIndex(index);
        setIsDeckOpen(false);

        setTimeout(() => {
            setIsFlipped(true);
        }, 600);
    };

    const handleWordClick = (wordIndex) => {
        setSelectedWordIndices(prev => {
            if (prev.includes(wordIndex)) {
                return prev.filter(i => i !== wordIndex);
            } else {
                return [...prev, wordIndex];
            }
        });
    };

    const handleNextTurn = () => {
        if (activeCardIndex !== null) {
            const currentCard = deck[activeCardIndex];
            
            const turnScore = selectedWordIndices.reduce((sum, index) => {
                return sum + currentCard.words[index].value;
            }, 0);

            let newTotalScore = 0;

            setScores(prevScores => {
                const newScores = [...prevScores];
                newScores[currentTeamIndex] += turnScore;
                newTotalScore = newScores[currentTeamIndex];
                return newScores;
            });

            if (newTotalScore >= pointsToWin) {
                setGameWinner({
                    name: teams[currentTeamIndex],
                    score: newTotalScore
                });
                return; 
            }
        }

        setIsExiting(true);

        setTimeout(() => {
            setIsExiting(false);
            setIsFlipped(false);
            setActiveCardIndex(null);
            setSelectedWordIndices([]);
            setCurrentTeamIndex(prev => (prev + 1) % teams.length);

            setDeck(prev => {
                const newDeck = [...prev];
                newDeck.splice(activeCardIndex, 1);

                const minCards = isMobile ? 5 : 10;
                if (newDeck.length < minCards) {
                    const lastId = newDeck.length > 0 ? Math.max(...newDeck.map(c => c.id)) : 0;
                    const cardsToAdd = (isMobile ? 10 : 20) - newDeck.length;
                    const moreCards = generateCards(cardsToAdd, lastId + 1);
                    return [...newDeck, ...moreCards];
                }

                return newDeck;
            });

            setTimeout(() => {
                setIsDeckOpen(true);
                setTimeLeft(timePerTurn * 60);
            }, 300);
        }, 500);
    };

    const handleRestartGame = () => {
        setGameWinner(null);
        setScores(teams.map(() => 0));
        setCurrentTeamIndex(0);
        setIsGameStarted(false);
        setIsDeckOpen(false);
        setActiveCardIndex(null);
        setIsFlipped(false);
        setSelectedWordIndices([]);
        setTimeLeft(timePerTurn * 60);
        
        const deckSize = isMobile ? 10 : 20;
        setDeck(generateCards(deckSize, 0));
    };

    const handleGoHome = () => {
        navigate('/');
    };

    return (
        <div className="page game-page">
            <div className="header">
                <div className="score-board">
                    {teams.map((team, index) => (
                        <div key={index} className={`score-item ${index === currentTeamIndex ? 'active' : ''}`}>
                            <span className="label">{team}</span>
                            <span className="value">{scores[index]}</span>
                        </div>
                    ))}
                </div>
                <div className={`timer ${timeLeft <= 10 && activeCardIndex !== null ? 'warning' : ''}`}>
                    Time: {formatTime(timeLeft)}
                </div>
            </div>

            <div className="game-area">
                <div className={`card-fan ${isDeckOpen ? 'open' : ''}`}>
                    {deck.map((card, index) => {
                        const totalCards = deck.length;
                        const spacing = isMobile ? 15 : 30;
                        const isActive = index === activeCardIndex;

                        let style = {};

                        if (isActive) {
                            style = {
                                transform: 'translate(-50%, -50%)',
                                left: '50%',
                                top: isExiting ? '-100%' : '50%',
                                zIndex: 100,
                                opacity: isExiting ? 0 : 1
                            };
                        } else if (isDeckOpen) {
                            style = {
                                transform: `translateX(-50%) ${isMobile ? 'scale(0.4)' : ''}`,
                                left: `calc(50% + ${(index - (totalCards - 1) / 2) * spacing}px)`,
                                bottom: isMobile ? '80px' : '100px',
                                zIndex: index
                            };
                        } else {
                            style = {
                                transform: `translateX(-50%) ${isMobile ? 'scale(0.4)' : ''}`,
                                left: '50%',
                                bottom: '-300px',
                                zIndex: index,
                                opacity: isGameStarted ? 0 : 1
                            };

                            if (!isGameStarted) {
                                style.bottom = isMobile ? '80px' : '100px';
                                style.opacity = 1;
                            }
                        }

                        return (
                            <Card
                                key={card.id}
                                content={card}
                                isFlipped={isActive && isFlipped}
                                isActive={isActive}
                                onClick={() => isDeckOpen && handleCardClick(index)}
                                style={style}
                                selectedWords={isActive ? selectedWordIndices : []}
                                onWordClick={isActive ? handleWordClick : () => { }}
                                isInteractive={isDeckOpen}
                            />
                        );
                    })}
                </div>
            </div>

            {gameWinner && (
                <WinModal 
                    winnerName={gameWinner.name} 
                    score={gameWinner.score}
                    onRestart={handleRestartGame}
                    onHome={handleGoHome}
                />
            )}

            <button className={`start-game-btn ${isGameStarted ? 'hidden' : ''}`} onClick={handleStartGame}>
                Start Game
            </button>

            {!gameWinner && activeCardIndex !== null && isFlipped && (
                <button className="next-turn-btn" onClick={handleNextTurn}>
                    Next turn
                </button>
            )}
        </div>
    );
};

export default Game;