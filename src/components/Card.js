import useLocalStorage from '../hooks/useLocalStorage';
import { useState, useEffect } from 'react';

const Card = () => {
    const [exam, setExam] = useLocalStorage('exam', 1),
        [question, setQuestion] = useLocalStorage('question', 1),
        lastExam = 23,
        lastQuestion = 50,
        regex = `^${question}+\\.\\s+(.+)((\\s+\\-\\s+[A-Z]\\.\\s.+)+)\\s+.+\\s+(Correct .+)$`,
        [data, setData] = useState({
            question: '',
            answer: '',
            choices: []
        }),
        [random, setRandom] = useState(false),
        [reveal, setReveal] = useState(false),
        fetchExam = () => {
            const fileName = `practice-exam-${exam}.md`,
                file = require(`../exams/${fileName}`);

            fetch(file)
                .then((res) => {
                    return res.text();
                }).then((text) => {
                    const r = new RegExp(regex, 'm'),
                        m = r.exec(text);
                    console.log(regex, m);
                    if (m) {
                        setData({
                            question: m[1],
                            answer: m[4],
                            choices: (m[2]).split('\n    - ')
                        });
                    }
                });
        },
        nextExam = (reverse = false) => {
            setQuestion(1);
            if (exam > lastExam) setExam(lastExam);
            if (!reverse && exam == lastExam) setExam(1);
            else if (reverse && exam == 1) setExam(lastExam);
            else setExam(reverse ? exam - 1 : exam + 1);
        },
        nextQuestion = (reverse = false) => {
            setReveal(false);
            if (question > lastQuestion) setQuestion(lastQuestion);
            if (random) {
                const rE = Math.floor(Math.random() * lastExam) + 1,
                    rQ = Math.floor(Math.random() * lastQuestion) + 1;
                console.log(rE, rQ);
                setExam(rE == exam ? rE++ : rE);
                setQuestion(rQ == question ? rQ++ : rQ);
                return;
            }
            if (!reverse && question == lastQuestion) nextExam();
            else if (reverse && question == 1) nextExam(reverse);
            else setQuestion(reverse ? question - 1 : question + 1);
        },
        reset = () => {
            setQuestion(1);
            setExam(1);
        },
        toggleRandom = () => {
            setRandom(!random);
        },
        getChoices = (choices) => {
            let t = [];
            for (let i = 1; i < choices.length; i++) {
                t.push(<div className="choice">{choices[i]}</div>);
            }

            return <div>{t}</div>;
        },
        goTo = (e) => {
            e.preventDefault();
            let ex = document.getElementById('goto-exam').value,
                q = document.getElementById('goto-question').value;

            if (ex > lastExam) ex = lastExam;
            if (q > lastQuestion) q = lastQuestion;
            setExam(ex ? ex : exam);
            setQuestion(q ? q : question);
        };

    document.onkeydown = function (event) {
        switch (event.keyCode) {
            case 37:
                nextQuestion(true);
                break;
            case 39:
                nextQuestion();
                break;
        }
    };

    useEffect(() => {
        fetchExam();
    }, [exam, question]);

    return (
        <div className='card-container'>
            <div className='card-controls'>
                <div className='logo'>
                    <img src={`${process.env.PUBLIC_URL}/logo192.png`}
                        alt="AWS" width={100} height={100} />
                </div>
                <div className="next" onClick={nextQuestion}>
                    <span>Next</span>
                </div>
                <div className={`random ${random ? 'enabled' : 'disabled'}`} onClick={toggleRandom}>
                    <span>Random</span>
                </div>
                <div className="reset" onClick={reset}>
                    <span>Reset</span>
                </div>
            </div>
            <div className={`card ${reveal ? 'show' : ''}`} onClick={() => { setReveal(!reveal) }}>
                <div className='card-front'>
                    <div className="question" dangerouslySetInnerHTML={{ __html: data.question }}></div>
                    <div className="choices">{getChoices(data.choices)}</div>
                </div>
                <div className='card-back'>
                    <div className="question" dangerouslySetInnerHTML={{ __html: data.question }}></div>
                    <div className="answer">{data.answer}</div>
                </div>
            </div>
            <div className='card-controls'>
                <form className='card-goto' onSubmit={goTo}>
                    <label for="goto-exam">Navigate to</label>
                    <input name="exam" placeholder='Exam' id="goto-exam"
                        type="number" min="1" max={lastExam} required="true" />
                    <input name="question" placeholder='Question' id="goto-question"
                        type="number" min="1" max={lastQuestion} required="true" />
                    <button className='goto-submit'>
                        <span>GO</span>
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Card;