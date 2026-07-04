// ============================================================
// COLORES POR TIPO (C09 — sin cambios)
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
// CREAR TARJETA (C09 — sin cambios)
// ============================================================
function crearTarjeta(pokemon) {
  const { nombre, imagen, tipos } = pokemon;
  const img = imagen ?? "https://via.placeholder.com/96?text=?";
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
    <p class="text-xs text-slate-400 mt-1">
      Tipo principal: <span class="font-semibold capitalize">${principal}</span>
    </p>
    <div class="flex gap-1 justify-center mt-2 flex-wrap">${badges}</div>
  `;

  return articulo;
}

// ============================================================
// RENDER (C09 — sin cambios)
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
// BUSCADOR (C09 — solo cambia pokemonLocal → pokedex, HU4)
// ============================================================
const buscador = document.getElementById("buscador");

let pokedex = []; // HU4 — aquí se guarda la rejilla cargada de la API

buscador.addEventListener("input", function () {
  const texto = buscador.value.toLowerCase();
  const filtrados = pokedex.filter(function (p) {
    return p.nombre.includes(texto);
  });
  render(filtrados);
});

// ============================================================
// HU3 — Función adaptadora: estructura API → forma limpia
// ============================================================
<<<<<<< HEAD
function adaptarPokemon(data) {
  return {
    nombre: data.name,
    imagen: data.sprites?.front_default ?? "https://via.placeholder.com/96?text=?",
    tipos:  data.types.map(function (t) { return t.type.name; })
  };
}

// ============================================================
// LOGRO 1 — Spinner animado (reemplaza el texto "Cargando…")
// ============================================================
function mostrarSpinner() {
  contenedor.innerHTML = `
    <div class="col-span-full flex flex-col items-center justify-center py-12 text-slate-400">
      <svg class="animate-spin h-10 w-10 mb-3 text-yellow-400"
           xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10"
                stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
      </svg>
      <span class="text-sm">Cargando Pokédex…</span>
    </div>
  `;
}

// ============================================================
// HU4 — Cargar varios Pokémon en paralelo con Promise.all
// ============================================================
const nombres = [
  "bulbasaur",
  "charmander",
  "squirtle",
  "pikachu",
  "jigglypuff",
  "gengar"
];

mostrarSpinner(); // Logro 1: spinner mientras carga

const promesas = nombres.map(function (nombre) {
  return fetch(`https://pokeapi.co/api/v2/pokemon/${nombre}`)
    .then(function (response) {
      if (!response.ok) throw new Error(`Error al cargar ${nombre}`);
      return response.json();
    });
});

Promise.all(promesas)
  .then(function (datos) {
    pokedex = datos.map(adaptarPokemon);
    render(pokedex);
  })
  .catch(function (error) {
    console.error("Error al cargar la Pokédex:", error);
    contenedor.innerHTML = `
      <p class="col-span-full text-center text-red-600 font-medium py-8">
        ⚠️ No se pudo cargar la Pokédex. Revisa tu conexión e intenta de nuevo.
      </p>
    `;
  });
=======
render(pokemonAmpliada);
>>>>>>> fe70edb1baa8d322524232d1a124bf236782c719
