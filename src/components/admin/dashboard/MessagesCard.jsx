import { Link } from 'react-router-dom';

export default function MessagesCard({ messages }) {
  return (
    <section className="dash-card">
      <h2>Latest messages</h2>

      {messages.length === 0 ? (
        <p className="dash-empty">No messages yet.</p>
      ) : (
        <ul className="dash-msgs">
          {messages.map((m) => (
            <li key={m.id}>
              <div className="dash-msg-top">
                <strong>{m.name}</strong>
                {m.isNew && <span className="dash-new">New</span>}
              </div>
              <p>{m.text}</p>
            </li>
          ))}
        </ul>
      )}

      <Link to="/admin/massage" className="dash-btn">Open inbox</Link>
    </section>
  );
}