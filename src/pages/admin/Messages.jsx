import { useState } from "react";
import AdminHeader from "../../components/admin/AdminHeader";
import "./Messages.css";

// ---------- Frontend-only storage (browser localStorage, no backend) ----------
const STORAGE_KEY = "cherrycheeks_messages";

//----It Just Example To Call Message From Contact-Page----//->
// const SEED = [
//   {
//     id: 1,
//     name: "Sokha Chen",
//     email: "sokhachen@gmail.com",
//     text: "Is the Rose Glow Serum suitable for sensitive skin?",
//     createdAt: new Date().toISOString(),
//     read: false,
//   },
// ];

function getMessages() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === null) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED));
      return SEED;
    }
    return JSON.parse(raw);
  } catch {
    return SEED;
  }
}

function saveMessages(list) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch {
    // storage blocked: the page still works in memory
  }
}

// "Today" for same-day messages, otherwise a short date
function formatDate(iso) {
  const d = new Date(iso);
  if (d.toDateString() === new Date().toDateString()) return "Today";
  return d.toLocaleDateString(undefined, { day: "numeric", month: "short" });
}

export default function Messages() {
  // Frontend only: messages live in the browser (localStorage)
  const [messages, setMessages] = useState(getMessages);
  const [filter, setFilter] = useState("all");

  const update = (next) => {
    setMessages(next);
    saveMessages(next);
  };

  const markRead = (id) =>
    update(messages.map((m) => (m.id === id ? { ...m, read: true } : m)));

  const remove = (id) => {
    if (!window.confirm("Delete this message?")) return;
    update(messages.filter((m) => m.id !== id));
  };

  const visible = messages.filter((m) =>
    filter === "all" ? true : filter === "new" ? !m.read : m.read
  );

  return (
    <>
      <AdminHeader title="Messages" subtitle="Questions from the contact form." />

      <div className="messages">
        <div className="messages__select-wrap">
          <select
            className="messages__select"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            aria-label="Filter messages"
          >
            <option value="all">All</option>
            <option value="new">New</option>
            <option value="read">Read</option>
          </select>
          <svg
            className="messages__chevron"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>

        <ul className="messages__list">
          {visible.map((m) => (
            <li
              key={m.id}
              className={`messages__item ${m.read ? "is-read" : ""}`}
            >
              <div className="messages__body">
                <p className="messages__meta">
                  <strong className="messages__name">{m.name}</strong>
                  {!m.read && <span className="messages__badge">New</span>}
                  <span className="messages__email">
                    {m.email}. {formatDate(m.createdAt)}
                  </span>
                </p>
                <p className="messages__text">{m.text}</p>
              </div>

              <div className="messages__actions">
                <button
                  type="button"
                  className="messages__btn"
                  onClick={() => markRead(m.id)}
                  disabled={m.read}
                >
                  {m.read ? "Read" : "Mark read"}
                </button>
                <button
                  type="button"
                  className="messages__btn messages__btn--danger"
                  onClick={() => remove(m.id)}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>

        {visible.length === 0 && (
          <p className="messages__empty">No messages here.</p>
        )}
      </div>
    </>
  );
}