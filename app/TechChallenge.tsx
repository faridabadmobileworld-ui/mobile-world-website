"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { IconArrow, IconCheck, IconWhatsApp } from "@/components/Icons";
import { slideEnquiry } from "@/data/storefront";
import "./tech-challenge.css";

const questions = [
  {
    question: "नया smartphone चुनने की शुरुआत कहाँ से करें?",
    options: ["सबसे बड़ा specification number देखकर", "अपनी ज़रूरत और budget तय करके", "सिर्फ़ colour देखकर"],
    answer: 1,
    explanation: "Camera, पढ़ाई, काम या रोज़ का इस्तेमाल — पहले अपनी ज़रूरत और budget तय कीजिए। फिर उनके हिसाब से models की तुलना कीजिए।",
    guide: "/posts/new-phones", guideLabel: "नया phone लेने की guide पढ़िए",
  },
  {
    question: "Camera की पसंद तय करने का बेहतर तरीक़ा क्या है?",
    options: ["सिर्फ़ megapixels गिनना", "सिर्फ़ camera का आकार देखना", "अपनी ज़रूरत के sample photos और videos देखना"],
    answer: 2,
    explanation: "Megapixels पूरी कहानी नहीं बताते। दिन और कम रोशनी के sample photos, portraits और video देखकर अपने लिए तुलना कीजिए।",
    guide: "/products", guideLabel: "Models की तुलना कीजिए",
  },
  {
    question: "पुराना phone exchange करने से पहले क्या ज़रूरी है?",
    options: ["ज़रूरी data का backup और उसे restore कर पाने की जाँच", "सिर्फ़ cover उतार देना", "Phone के साथ अपना account password दे देना"],
    answer: 0,
    explanation: "पहले backup और नए device पर data मिलने की जाँच कीजिए। फिर brand के निर्देशों के अनुसार accounts हटाकर पुराने phone का data erase कीजिए। अपना password किसी को मत दीजिए।",
    guide: "/posts/phone-exchange-guide", guideLabel: "Exchange से पहले की तैयारी पढ़िए",
  },
  {
    question: "Storage variant चुनते समय किस बात पर ध्यान दें?",
    options: ["सिर्फ़ phone का colour", "अपने apps, photos, videos और आगे की ज़रूरत", "हर व्यक्ति के लिए एक ही storage सही है"],
    answer: 1,
    explanation: "अभी कितनी जगह इस्तेमाल होती है और आगे कितना data रखना है — दोनों देखिए। RAM और storage अलग चीज़ें हैं; इन्हें एक मत समझिए।",
    guide: "/posts/new-phones", guideLabel: "Phone चुनने की guide पढ़िए",
  },
  {
    question: "पसंदीदा model देखने दुकान आने से पहले क्या करें?",
    options: ["किसी पुराने poster को current stock मान लें", "सिर्फ़ screenshot देखकर उपलब्धता तय कर लें", "Model, variant और colour की उपलब्धता team से पूछें"],
    answer: 2,
    explanation: "Model का नाम, storage और colour WhatsApp पर भेज दीजिए। Team से उपलब्धता पूछ लेने पर आपका चक्कर बेकार नहीं जाएगा।",
    guide: "/visit", guideLabel: "दुकान आने की जानकारी देखिए",
  },
] as const;

