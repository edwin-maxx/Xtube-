class CustomNavbar extends HTMLElement {
  connectedCallback() {
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
      <style>
        nav {
          background: rgba(15, 15, 30, 0.85);
          backdrop-filter: blur(18px);
          padding: 1rem 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          position: sticky;
          top: 0;
          z-index: 1000;
          border-bottom: 1px solid rgba(176,110,255,0.1);
          font-family: 'Inter', sans-serif;
        }
        .logo-group { display: flex; align-items: center; gap: 0.5rem; }
        .logo {
          font-weight: 900;
          font-size: 1.6rem;
          background: linear-gradient(90deg,#6b46c1,#d53f8c,#60cdf6);
          -webkit-background-clip: text;
          color: transparent;
        }
        .menu-toggle {
          display: none;
          background: none;
          border: none;
          cursor: pointer;
          color: #fff;
        }
        .menu-toggle .bar {
          width: 25px;
          height: 3px;
          background: #7289da;
          margin: 4px 0;
          border-radius: 2px;
        }
        ul {
          display: flex;
          gap: 1.8rem;
          list-style: none;
          margin: 0;
          padding: 0;
        }
        a {
          color: #fff;
          text-decoration: none;
          font-weight: 500;
        }
        a.active { color: #7289da; font-weight: 700; }
        @media (max-width:900px) {
          nav { flex-direction: column; align-items: flex-start; padding: 1rem; }
          .menu-toggle { display: block; position: absolute; right: 1rem; top: 1rem; }
          ul { display: none; flex-direction: column; width: 100%; margin-top: 10px; }
          nav.open ul { display: flex; }
        }
      </style>
      <nav>
        <div class="logo-group">
          <span class="logo">XemoTube</span>
        </div>
        <button class="menu-toggle" aria-label="Open Menu">
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
        const nav = this.shadowRoot.querySelector('nav');
        const toggle = this.shadowRoot.querySelector('.menu-toggle');
        const links = this.shadowRoot.querySelectorAll('a.nav-link');

        toggle.addEventListener('click', () => {
          nav.classList.toggle('open');
        });

        this.shadowRoot.addEventListener('click', e => {
          if(e.target.closest('a.nav-link')) nav.classList.remove('open');
        });

        
        setTimeout(()=>{
          const path = location.pathname.split('/').pop();
          for(const a of links){
            if(a.getAttribute('href') === "/" && (path === "" || path === "index.html")){
              a.classList.add('active');
            } else if(a.getAttribute('href').endsWith(path)){
              a.classList.add('active');
            }
          }
        }, 50);
      </script>
    `;
  }
}
customElements.define('custom-navbar', CustomNavbar);
