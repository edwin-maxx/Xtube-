class CustomNavbar extends HTMLElement {
  connectedCallback() {
    // Inject HTML
    this.innerHTML = `
      <nav id="xemo-navbar">
        <div class="nav-left">
          <span class="logo">XemoTube</span>
        </div>

        <button class="nav-toggle" aria-label="Toggle menu">
          <span></span>
          <span></span>
          <span></span>
        </button>

        <ul class="nav-links">
          <li><a href="/" class="nav-link">Home</a></li>
          <li><a href="/upload" class="nav-link">Upload</a></li>
          <li><a href="/watch" class="nav-link">Chat Room</a></li>
        </ul>
      </nav>

      <style>
      /* Reset */
      #xemo-navbar * { box-sizing: border-box; margin:0; padding:0; }

      /* Navbar */
      #xemo-navbar {
        position: fixed;
        top: 0;
        left: 0;
        right:0;
        height: 64px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: rgba(15,15,30,0.95);
        backdrop-filter: blur(18px);
        padding: 0 1.5rem;
        z-index: 9999;
        border-bottom: 1px solid rgba(176,110,255,0.15);
        font-family: 'Inter', sans-serif;
      }

      /* Logo */
      #xemo-navbar .logo {
        font-weight: 900;
        font-size: 1.5rem;
        background: linear-gradient(90deg,#6b46c1,#d53f8c,#60cdf6);
        -webkit-background-clip: text;
        color: transparent;
      }

      /* Links */
      #xemo-navbar ul {
        display: flex;
        gap: 1.8rem;
        list-style: none;
      }

      #xemo-navbar a {
        text-decoration: none;
        color: #fff;
        font-weight: 500;
        font-size: 1rem;
      }

      #xemo-navbar a.active {
        color: #7289da;
        font-weight: 700;
      }

      /* Hamburger toggle */
      .nav-toggle {
        display: none;
        flex-direction: column;
        justify-content: space-between;
        width: 26px;
        height: 20px;
        background: none;
        border: none;
        cursor: pointer;
      }

      .nav-toggle span {
        display: block;
        height: 3px;
        width: 100%;
        background: #7289da;
        border-radius: 2px;
      }

      /* MOBILE */
      @media (max-width: 900px) {
        .nav-toggle { display: flex; }

        #xemo-navbar ul {
          position: absolute;
          top: 64px;
          left: 0;
          right:0;
          flex-direction: column;
          gap: 1rem;
          background: rgba(15,15,30,0.97);
          backdrop-filter: blur(16px);
          padding: 1rem 1.5rem;
          display: none;
          border-bottom: 1px solid rgba(176,110,255,0.15);
        }

        #xemo-navbar ul.show { display: flex; }

        #xemo-navbar ul li a {
          padding: 0.5rem 0;
          font-size: 1.2rem;
        }
      }
      </style>
    `;

    // Mobile toggle functionality
    const navToggle = this.querySelector('.nav-toggle');
    const navLinks = this.querySelector('.nav-links');

    navToggle.addEventListener('click', () => {
      navLinks.classList.toggle('show');
    });

    // Close mobile menu when link clicked
    this.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => navLinks.classList.remove('show'));
    });

    // Highlight active link
    const path = window.location.pathname === "/" ? "/" : window.location.pathname;
    this.querySelectorAll('.nav-link').forEach(a => {
      if(a.getAttribute('href') === path) a.classList.add('active');
    });
  }
}

// Define custom element
customElements.define('custom-navbar', CustomNavbar);
