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
  psychic:  "bg-fuchsia-200 text-fuchsia-800",
  dragon:   "bg-violet-200 text-violet-800",
  dark:     "bg-zinc-300 text-zinc-800",
  rock:     "bg-amber-200 text-amber-800",
  ground:   "bg-orange-200 text-orange-800",
  ice:      "bg-cyan-200 text-cyan-800",
  bug:      "bg-lime-200 text-lime-800",
  flying:   "bg-sky-200 text-sky-800",
  steel:    "bg-slate-300 text-slate-700",
  fighting: "bg-red-300 text-red-900",
  default:  "bg-slate-200 text-slate-700"
};

// ============================================================
// CREAR TARJETA (C09 — sin cambios, no se toca)
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
// RENDER (modificado: Logro 2 — botón "Quitar" en cada tarjeta
// de la rejilla, sin tocar crearTarjeta)
// ============================================================
const contenedor = document.getElementById("resultado");

function render(lista) {
  contenedor.innerHTML = "";
  lista.forEach(function (pokemon) {
    const tarjeta = crearTarjeta(pokemon);

    // Logro 2: botón para sacarlo de la Pokédex y re-renderizar
    const btnQuitar = document.createElement("button");
    btnQuitar.textContent = "✖ Quitar";
    btnQuitar.className =
      "mt-2 w-full text-xs bg-red-100 text-red-700 font-semibold rounded-lg py-1 hover:bg-red-200";
    btnQuitar.addEventListener("click", function () {
      quitar(pokemon.nombre);
    });
    tarjeta.appendChild(btnQuitar);

    contenedor.appendChild(tarjeta);
  });
}

function quitar(nombre) {
  pokedex = pokedex.filter(function (p) {
    return p.nombre !== nombre;
  });
  render(pokedex);
}

// ============================================================
// ESTADO
// ============================================================
const buscador = document.getElementById("buscador");
const botonBuscar = document.getElementById("btn-buscar");
const botonCargarMas = document.getElementById("cargar-mas");

let pokedex = []; // se llenará cuando lleguen los datos de la API
let offset = 0;   // HU5: desde qué Pokémon empezamos a paginar

// ============================================================
// HU4 — Adaptador: estructura API → forma limpia (+ stats)
// ============================================================
function adaptarPokemon(data) {
  return {
    nombre: data.name,
    imagen: data.sprites?.front_default ?? "https://via.placeholder.com/96?text=?",
    tipos:  data.types.map(function (t) { return t.type.name; }),
    stats:  data.stats.map(function (s) {
      return { nombre: s.stat.name, valor: s.base_stat };
    })
  };
}

// ============================================================
// SPINNER (mientras carga la rejilla inicial)
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
// HU1 — Carga inicial con async/await (reemplaza el .then encadenado)
// ============================================================
async function obtenerPokemon(idONombre) {
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${idONombre}`);
  return response.json();
}

async function cargarPokedex() {
  mostrarSpinner();

  const nombres = [
    "bulbasaur",
    "charmander",
    "squirtle",
    "pikachu",
    "jigglypuff",
    "gengar",
    "eevee",
    "mewtwo",
    "snorlax"
  ];

  const datos = await Promise.all(nombres.map(obtenerPokemon)); // varios en paralelo, con await
  pokedex = datos.map(adaptarPokemon);
  render(pokedex);
}

cargarPokedex();

// ============================================================
// HU2 — Buscar en la API (por nombre o, Logro 1, por número)
// ============================================================
async function buscarPokemon(entrada) {
  // Logro 1: acepta nombre ("charizard"), número ("6") o nombres con espacio ("mr mime" → "mr-mime")
  const consulta = entrada.trim().toLowerCase().replace(/\s+/g, "-");
  const data = await obtenerPokemon(consulta);
  return adaptarPokemon(data);
}

// ============================================================
// HU3 + HU4 — Mostrar el resultado con stats y botón Capturar
// (crearTarjeta no se toca; se le agregan nodos aparte)
// ============================================================
function mostrarResultado(pokemon) {
  const tarjeta = crearTarjeta(pokemon);

  // HU4: estadísticas (solo en el resultado de búsqueda)
  const stats = document.createElement("div");
  stats.className = "mt-2 text-left text-xs space-y-1";
  stats.innerHTML = pokemon.stats.map(function (s) {
    return `
      <div class="flex justify-between">
        <span class="capitalize">${s.nombre}</span>
        <span class="font-semibold">${s.valor}</span>
      </div>
    `;
  }).join("");
  tarjeta.appendChild(stats);

  // HU3: botón Capturar
  const boton = document.createElement("button");
  boton.textContent = "⚡ Capturar";
  boton.className =
    "mt-2 w-full bg-yellow-400 font-semibold rounded-lg py-1 hover:bg-yellow-500";
  boton.addEventListener("click", function () {
    capturar(pokemon);
  });
  tarjeta.appendChild(boton);

  contenedor.innerHTML = "";
  contenedor.appendChild(tarjeta);
}

async function mostrarBusqueda(entrada) {
  const pokemon = await buscarPokemon(entrada);
  mostrarResultado(pokemon);
}

// HU3 — Capturar: hace crecer pokedex sin duplicar
function capturar(pokemon) {
  if (!pokedex.some(function (p) { return p.nombre === pokemon.nombre; })) {
    pokedex.push(pokemon);
  }
  render(pokedex);
  buscador.value = "";
}

// Listeners del buscador: clic o Enter (ya no filtra en cada tecla)
botonBuscar.addEventListener("click", function () {
  const entrada = buscador.value.trim();
  if (entrada !== "") mostrarBusqueda(entrada);
});

buscador.addEventListener("keydown", function (event) {
  if (event.key === "Enter") botonBuscar.click();
});

// ============================================================
// HU5 — Cargar más con parámetros de consulta (?limit, ?offset)
// ============================================================
async function cargarMas() {
  const respuesta = await fetch(
    `https://pokeapi.co/api/v2/pokemon?limit=12&offset=${offset}`
  );
  const lista = await respuesta.json(); // { results: [{ name, url }, ...] }

  // cada item de la lista solo trae name + url → se pide el detalle de cada uno
  const datos = await Promise.all(
    lista.results.map(function (item) {
      return fetch(item.url).then(function (r) { return r.json(); });
    })
  );

  datos.map(adaptarPokemon).forEach(function (pokemon) {
    if (!pokedex.some(function (p) { return p.nombre === pokemon.nombre; })) {
      pokedex.push(pokemon); // sin duplicar
    }
  });

  offset += 12; // la próxima vez, la siguiente página
  render(pokedex);
}

botonCargarMas.addEventListener("click", cargarMas);