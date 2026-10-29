const IMG = {
  "nectarine": "images/tarte_fruit.jpg",
  "citron": "images/tarte_citron.jpg",
  "chocolat": "images/tarte_chocolat.jpg",
  "amandine": "images/tarte_amandine.jpg",
  "banana": "images/banana_bread.jpg",
  "muffin": "images/muffin.jpg",
  "cookie2": "images/cookies.jpg",
  "cheesecake": "images/cheese_cake.jpg",
  "tiramisu": "images/tiramisu.jpg",
  "hero": "images/accueil.jpg",
  "cookie": "images/cookie.jpg",
  "piping": "images/piping.jpg",
  "fraises": "images/fraises.jpg"
};

const V = [
  ["cookie2", "Cookie au chocolat", "Allergènes : gluten, soja, fruits à coque.", "3 €"],
  ["muffin", "Muffin d'automne", "Sirop d'érable, spéculoos, cannelle, 4 épices.<br><br>Allergènes : gluten, soja.", "3 €"],
  ["cheesecake", "Cheesecake", "Base de spéculoos, appareil au tofu et fruits du jour.<br><br>Commande minimum : 8 personnes (3,75€/part).<br><br>Allergènes : gluten, soja.", "3,75 €"],
  ["tiramisu", "Tiramisu", "Spéculoos, café, crème vanillée, cacao en poudre.<br><br>Commande minimum : 4 personnes (portions généreuses : 195g/personne).<br><br>Allergènes : gluten, soja.", "4,75 €"],
  ["banana", "Banana bread", "Format unique de 8 personnes (2,75€/part).<br><br>Allergènes : gluten, soja, fruits à coque.", "2,75 €"]
];

const T = [
  ["citron", "Tarte citron menthe", "Pâte sucrée croustillante, crème au citron jaune et à la menthe fraîche.<br><br>Allergènes : gluten, soja.", [24, 31, 38]],
  ["amandine", "Tarte amandine", "Pâte sucrée croustillante, crème d'amande, fruits au choix (poire, abricot, pêche...).<br><br>Allergènes : gluten, soja, fruits à coque.", [26, 33, 40]],
  ["chocolat", "Tarte au chocolat", "Pâte sucrée croustillante, ganache au chocolat noir.<br><br>Allergènes : gluten, soja.", [25, 32, 39]],
  ["nectarine", "Tarte aux fruits de saison", "Pâte sucrée croustillante, crème pâtissière à la vanille, fruits de saison et nappage neutre.<br><br>Allergènes : gluten, soja.", [27, 34, 41]]
];

const card = (k, t, d, p) => `<article class="card"><img src="${IMG[k]}" alt="${t}" loading="lazy"><h3>${t}</h3><p>${d}</p><span class="badge">🌱 Végétalien</span>${p}</article>`;

const g1 = document.getElementById("g1");
const g2 = document.getElementById("g2");

if (g1) {
  g1.innerHTML = V.map(v => card(v[0], v[1], v[2], `<span class="price">${v[3]}</span>`)).join("");
}

if (g2) {
  g2.innerHTML = T.map(v => card(v[0], v[1], v[2], [6, 8, 10].map((n, i) => `<p>${n} personnes <b>${v[3][i]} €</b></p>`).join(""))).join("");
}

document.querySelectorAll("[data-k]").forEach(i => i.src = IMG[i.dataset.k]);

function route() {
  const defaultPage = document.body.dataset.defaultPage || "accueil";
  const h = (location.hash || "#" + defaultPage).slice(1);
  const targetEl = document.getElementById(h);
  const id = targetEl && targetEl.classList.contains("page") ? h : defaultPage;

  document.querySelectorAll(".page").forEach(s => s.classList.toggle("on", s.id === id));
  document.querySelectorAll("nav a[data-p]").forEach(a => a.classList.toggle("on", a.dataset.p === id));
  scrollTo(0, 0);
}

addEventListener("hashchange", route);
route();

const accueilHero = document.getElementById("accueil");
if (accueilHero) {
  accueilHero.style.backgroundImage = "linear-gradient(rgba(255,241,214,.5),rgba(255,241,214,.5)),url(" + IMG.hero + ")";
}

const f = document.getElementById("f");
if (f) {
  f.addEventListener("submit", async ev => {
    ev.preventDefault();
    const q = i => document.getElementById(i).value;
    const r = f.querySelector("input[name=r]:checked").value;
    const btn = f.querySelector(".send");
    const msg = document.getElementById("msg");

    const d = {
      "Nom": q("n"),
      "E-mail": q("e"),
      "Téléphone": q("t"),
      "Type de demande": r,
      "Demande": q("m"),
      _subject: "Nouvelle demande (" + r + ") - " + q("n"),
      _replyto: q("e"),
      _template: "table",
      _captcha: "false"
    };

    btn.disabled = true;
    btn.textContent = "Envoi en cours…";

    try {
      const x = await fetch("https://formsubmit.co/ajax/patisseriepilea@gmail.com", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(d)
      });
      if (!x.ok) throw 0;
      f.reset();
      msg.textContent = "Merci ! Votre demande a bien été envoyée, nous vous répondons rapidement.";
    } catch (_) {
      const body = Object.entries(d).filter(([k]) => k[0] !== "_").map(([k, v]) => k + " : " + v).join("\n");
      msg.textContent = "L'envoi direct n'a pas abouti : votre application mail s'ouvre avec le message prêt à envoyer.";
      location.href = "mailto:patisseriepilea@gmail.com?subject=" + encodeURIComponent(d._subject) + "&body=" + encodeURIComponent(body);
    }
    btn.disabled = false;
    btn.textContent = "Envoyer";
  });
}
