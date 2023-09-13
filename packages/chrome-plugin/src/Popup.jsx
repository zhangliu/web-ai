import React, { useEffect, useRef, useState } from 'react';

const ACTION = 'web-ai-runJs';

export default () => {
    const inputRef = useRef();
    const [talks, setTalks] = useState([]);

    useEffect(() => {
        if (!inputRef.current) return;

        const onKeyDown = event => {
            if ((event.code || '').toLowerCase() !== 'enter') return;
            onSend();
            
        }
        inputRef.current.addEventListener('keydown', onKeyDown);

        return () => inputRef.current.removeEventListener('keydown', onKeyDown);
    }, [inputRef.current]);

    const onSend = async () => {
        const question = inputRef.current.value;
        inputRef.current.value = '';
        const talk = { question, answer: '等待答案中...' };
        talks.push(talk);
        setTalks([...talks]);
        const answer = await getAnswer(talk);
        console.log(`get answer:`, answer);
        talk.answer = answer;
        setTalks([...talks]);

        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.tabs.sendMessage(tabs[0].id, { action: ACTION, data: answer }, (response) => {
              console.log("接收到来自内容脚本的响应:", response);
            });
        });
    }

    const getAnswer = async (talk) => {
        const res = await fetch(`http://0.0.0.0:3033/question?question=${talk.question}`);
        return await res.text();
    }

    const renderTalks = () => {
        return talks.map((talk, key) => {
            return (
                <div className="d:f fd:c mt:10" key={key}>
                    <div className="d:f jc:fe c:fff">
                        <div className="maw:80% p:8 bw:1 bs:s bc:ddd br:8 bgc:3b3abe ww:bw">{talk.question}</div>
                    </div>
                    <div className="d:f jc:fs mt:8">
                        <div className="maw:80% p:8 bw:1 bs:s bc:ddd br:8 ww:bw">{talk.answer}</div>
                    </div>
                </div>
            )
        })
    }

    return (
        <div className="w:360 d:f fd:c" style={{ boxSizing: "border-box" }}>
            <div className="h:520 bc:ddd bs:s bw:1 br:4 p:8 mb:10 ofy:a">
                {renderTalks()}
            </div>
            <div className="d:f ai:c jc:sb w:100%">
                <input ref={inputRef} className="w:100% pl:8 pr:8 lh:20" />
                <button className="w:120 ml:6 h:26" onClick={onSend}>发送</button>
            </div>
        </div>
    )
}