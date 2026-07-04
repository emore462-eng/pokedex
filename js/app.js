// ============================================================
// DATOS — Array local de Pokémon (base del proyecto)
// ============================================================
const pokemonLocal = [
  { nombre: "bulbasaur",  imagen: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png",  tipos: ["grass", "poison"] },
  { nombre: "charmander", imagen: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png",  tipos: ["fire"] },
  { nombre: "squirtle",   imagen: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/7.png",  tipos: ["water"] },
  { nombre: "pikachu",    imagen: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png", tipos: ["electric"] },
  { nombre: "jigglypuff", imagen: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/39.png", tipos: ["normal", "fairy"] },
  { nombre: "gengar",     imagen: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/94.png", tipos: ["ghost", "poison"] }
];

// ============================================================
// LOGRO 1 — Colores por tipo
// ============================================================
const colorPorTipo = {
  grass:    "bg-green-200 text-green-800",
  poison:   "bg-purple-200 text-purple-800",
  fire:     "bg-red-200 text-red-800",
  water:    "bg-blue-200 text-blue-800",
  electric: "bg-yellow-200 text-yellow-800",
  normal:   "bg-slate-200 text-slate-700",
  fairy:    "bg-pink-200 text-pink-800",
  ghost:    "bg-indigo-200 text-indigo-800",
  default:  "bg-slate-200 text-slate-700"
};

// ============================================================
// Crear una tarjeta (destructuring, map, optional chaining)
// + LOGRO 1 (colores por tipo)
// + LOGRO 3 (destructuring de array para tipo principal)
// ============================================================
function crearTarjeta(pokemon) {
  const { nombre, imagen, tipos } = pokemon;

  const img = imagen ?? "https://via.placeholder.com/96?text=?";
  const cantidadTipos = tipos?.length ?? 0;

  const [principal] = tipos ?? ["???"];

  const badges = tipos
    .map(function (tipo) {
      const claseColor = colorPorTipo[tipo] ?? colorPorTipo.default;
      return `<span class="text-xs ${claseColor} px-2 py-1 rounded-full">${tipo}</span>`;
    })
    .join("");

  const articulo = document.createElement("article");
  articulo.className = "bg-white rounded-xl shadow p-4 text-center";
  articulo.innerHTML = `
    <img src="${img}" alt="${nombre}" class="w-24 h-24 mx-auto">
    <h2 class="capitalize font-bold text-slate-800 mt-2">${nombre}</h2>
    <p class="text-xs text-slate-400 mt-1">Tipo principal: <span class="font-semibold capitalize">${principal}</span></p>
    <div class="flex gap-1 justify-center mt-2 flex-wrap">${badges}</div>
  `;

  return articulo;
}

// ============================================================
// HU2 — Función render: limpia → recorre → inserta
// ============================================================
const contenedor = document.getElementById("resultado");

function render(lista) {
  contenedor.innerHTML = "";
  lista.forEach(function (pokemon) {
    const tarjeta = crearTarjeta(pokemon);
    contenedor.appendChild(tarjeta);
  });
}

// ============================================================
// LOGRO 2 — Spread e inmutabilidad
// ============================================================
const pokemonNuevo = {
  nombre: "eevee",
  imagen: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/133.png",
  tipos: ["normal"]
};

const pokemonAmpliada = [...pokemonLocal, pokemonNuevo];

// ============================================================
// HU4 — Filtrado en vivo con el buscador
// ============================================================
const buscador = document.getElementById("buscador");

buscador.addEventListener("input", function () {
  const texto = buscador.value.toLowerCase();
  const filtrados = pokemonAmpliada.filter(function (p) {
    return p.nombre.includes(texto);
  });
  render(filtrados);
});

// ============================================================
// Render inicial — muestra todos (incluyendo eevee del Logro 2)
// ============================================================
render(pokemonAmpliada);
