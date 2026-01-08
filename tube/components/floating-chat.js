class FloatingChat extends HTMLElement {
  connectedCallback() {
    this.attachShadow({ mode: "open" });

    this.shadowRoot.innerHTML = `
      <style>
        :host { position: fixed; z-index: 9999; }

        .orb {
          position: fixed;
          bottom: 25px;
          right: 25px;
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: linear-gradient(145deg,#5865f2,#404eed);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 0 15px 40px rgba(0,0,0,.5);
          color: white;
          font-size: 26px;
        }

        .overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,.45);
          display: none;
        }

        .panel {
          position: absolute;
          right: 20px;
          bottom: 100px;
          width: min(420px, 95vw);
          height: 60vh;
          background: #0f111a;
          border-radius: 18px;
          display: flex;
          flex-direction: column;
          box-shadow: 0 20px 60px rgba(0,0,0,.6);
          overflow: hidden;
        }

        header {
          padding: 12px;
          background: #1a1d2e;
          font-weight: 700;
          text-align: center;
          border-bottom: 1px solid #2b2f4a;
        }

        .messages {
          flex: 1;
          padding: 10px;
          overflow-y: auto;
        }

        .msg {
          margin-bottom: 8px;
          font-size: 14px;
        }

        .msg b {
          color: #7289da;
        }

        footer {
          padding: 10px;
          border-top: 1px solid #2b2f4a;
          display: flex;
          gap: 6px;
        }

        input {
          flex: 1;
          background: #10121c;
          border: 1px solid #2b2f4a;
          color: white;
          padding: 8px;
          border-radius: 8px;
        }

        button {
          background: #5865f2;
          border: none;
          padding: 8px 14px;
          border-radius: 8px;
          color: white;
          cursor: pointer;
        }
      </style>

      <div class="orb">💬</div>

      <div class="overlay">
        <div class="panel">
          <header>🌍 Global Chat</header>
          <div class="messages"></div>
          <footer>
            <input placeholder="Message..." />
            <button>Send</button>
          </footer>
        </div>
      </div>
    `;

    this.orb = this.shadowRoot.querySelector(".orb");
    this.overlay = this.shadowRoot.querySelector(".overlay");
    this.msgBox = this.shadowRoot.querySelector(".messages");
    this.input = this.shadowRoot.querySelector("input");
    this.sendBtn = this.shadowRoot.querySelector("button");

    this.username = localStorage.getItem("xemo_username");
    if (!this.username) {
      this.username = prompt("Choose a username");
      if (this.username) {
        localStorage.setItem("xemo_username", this.username);
      }
    }

    this.orb.onclick = () => this.overlay.style.display = "block";
    this.overlay.onclick = e => {
      if (e.target === this.overlay) this.overlay.style.display = "none";
    };

    this.sendBtn.onclick = () => this.send();
    this.input.addEventListener("keydown", e => {
      if (e.key === "Enter") this.send();
    });

    this.loadSocket();
  }

  loadSocket() {
    const script = document.createElement("script");
    script.src = "/socket.io/socket.io.js";
    script.onload = () => {
      this.socket = io();

      this.socket.on("chat-message", msg => {
        this.msgBox.innerHTML += `
          <div class="msg"><b>${msg.username}</b>: ${msg.text}</div>
        `;
        this.msgBox.scrollTop = this.msgBox.scrollHeight;
      });
    };
    document.head.appendChild(script);
  }

  send() {
    if (!this.input.value) return;

    this.socket.emit("chat-message", {
      username: this.username,
      text: this.input.value
    });

    this.input.value = "";
  }
}

customElements.define("floating-chat", FloatingChat);
