import './Card.scss';

const Card = ({ content, isFlipped, onClick, style, isActive, selectedWords = [], onWordClick = () => { }, isInteractive = false }) => {
    return (
        <div
            className={`game-card ${isFlipped ? 'flipped' : ''} ${isActive ? 'active' : ''} ${isInteractive ? 'interactive' : ''}`}
            onClick={onClick}
            style={style}
        >
            <div className="card-inner">
                <div className={`card-front type-${content.type}`}>
                    <div className="card-content">
                        <h2>{content.title}</h2>
                        <p className="subtitle">{content.subtitle}</p>
                        {content.complication && (
                            <p className="complication">{content.complication}</p>
                        )}
                        <div className="words-list">
                            {content.words.map((word, index) => {
                                const isSelected = selectedWords.includes(index);
                                return (
                                    <div
                                        key={index}
                                        className={`word-item ${isSelected ? 'selected' : ''}`}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onWordClick(index);
                                        }}
                                    >
                                        <span className="label">{word.label}</span>
                                        <span className="value">{word.value}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
                <div className="card-back"></div>
            </div>
        </div>
    );
};

export default Card;
