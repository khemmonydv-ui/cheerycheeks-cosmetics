import "./Contact.css";

// Frontend only: save the message in the browser (same key the admin Messages page reads)
const STORAGE_KEY = "cherrycheeks_messages";

function addMessage({ name, email, topic, text }) {
  try {
    const list = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    list.unshift({
      id: Date.now(),
      name,
      email,
      text: topic ? `[${topic}] ${text}` : text,
      createdAt: new Date().toISOString(),
      read: false,
    });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch {
    // storage blocked: ignore
  }
}

function Contact() {
  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    const topicSelect = form.elements.topic;

    // Frontend only: save in the browser so the admin Messages page can show it
    addMessage({
      name: form.elements.name.value.trim(),
      email: form.elements.email.value.trim(),
      topic: topicSelect.options[topicSelect.selectedIndex].text,
      text: form.elements.message.value.trim(),
    });

    alert("Thank you! We'll reply within one business day.");
    form.reset();
  };

  return (
    <section className="section contact">
      <div className="container">
        <div className="contact__layout">
          {/* LEFT */}
          <div className="contact__info">
            <h1 className="contact__title">
              We&rsquo;d love to hear
              <br />
              from you
            </h1>

            <p className="contact__intro">
              Questions about a shade, an order, or your skin type? Send us a
              message and a member of our team will reply within one business
              day.
            </p>

            <div className="contact__blocks">
              {/* Visit */}
              <div className="contact__block">
                <span className="contact__icon" aria-hidden="true">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                </span>
                <div>
                  <h2 className="contact__block-title">Visit the boutique</h2>
                  <p className="contact__block-text">
                    Open daily, 10 am to 7 pm
                  </p>
                </div>
              </div>

              {/* Customer care */}
              <div className="contact__block">
                <span className="contact__icon" aria-hidden="true">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="3" y="5" width="18" height="14" rx="2" />
                    <polyline points="3 7 12 13 21 7" />
                  </svg>
                </span>
                <div>
                  <h2 className="contact__block-title">Customer care</h2>
                  <p className="contact__block-text">helloe@gmail.com</p>
                  <p className="contact__block-text">+855 974838677</p>
                </div>
              </div>

              {/* Follow */}
              <div className="contact__block">
                <span className="contact__icon" aria-hidden="true">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1.1L12 21l7.8-7.5 1-1.1a5.5 5.5 0 0 0 0-7.8z" />
                  </svg>
                </span>
                <div>
                  <h2 className="contact__block-title">Follow along</h2>
                  <p className="contact__block-text">
                    Instagram, Telegram, Facebook
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="contact__card">
            <h2 className="contact__card-title">Customer information</h2>

            <form className="contact__form" onSubmit={handleSubmit}>
              <div className="contact__row">
                <label className="contact__group">
                  <span className="contact__label">Full name</span>
                  <input
                    className="contact__field"
                    type="text"
                    name="name"
                    placeholder="Your Name"
                    required
                  />
                </label>

                <label className="contact__group">
                  <span className="contact__label">Email</span>
                  <input
                    className="contact__field"
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    required
                  />
                </label>
              </div>

              <label className="contact__group contact__group--topic">
                <span className="contact__label">Topic</span>
                <div className="contact__select-wrap">
                  <select
                    className="contact__field contact__select"
                    name="topic"
                    defaultValue=""
                    required
                  >
                    <option value="">Product advice</option>
                    <option value="order">Order status</option>
                    <option value="shade">Shade matching</option>
                    <option value="skin">Skin type help</option>
                    <option value="other">Other</option>
                  </select>
                  <svg
                    className="contact__chevron"
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
              </label>

              <label className="contact__group contact__group--message">
                <span className="contact__label">Message</span>
                <textarea
                  className="contact__field contact__textarea"
                  name="message"
                  required
                  placeholder="Your Message ....."
                />
              </label>

              <button
                type="submit"
                className="btn btn-primary btn-block contact__submit"
              >
                Sent Message
              </button>

              <p className="contact__note">
                We only use your details to answer your message.
              </p>
            </form>
          </div>
        </div>

        {/* MAP: same width as the contact content */}
        <div className="contact__map">
          <iframe
            title="Our boutique location"
            src="https://www.google.com/maps?q=Phnom+Penh,+Cambodia&z=15&output=embed"
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </section>
  );
}

export default Contact;