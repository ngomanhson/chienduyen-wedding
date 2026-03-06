/* ══ PETAL CANVAS ══ */
const cvs = document.getElementById("petal-canvas"),
    ctx = cvs.getContext("2d");
function rsz() {
    cvs.width = window.innerWidth;
    cvs.height = window.innerHeight;
}
rsz();
window.addEventListener("resize", rsz);
const COLS = [
    "rgba(201,168,76,.75)",
    "rgba(226,201,126,.65)",
    "rgba(45,122,110,.55)",
    "rgba(255,255,255,.5)",
    "rgba(201,168,76,.5)",
    "rgba(255,200,180,.45)",
];
class Petal {
    constructor(i) {
        this.reset(i);
    }
    reset(i) {
        this.x = Math.random() * cvs.width;
        this.y = i ? Math.random() * cvs.height : -20;
        this.r = 2 + Math.random() * 5.5;
        this.color = COLS[Math.floor(Math.random() * COLS.length)];
        this.vy = 0.45 + Math.random() * 1.1;
        this.vx = (Math.random() - 0.5) * 0.7;
        this.rot = Math.random() * Math.PI * 2;
        this.rotV = (Math.random() - 0.5) * 0.04;
        this.op = 0.35 + Math.random() * 0.6;
        this.type = Math.floor(Math.random() * 3);
        this.sw = Math.random() * 0.025;
        this.swt = Math.random() * 100;
    }
    update() {
        this.swt += this.sw;
        this.x += this.vx + Math.sin(this.swt) * 0.5;
        this.y += this.vy;
        this.rot += this.rotV;
        if (this.y > cvs.height + 30) this.reset();
    }
    draw() {
        ctx.save();
        ctx.globalAlpha = this.op;
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rot);
        ctx.fillStyle = this.color;
        if (this.type === 0) {
            ctx.beginPath();
            ctx.ellipse(0, 0, this.r, this.r * 0.55, 0, 0, Math.PI * 2);
            ctx.fill();
        } else if (this.type === 1) {
            ctx.beginPath();
            ctx.moveTo(0, this.r * 0.5);
            ctx.bezierCurveTo(this.r, -0.2 * this.r, this.r, -this.r, 0, -0.4 * this.r);
            ctx.bezierCurveTo(-this.r, -this.r, -this.r, -0.2 * this.r, 0, this.r * 0.5);
            ctx.fill();
        } else {
            ctx.beginPath();
            ctx.ellipse(0, 0, this.r * 0.45, this.r, 0, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.restore();
    }
}
const petals = [];
for (let i = 0; i < 70; i++) petals.push(new Petal(true));
let petalOn = false;
(function loop() {
    ctx.clearRect(0, 0, cvs.width, cvs.height);
    if (petalOn)
        petals.forEach((p) => {
            p.update();
            p.draw();
        });
    requestAnimationFrame(loop);
})();

/* ══ OPEN ══ */
function openCard() {
    toggleMusic();
    document.getElementById("cover").classList.add("hidden");
    petalOn = true;
    setTimeout(() => {
        document.getElementById("main").classList.add("visible");
        startCountdown();
        initReveal();
        initTilt();
    }, 900);
}

/* ══ MUSIC ══ */
let musicOn = false;
const bgm = new Audio();
bgm.loop = true;
bgm.volume = 0.42;
bgm.src = "../assets/audio/beautiful-in-white.mp3";
function toggleMusic() {
    const btn = document.getElementById("music-btn"),
        ico = document.getElementById("music-icon");
    if (musicOn) {
        bgm.pause();
        musicOn = false;
        btn.classList.remove("music-on");
        ico.innerHTML =
            '<path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" opacity=".4"/><line x1="3" y1="3" x2="21" y2="21" stroke="#e2c97e" stroke-width="2"/>';
        btn.style.borderColor = "rgba(255,255,255,.2)";
    } else {
        bgm.play()
            .then(() => {
                musicOn = true;
                btn.classList.add("music-on");
                ico.innerHTML =
                    '<path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>';
                btn.style.borderColor = "rgba(201,168,76,.7)";
            })
            .catch((err) => {
                console.log("Toggle Music error: ", err);
                alert("Nhấn lại để bật nhạc 🎵");
            });
    }
}

/* ══ COUNTDOWN ══ */
function startCountdown() {
    const t = new Date("2026-03-29T12:00:00").getTime();
    function tick() {
        const d = t - Date.now();
        if (d <= 0) return;
        const set = (id, v) =>
            (document.getElementById("cd-" + id).textContent = String(v).padStart(2, "0"));
        set("d", Math.floor(d / 86400000));
        set("h", Math.floor((d % 86400000) / 3600000));
        set("m", Math.floor((d % 3600000) / 60000));
        set("s", Math.floor((d % 60000) / 1000));
        setTimeout(tick, 1000);
    }
    tick();
}

/* ══ SCROLL REVEAL — handles all .reveal* + curtain + blur + custom ══ */
function initReveal() {
    const io = new IntersectionObserver(
        (es) => {
            es.forEach((e) => {
                if (!e.isIntersecting) return;
                const el = e.target;
                el.classList.add("visible");
                io.unobserve(el);
            });
        },
        { threshold: 0.1, rootMargin: "0px 0px -40px 0px" },
    );

    document
        .querySelectorAll(
            ".reveal,.reveal-left,.reveal-right,.reveal-scale," +
                ".story-img-col,.story-flower-item," +
                ".ev-card,.g-item," +
                ".triptych-item,.cd-rings,.cd-flower,.wish-rose",
        )
        .forEach((el) => io.observe(el));
}

/* ══ PARALLAX ══ */
window.addEventListener(
    "scroll",
    () => {
        const sc = window.pageYOffset;
        const hc = document.querySelector(".hero-content");
        if (hc) hc.style.transform = `translateY(${sc * 0.26}px)`;
        const ca = document.querySelector(".candles");
        if (ca) ca.style.opacity = Math.max(0, 1 - sc / 480);
    },
    { passive: true },
);

/* ══ 3D TILT on portraits ══ */
function initTilt() {
    document.querySelectorAll(".photo-tilt-wrap").forEach((wrap) => {
        const inner = wrap.querySelector(".photo-tilt-inner");
        wrap.addEventListener("mousemove", (e) => {
            const r = wrap.getBoundingClientRect();
            const x = ((e.clientX - r.left) / r.width - 0.5) * 22;
            const y = ((e.clientY - r.top) / r.height - 0.5) * -22;
            inner.style.transform = `rotateY(${x}deg) rotateX(${y}deg) scale(1.04)`;
            inner.style.boxShadow = `${-x * 0.5}px ${y * 0.5}px 40px rgba(45,122,110,.4)`;
        });
        wrap.addEventListener("mouseleave", () => {
            inner.style.transform = "rotateY(0) rotateX(0) scale(1)";
            inner.style.boxShadow = "";
        });
    });

    /* Tilt on gallery items */
    document.querySelectorAll(".g-item").forEach((item) => {
        item.addEventListener("mousemove", (e) => {
            const r = item.getBoundingClientRect();
            const x = ((e.clientX - r.left) / r.width - 0.5) * 10;
            const y = ((e.clientY - r.top) / r.height - 0.5) * -10;
            item.style.transform = `perspective(600px) rotateY(${x}deg) rotateX(${y}deg) scale(1.02)`;
        });
        item.addEventListener("mouseleave", () => {
            item.style.transform = "";
        });
    });

    /* Tilt on event cards */
    document.querySelectorAll(".ev-card").forEach((card) => {
        card.addEventListener("mousemove", (e) => {
            const r = card.getBoundingClientRect();
            const x = ((e.clientX - r.left) / r.width - 0.5) * 8;
            const y = ((e.clientY - r.top) / r.height - 0.5) * -8;
            card.style.transform = `perspective(700px) rotateY(${x}deg) rotateX(${y}deg) translateY(-6px)`;
        });
        card.addEventListener("mouseleave", () => {
            card.style.transform = "";
        });
    });
}

/* ══ WISHES ══ */
function addWish() {
    const n = document.getElementById("w-name").value.trim(),
        t = document.getElementById("w-text").value.trim();
    if (!n || !t) {
        alert("Vui lòng điền đầy đủ!");
        return;
    }
    const el = document.createElement("div");
    el.className = "wish-bub";
    el.innerHTML = `<div class="wish-auth">${n}</div><div class="wish-txt">${t}</div>`;
    document.getElementById("wish-list").prepend(el);
    document.getElementById("w-name").value = "";
    document.getElementById("w-text").value = "";
}

/* ══ LIGHTBOX ══ */
function openLB(src, cap = "") {
    document.getElementById("lb-img").src = src;
    document.getElementById("lb-caption").innerHTML = cap;
    document.getElementById("lightbox").classList.add("open");
    document.body.style.overflow = "hidden";
}
function closeLB() {
    document.getElementById("lightbox").classList.remove("open");
    document.body.style.overflow = "";
}
document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeLB();
});
