import React, { useEffect, useRef, useState } from 'react';

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

    const onSend = () => {
        const prompt = inputRef.current.value;
        inputRef.current.value = '';
        talks.push({ prompt });
        setTalks([...talks]);
        getAnswer(prompt);
        console.log('send message', prompt);
    }

    const getAnswer = async (prompt) => {
        const res = await fetch('https://www.baidu.com');
        const content = await res.text();
        console.log(content, 'xxxxxxxxxxxxxxxxxx');
    }

    const renderTalks = () => {
        return talks.map((talk, key) => {
            return (
                <div className="d:f fd:c mt:10" key={key}>
                    <div className="d:f jc:fe c:fff">
                        <div className="maw:80% p:8 bw:1 bs:s bc:ddd br:8 bgc:3b3abe ww:bw">{talk.prompt}</div>
                    </div>
                    <div className="d:f jc:fs mt:8">
                        <div className="maw:80% p:8 bw:1 bs:s bc:ddd br:8 ww:bw">等待答案中</div>
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