export function TechChallenge() {
  const [started, setStarted] = useState(false);
  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answers, setAnswers] = useState<number[]>([]);
  const questionHeading = useRef<HTMLHeadingElement>(null);
  const finished = step === questions.length;
  const current = questions[Math.min(step, questions.length - 1)];
  const checked = answers.length > step;
  const score = answers.filter((answer, index) => answer === questions[index].answer).length;

  useEffect(() => {
    if (started) questionHeading.current?.focus({ preventScroll: true });
  }, [started, step]);

  function restart() {
    setStep(0); setSelected(null); setAnswers([]); setStarted(true);
  }

  return <section id="tech-challenge" className="tech-challenge" aria-labelledby="challenge-title">
    <div className="tech-challenge-intro">
      <p className="tech-challenge-overline">DIWALI TECH CHALLENGE · खेलते हुए सीखिए</p>
      <h2 id="challenge-title">थोड़ा खेलिए।<br/><span>समझकर चुनिए।</span></h2>
      <p className="tech-challenge-description">Phone ख़रीदने की पाँच छोटी बातें। अपना जवाब चुनिए, वजह समझिए और देखिए आप कितना जानते हैं।</p>
      <div className="tech-challenge-badges"><span>5 सवाल</span><span>लगभग 2 मिनट</span><span>Free · बिना login</span></div>
      <div className="tech-challenge-note"><span aria-hidden="true">✦</span><p>यह knowledge score है। इसके बदले cash, discount या gift नहीं मिलता।</p></div>
      <Link href="/posts" className="tech-challenge-guide">पहले buying guides पढ़ना चाहेंगे? <IconArrow /></Link>
    </div>
    <div className="tech-challenge-card">
      {!started ? <div className="tech-challenge-welcome">
        <div className="tech-challenge-seal" aria-hidden="true"><span>MOBILE WORLD</span><strong>5</strong><span>छोटी बातें · सही शुरुआत</span></div>
        <h3>आपकी अगली ख़रीदारी,<br/>थोड़ी और समझदारी से।</h3>
        <p>हर जवाब के बाद एक काम की बात मिलेगी।</p>
        <button className="tech-challenge-button" type="button" onClick={restart}>Challenge शुरू कीजिए <IconArrow /></button>
      </div> : finished ? <div className="tech-challenge-result">
        <p className="tech-challenge-overline">CHALLENGE पूरा हुआ</p>
        <h3 ref={questionHeading} tabIndex={-1}>आपका knowledge score</h3>
        <div className="tech-challenge-score"><strong>{score}</strong><span>/ {questions.length}</span></div>
        <p>{score === questions.length ? "पाँचों बातें सही! अब अपनी ज़रूरत के models आराम से देखिए।" : "हर नई बात बेहतर फ़ैसले की शुरुआत है। नीचे अपने जवाब और उनकी वजह देखिए।"}</p>
        <details className="tech-challenge-review"><summary>अपने जवाब और वजह देखिए</summary><ol>{questions.map((question, index) => <li key={question.question}>
          <strong>{question.question}</strong><span>आपका जवाब: {question.options[answers[index]]}</span>
          <b>{answers[index] === question.answer ? "सही जवाब" : `सही जवाब: ${question.options[question.answer]}`}</b>
          <p>{question.explanation}</p><Link href={question.guide}>{question.guideLabel} <IconArrow /></Link>
        </li>)}</ol></details>
        <div className="tech-challenge-actions"><Link className="tech-challenge-button" href="/products">Models देखिए <IconArrow /></Link><a className="tech-challenge-whatsapp" href={slideEnquiry("अपनी ज़रूरत के हिसाब से सही smartphone चुनने") } target="_blank" rel="noopener noreferrer"><IconWhatsApp /> Team से सलाह लीजिए</a></div>
        <button type="button" className="tech-challenge-restart" onClick={restart}>फिर से खेलिए</button>
      </div> : <form className="tech-challenge-question" onSubmit={event => {
        event.preventDefault();
        if (selected === null || checked) return;
        setAnswers(previous => [...previous, selected]);
      }}>
        <div className="tech-challenge-progress" aria-label={`सवाल ${step + 1}, कुल ${questions.length}`}>
          <span>सवाल {step + 1} / {questions.length}</span><div aria-hidden="true">{questions.map((question, index) => <i key={question.question} className={index <= step ? "is-filled" : ""}/>)}</div>
        </div>
        <h3 ref={questionHeading} tabIndex={-1} id="tech-question">{current.question}</h3>
        <fieldset disabled={checked} aria-labelledby="tech-question">
          <legend className="sr-only">एक जवाब चुनिए</legend>
          {current.options.map((option, index) => <label key={option} className={`tech-challenge-option${selected === index ? " is-selected" : ""}${checked && index === current.answer ? " is-correct" : ""}`}>
            <input type="radio" name="tech-answer" value={index} checked={selected === index} onChange={() => setSelected(index)}/><span>{option}</span>{checked && index === current.answer ? <IconCheck /> : null}
          </label>)}
        </fieldset>
        {checked ? <div className="tech-challenge-feedback" role="status">
          <strong>{selected === current.answer ? "बिलकुल सही।" : "एक काम की बात जानिए।"}</strong>
          <p>{current.explanation}</p><Link href={current.guide}>{current.guideLabel} <IconArrow /></Link>
        </div> : null}
        {checked ? <button key="next" type="button" className="tech-challenge-button" onClick={() => { setStep(value => value + 1); setSelected(null); }}>{step === questions.length - 1 ? "मेरा score देखिए" : "अगला सवाल"}<IconArrow /></button> : <button key="check" type="submit" className="tech-challenge-button" disabled={selected === null}>जवाब देखिए <IconArrow /></button>}
      </form>}
      <p className="tech-challenge-privacy">जवाब इसी page पर रहते हैं। Refresh करने पर score reset हो जाता है। <Link href="/privacy#tech-challenge-privacy">Privacy</Link> · <Link href="/terms#tech-challenge-terms">नियम</Link></p>
    </div>
  </section>;
}
