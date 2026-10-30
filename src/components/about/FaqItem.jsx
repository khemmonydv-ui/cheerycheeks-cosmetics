/**
 * Collapsed by default; click the question to open the answer.
 * Props: question, answer
 */
export default function FaqItem({ question, answer }) {
  return (
    <details className="faq-item">
      <summary className="faq-item__question">{question}</summary>
      <p className="faq-item__answer">{answer}</p>
    </details>
  );
}