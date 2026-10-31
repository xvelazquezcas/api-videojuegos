const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors()); // CORS habilitado para que la PWA pueda hacer fetch

const juegos = [
  { id: 1, titulo: "The Legend of Zelda: Breath of the Wild", genero: "Aventura", anio: 2017, calificacion: 9.8, color1: "#1b9aaa", color2: "#06d6a0" },
  { id: 2, titulo: "Minecraft", genero: "Sandbox", anio: 2011, calificacion: 9.5, color1: "#4c956c", color2: "#2c6e49" },
  { id: 3, titulo: "God of War", genero: "Acción", anio: 2018, calificacion: 9.7, color1: "#9d0208", color2: "#370617" },
  { id: 4, titulo: "Hollow Knight", genero: "Metroidvania", anio: 2017, calificacion: 9.3, color1: "#3a0ca3", color2: "#4cc9f0" },
  { id: 5, titulo: "FIFA 23", genero: "Deportes", anio: 2022, calificacion: 8.2, color1: "#0077b6", color2: "#90e0ef" },
  { id: 6, titulo: "Celeste", genero: "Plataformas", anio: 2018, calificacion: 9.1, color1: "#ff6b9d", color2: "#7b2cbf" },
  { id: 7, titulo: "Stardew Valley", genero: "Simulación", anio: 2016, calificacion: 9.4, color1: "#80b918", color2: "#ffb703" },
  { id: 8, titulo: "Forza Horizon 5", genero: "Carreras", anio: 2021, calificacion: 9.0, color1: "#f77f00", color2: "#d62828" }
];

// Portada generada como SVG (original, sin derechos de autor y sin imágenes externas)
app.get("/portadas/:id.svg", (req, res) => {
  const j = juegos.find(x => x.id === Number(req.params.id));
  if (!j) return res.status(404).send("No encontrado");
  const palabras = j.titulo.split(" ");
  const lineas = [];
  let actual = "";
  palabras.forEach(p => {
    if ((actual + " " + p).trim().length > 14) { lineas.push(actual.trim()); actual = p; }
    else actual += " " + p;
  });
  lineas.push(actual.trim());
  const texto = lineas.slice(0, 4).map((l, i) =>
    `<text x="150" y="${190 + i * 34}" text-anchor="middle" font-family="Arial, sans-serif" font-size="26" font-weight="bold" fill="#fff">${l.replace(/&/g, "&amp;")}</text>`
  ).join("");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="400" viewBox="0 0 300 400">
  <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${j.color1}"/><stop offset="1" stop-color="${j.color2}"/></linearGradient></defs>
  <rect width="300" height="400" rx="18" fill="url(#g)"/>
  <circle cx="150" cy="80" r="34" fill="rgba(255,255,255,.25)"/>
  <text x="150" y="92" text-anchor="middle" font-size="34" font-family="Arial">🎮</text>
  ${texto}
  <text x="150" y="375" text-anchor="middle" font-family="Arial, sans-serif" font-size="16" fill="rgba(255,255,255,.85)">${j.genero} · ${j.anio}</text>
</svg>`;
  res.type("image/svg+xml").set("Cache-Control", "public, max-age=86400").send(svg);
});

function conPortada(req, j) {
  const base = `${req.protocol}://${req.get("host")}`;
  const { color1, color2, ...datos } = j;
  return { ...datos, portada: `${base}/portadas/${j.id}.svg` };
}

app.get("/", (req, res) => {
  res.json({ api: "Videojuegos favoritos", endpoints: ["/api/videojuegos", "/api/videojuegos/:id"] });
});

app.get("/api/videojuegos", (req, res) => {
  res.json(juegos.map(j => conPortada(req, j)));
});

app.get("/api/videojuegos/:id", (req, res) => {
  const j = juegos.find(x => x.id === Number(req.params.id));
  if (!j) return res.status(404).json({ error: "Videojuego no encontrado" });
  res.json(conPortada(req, j));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API corriendo en puerto ${PORT}`));
