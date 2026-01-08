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
          cursor: grab;
          box-shadow: 0 15px 40px rgba(0,0,0,.5);
          color: white;
          font-size: 26px;
          user-select: none;
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
          padding: 10px;
          background: #1a1d2e;
          border-bottom: 1px solid #2b2f4a;
          display: flex;
          justify-content: space-between;
          font-weight: 700;
          font-size: 14px;
        }

        .online {
          color: #3ba55d;
          font-size: 12px;
        }

        .messages {
          flex: 1;
          padding: 10px;
          overflow-y: auto;
          font-size: 14px;
        }

        .msg {
          margin-bottom: 8px;
        }

        .msg b {
          color: #7289da;
        }

        .mention {
          font-weight: 800;
          color: #faa61a;
          background: rgba(250,166,26,.15);
          padding: 2px 6px;
          border-radius: 6px;
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
          <header>
            <span>🌍 Global Chat</span>
            <span class="online">● 0 online</span>
          </header>
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
    this.onlineEl = this.shadowRoot.querySelector(".online");

    this.username = localStorage.getItem("xemo_username");
    if (!this.username) {
      this.username = prompt("Choose a username");
      if (this.username) localStorage.setItem("xemo_username", this.username);
    }

    this.orb.onclick = () => {
      this.overlay.style.display = "block";
      if (!this.loaded) this.loadHistory();
    };

    this.overlay.onclick = e => {
      if (e.target === this.overlay) this.overlay.style.display = "none";
    };

    this.sendBtn.onclick = () => this.send();
    this.input.addEventListener("keydown", e => e.key === "Enter" && this.send());

    this.makeDraggable();
    this.loadSocket();
  }

  async loadHistory() {
    this.loaded = true;
    const res = await fetch("/api/messages");
    const msgs = await res.json();
    msgs.forEach(m => this.appendMsg(m));
  }

  loadSocket() {
    const s = document.createElement("script");
    s.src = "/socket.io/socket.io.js";
    s.onload = () => {
      this.socket = io();

      this.socket.on("chat-message", msg => this.appendMsg(msg));
      this.socket.on("online-users", n => {
        this.onlineEl.textContent = `● ${n} online`;
      });
    };
    document.head.appendChild(s);
  }

  appendMsg(msg) {
    const highlighted = msg.text.replace(
      /@(\w+)/g,
      '<span class="mention">@$1</span>'
    );

    this.msgBox.innerHTML += `
      <div class="msg"><b>${msg.username}</b>: ${highlighted}</div>
    `;
    this.msgBox.scrollTop = this.msgBox.scrollHeight;
  }

  send() {
    if (!this.input.value) return;
    this.socket.emit("chat-message", {
      username: this.username,
      text: this.input.value
    });
    this.input.value = "";
  }

  makeDraggable() {
    let dragging = false, ox, oy;

    this.orb.addEventListener("pointerdown", e => {
      dragging = true;
      ox = e.clientX - this.orb.offsetLeft;
      oy = e.clientY - this.orb.offsetTop;
      this.orb.setPointerCapture(e.pointerId);
    });

    window.addEventListener("pointermove", e => {
      if (!dragging) return;
      this.orb.style.left = `${e.clientX - ox}px`;
      this.orb.style.top = `${e.clientY - oy}px`;
      this.orb.style.right = "auto";
      this.orb.style.bottom = "auto";
    });

    window.addEventListener("pointerup", () => dragging = false);
  }
}

customElements.define("floating-chat", FloatingChat);
