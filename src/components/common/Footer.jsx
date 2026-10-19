import "./Footer.css";


const columns = [
  { title: "Shop", links: ["All Products", "Skincare", "Makeup", "Haircare", "Bodycare"] },
  { title: "Customer Care", links: ["All Products", "Skincare", "Makeup", "Haircare", "Bodycare"] },
  { title: "Company", links: ["All Products", "Skincare", "Makeup", "Haircare", "Bodycare"] },
  { title: "Contact Us", links: ["All Products", "Skincare", "Makeup", "Haircare", "Bodycare"] },
];

const socials = [
  {
    name: "Instagram",
    href: "#",
    icon: (
      <>
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="0.5" />
      </>
    ),
  },
  {
    name: "Facebook",
    href: "#",
    icon: <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />,
  },
  {
    name: "YouTube",
    href: "#",
    icon: (
      <>
        <path d="M22.5 6.4a2.8 2.8 0 0 0-2-2C18.9 4 12 4 12 4s-6.9 0-8.5.4a2.8 2.8 0 0 0-2 2A29 29 0 0 0 1 11.8a29 29 0 0 0 .5 5.3 2.8 2.8 0 0 0 2 2c1.6.4 8.5.4 8.5.4s6.9 0 8.5-.4a2.8 2.8 0 0 0 2-2 29 29 0 0 0 .5-5.3 29 29 0 0 0-.5-5.4z" />
        <polygon points="9.75 15 15.5 11.8 9.75 8.5 9.75 15" />
      </>
    ),
  },
  {
    name: "TikTok",
    href: "#",
    icon: <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />,
  },
];

function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div className="footer__grid">
          {/* Brand + newsletter */}
          <div className="footer__brand">
            <h3 className="footer__brand-title">Stay Glowing</h3>
            <p className="footer__newsletter">
              Join our newsletter and get 10% off your first order.
            </p>
            <div className="footer__socials">
              {socials.map((s) => (
                <a key={s.name} href={s.href} aria-label={s.name}>
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    {s.icon}
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {columns.map((col) => (
            <div key={col.title} className="footer__column">
              <h4 className="footer__title">{col.title}</h4>
              <ul className="footer__links">
                {col.links.map((link) => (
                  <li key={link}>
                    <a href="#">{link}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <p className="footer__copy">
          © 2026 Cherry Cheeks Beauty. All Rights Reserved
        </p>
      </div>
    </footer>
  );
}

export default Footer;