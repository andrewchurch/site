import { useState, useEffect, useRef } from 'react';
import { addScore, getTopTenScores } from '../../../services/data.mjs';

const badWords = ['ho', 'xx', 'fu', 'ass', 'fuc', 'fuk', 'fuq', 'fux', 'fck', 'coc', 'cok', 'coq', 'kox', 'koc', 'kok', 'koq', 'cac', 'cak', 'caq', 'kac', 'kak', 'kaq', 'dic', 'dik', 'diq', 'dix', 'dck', 'pns', 'psy', 'fag', 'fgt', 'ngr', 'nig', 'cnt', 'knt', 'sht', 'dsh', 'twt', 'bch', 'cum', 'clt', 'kum', 'klt', 'suc', 'suk', 'suq', 'sck', 'lic', 'lik', 'liq', 'lck', 'jiz', 'jzz', 'gay', 'gey', 'gei', 'gai', 'vag', 'vgn', 'sjv', 'fap', 'prn', 'lol', 'jew', 'joo', 'gvr', 'pus', 'pis', 'pss', 'snm', 'tit', 'fku', 'fcu', 'fqu', 'hor', 'slt', 'jap', 'wop', 'kik', 'kyk', 'kyc', 'kyq', 'dyk', 'dyq', 'dyc', 'kkk', 'jyz', 'prk', 'prc', 'prq', 'mic', 'mik', 'miq', 'myc', 'myk', 'myq', 'guc', 'guk', 'guq', 'giz', 'gzz', 'sex', 'sxx', 'sxi', 'sxe', 'sxy', 'xxx', 'wac', 'wak', 'waq', 'wck', 'pot', 'thc', 'vaj', 'vjn', 'nut', 'std', 'lsd', 'poo', 'azn', 'pcp', 'dmn', 'orl', 'anl', 'ans', 'muf', 'mff', 'phk', 'phc', 'phq', 'xtc', 'tok', 'toc', 'toq', 'mlf', 'rac', 'rak', 'raq', 'rck', 'sac', 'sak', 'saq', 'pms', 'nad', 'ndz', 'nds', 'wtf', 'sol', 'sob', 'fob', 'sfu'];

function getNumberWithOrdinal(n) {
    const s = ["th", "st", "nd", "rd"];
    const v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

function TopScoreSubmission({score, goToScores}) {
    const [error, setError] = useState(false);
    const [isSubmitting, setSubmitting] = useState(false);
    const initialsRef = useRef(null);

    async function handleSubmit(e) {
        e.preventDefault();

        setSubmitting(true);

        // initials input validation
        let initials = initialsRef.current.value.toUpperCase();
        
        // make sure it's only letters
        const lettersRegEx = /^[a-zA-Z]*$/g;
        if (!lettersRegEx.test(initials)) {
            setError('Letters Only');
            setSubmitting(false);
            return;
        }

        // check bad words
        if (badWords.includes(initials.toLowerCase())) {
            setError('No Bad Words');
            setSubmitting(false);
            return;
        }

        // submit
        const submission = {
            'score': score,
            'by': initials,
            'timestamp': Date.now()
        };  
        const res = await addScore(submission);

        setSubmitting(false);

        // go to score list and refresh scores
        goToScores(true);
    }

    function initialsFocus(input) {
        setError(false); 
        initialsRef.current.value = '';
    }

    useEffect(() => {
        initialsRef.current.focus();
    }, []);

    return (
        <>
            <h3 className="mb-2 text-xl font-arcade tracking-wide">That's a Top Score!</h3>
            {isSubmitting && <p className="font-arcade tracking-wide">Submitting...</p>}
            {error && <p className="font-arcade tracking-wide">{error}</p>}
            {!isSubmitting && 
                <>
                    <form onSubmit={e => handleSubmit(e)} className="flex gap-2 justify-center">
                        <input type="text" onFocus={initialsFocus} required placeholder="A A A" maxLength="3" ref={initialsRef} className="font-arcade text-white bg-inherit border-2 px-2 w-14" />
                        <button type="submit" className="font-arcade">Post</button>
                    </form>
                    <p className="mt-2 font-arcade"><button onClick={() => goToScores(false)}>Or, Skip to Scores</button></p>
                </>
            }
        </>
    );
}

function Score({rank, score}) {
    const rankWithOrdinal = getNumberWithOrdinal(rank + 1);
    const dateOutput = new Date(score.timestamp).toLocaleDateString();

    return (
        <li className="table-row font-arcade">
            <span className="table-cell">{rankWithOrdinal}</span>
            <span className="table-cell">{score.score}</span>
            <span className="table-cell">{score.by}</span>
            <span className="table-cell">{dateOutput}</span>
        </li>
    );
}

function ScoreList({scores, isLoading}) {

    return (
        <>
            <h3 className="text-xl tracking-wide font-arcade">Flappy Dude Top Scores</h3>
            { scores && 
                <ul className="table w-full font-arcade tracking-wide">
                    <li className="table-row">
                        <span className="table-cell">Rank</span>
                        <span className="table-cell">Score</span>
                        <span className="table-cell">Name</span>
                        <span className="table-cell">Date</span>
                    </li>
                    { scores.map( (score, i) => <Score key={i} rank={i} score={score} /> ) }
                </ul>
            }
            {isLoading && 
                <p className="tracking-wide font-arcade">Loading...</p>
            }        
        </>
    );
}

export default function Scoreboard({score}) {
    const [isLoading, setLoading] = useState(true);
    const [scores, setScores] = useState([]);
    const [isHighScore, setHighScore] = useState(false);
    const [isScoreRecorded, setScoreRecorded] = useState(false);

    async function fetchData() {
        setLoading(true);
        const res = await getTopTenScores('flappydude');
        setScores([...res]);
        setLoading(false);

        // check to see if this is a high score
        const userScore = score;
        res.map(score => {
            userScore > score.score && setHighScore(true);
        });
    }

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div onClick={e => e.stopPropagation()} className="border-2 px-8 py-6 cursor-auto">
            {isLoading && <p className="tracking-wide font-arcade">Loading...</p>}
            {(isHighScore && !isScoreRecorded) && 
                <TopScoreSubmission score={score} goToScores={(refreshScoreList) => {
                    setScoreRecorded(true);
                    refreshScoreList && fetchData();
                }} />
            }
            {(!isHighScore || isScoreRecorded) &&
                <ScoreList scores={scores} isLoading={isLoading} />
            }
        </div>
    );
}