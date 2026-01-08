class CustomNavbar extends HTMLElement {
  connectedCallback() {
    this.attachShadow({ mode: "open" });
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1000;
        }

        nav {
          height: 64px;
          background: rgba(15, 15, 30, 0.92);
          backdrop-filter: blur(18px);
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 1.5rem;
          border-bottom: 1px solid rgba(176,110,255,0.15);
          font-family: 'Inter', system-ui, sans-serif;
        }

        .logo-group {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .logo {
          font-weight: 900;
          font-size: 1.4rem;
          background: linear-gradient(90deg,#6b46c1,#d53f8c,#60cdf6);
          -webkit-background-clip: text;
          color: transparent;
        }

        .menu-toggle {
          display: none;
          background: none;
          border: none;
          cursor: pointer;
        }

        .menu-toggle .bar {
          width: 26px;
          height: 3px;
          background: #7289da;
          margin: 5px 0;
          border-radius: 2px;
        }

        ul {
          display: flex;
          gap: 1.6rem;
          list-style: none;
          margin: 0;
          padding: 0;
        }

        a {
          color: #fff;
          text-decoration: none;
          font-weight: 500;
        }

        a.active {
          color: #7289da;
          font-weight: 700;
        }

        /* ===== MOBILE ===== */
        @media (max-width: 900px) {
          .menu-toggle {
            display: block;
          }

          ul {
            position: absolute;
            top: 64px;
            left: 0;
            right: 0;
            background: rgba(15, 15, 30, 0.97);
            backdrop-filter: blur(16px);
            flex-direction: column;
            gap: 1rem;
            padding: 1rem 1.5rem;
            display: none;
            border-bottom: 1px solid rgba(176,110,255,0.15);
          }

          nav.open ul {
            display: flex;
          }
        }
      </style>

      <nav>
        <div class="logo-group">
          <span class="logo">XemoTube</span>
        </div>

        <button class="menu-toggle" aria-label="Toggle menu">
          <span class="bar"></span>
          <span class="bar"></span>
          <span class="bar"></span>
        </button>

        <ul>
          <li><a href="/" class="nav-link">Home</a></li>
          <li><a href="/upload" class="nav-link">Upload</a></li>
          <li><a href="/watch" class="nav-link">Chat Room</a></li>
        </ul>
      </nav>

      <script>
        const nav = this.shadowRoot.querySelector("nav");
        const toggle = this.shadowRoot.querySelector(".menu-toggle");
        const links = this.shadowRoot.querySelectorAll(".nav-link");

        toggle.addEventListener("click", () => {
          nav.classList.toggle("open");
        });

        this.shadowRoot.addEventListener("click", e => {
          if (e.target.closest(".nav-link")) {
            nav.classList.remove("open");
          }
        });

        setTimeout(() => {
          const path = location.pathname;
          links.forEach(a => {
            if (a.getAttribute("href") === path) {
              a.classList.add("active");
            }
            if (path === "/" && a.getAttribute("href") === "/") {
              a.classList.add("active");
            }
          });
        }, 50);
      </script>
    `;
  }
}

customElements.define("custom-navbar", CustomNavbar);
