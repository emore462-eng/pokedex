// ============================================================
// COLORES PASTEL POR TIPO
// ============================================================
const colorPorTipo = {
  grass:    "#b7e4c7",
  poison:   "#d9b8f0",
  fire:     "#f7b7a3",
  water:    "#a8d8ea",
  electric: "#fbe6a2",
  normal:   "#d7cfc7",
  fairy:    "#f7c6de",
  ghost:    "#c9b8e8",
  psychic:  "#f5b8d4",
  dragon:   "#b8c4f0",
  dark:     "#b9aab3",
  rock:     "#dcc7a0",
  ground:   "#e0c19a",
  ice:      "#b8e8e8",
  bug:      "#cfe8a8",
  flying:   "#b8dcf0",
  steel:    "#cdd6dc",
  fighting: "#f0a8a8",
  default:  "#f6dde3"
};

const etiquetaStat = {
  hp: "HP", attack: "ATQ", defense: "DEF",
  "special-attack": "ATQE", "special-defense": "DEFE", speed: "VEL"
};

// ============================================================
// CREAR TARJETA (estilo diploma/ficha, con sello de corazón)
// ============================================================
function crearTarjeta(pokemon) {
  const { id, nombre, imagen, tipos, stats } = pokemon;
  const img = imagen ?? "https://via.placeholder.com/120?text=?";

  const badges = tipos.map(function (tipo) {
    const color = colorPorTipo[tipo] ?? colorPorTipo.default;
    return `<span class="badge" style="--badge-color:${color}">Tipo · ${tipo}</span>`;
  }).join("");

  const filasStats = (stats ?? []).map(function (s) {
    const etiqueta = etiquetaStat[s.nombre] ?? s.nombre.slice(0, 4).toUpperCase();
    const porcentaje = Math.min(100, Math.round((s.valor / 180) * 100));
    return `
      <div class="stat-row">
        <span class="stat-label">${etiqueta}</span>
        <span class="stat-bar-track"><span class="stat-bar-fill" style="width:${porcentaje}%"></span></span>
        <span class="stat-value">${s.valor}</span>
      </div>
    `;
  }).join("");

  const articulo = document.createElement("article");
  articulo.className = "card";
  articulo.tabIndex = 0;
  articulo.innerHTML = `
    <div class="card-stamp">♡</div>
    <span class="card-id">N.º ${String(id ?? 0).padStart(3, "0")}</span>
    <img src="${img}" alt="${nombre}" class="card-img">
    <h2 class="card-name">${nombre}</h2>
    <div class="badges">${badges}</div>
    ${filasStats ? `<div class="stats">${filasStats}</div>` : ""}
  `;

  return articulo;
}

// ============================================================
// RENDER — rejilla principal, con botón Retirar por tarjeta
// ============================================================
const contenedor = document.getElementById("resultado");

function render(lista) {
  contenedor.innerHTML = "";
  lista.forEach(function (pokemon) {
    const tarjeta = crearTarjeta(pokemon);

    const btnQuitar = document.createElement("button");
    btnQuitar.textContent = "retirar de la colección";
    btnQuitar.className = "btn-remove";
    btnQuitar.addEventListener("click", function () {
      quitar(pokemon.nombre);
    });
    tarjeta.appendChild(btnQuitar);

    contenedor.appendChild(tarjeta);
  });
}

function quitar(nombre) {
  pokedex = pokedex.filter(function (p) { return p.nombre !== nombre; });
  render(pokedex);
}

// ============================================================
// ESTADO Y REFERENCIAS DEL DOM
// ============================================================
const buscador = document.getElementById("buscador");
const botonBuscar = document.getElementById("btn-buscar");
const botonCargarMas = document.getElementById("cargar-mas");
const spinner = document.getElementById("spinner");
const mensaje = document.getElementById("mensaje");
const mensajeTexto = document.getElementById("mensaje-texto");
const botonReintentar = document.getElementById("btn-reintentar");

let pokedex = [];
let offset = 0;
let ultimaBusqueda = "";

// ============================================================
// Helpers de estado de UI
// ============================================================
function mostrarCargando() { spinner.classList.remove("hidden"); }
function ocultarCargando() { spinner.classList.add("hidden"); }

function mostrarError(texto, conReintentar) {
  mensajeTexto.textContent = texto;
  mensaje.classList.remove("hidden");
  botonReintentar.classList.toggle("hidden", !conReintentar);
}

function ocultarError() {
  mensaje.classList.add("hidden");
  botonReintentar.classList.add("hidden");
}

// ============================================================
// Adaptador: estructura API → forma limpia (arte oficial + stats)
// ============================================================
function adaptarPokemon(data) {
  return {
    id: data.id,
    nombre: data.name,
    imagen:
      data.sprites?.other?.["official-artwork"]?.front_default ??
      data.sprites?.front_default ??
      "https://via.placeholder.com/120?text=?",
    tipos: data.types.map(function (t) { return t.type.name; }),
    stats: data.stats.map(function (s) {
      return { nombre: s.stat.name, valor: s.base_stat };
    })
  };
}

// ============================================================
// Consulta a la API (404 → null, otros errores → throw)
// ============================================================
async function obtenerPokemon(idONombre) {
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${idONombre}`);

  if (response.status === 404) return null;

  if (!response.ok) {
    throw new Error(`No se pudo consultar "${idONombre}" (código ${response.status})`);
  }

  return response.json();
}

async function buscarPokemon(entrada) {
  const consulta = entrada.trim().toLowerCase().replace(/\s+/g, "-");
  const data = await obtenerPokemon(consulta);
  if (data === null) return null;
  return adaptarPokemon(data);
}

// ============================================================
// Carga inicial de la Pokédex
// ============================================================
async function cargarPokedex() {
  mostrarCargando();
  ocultarError();

  try {
    const nombres = [
      "bulbasaur", "charmander", "squirtle", "pikachu",
      "jigglypuff", "gengar", "eevee", "clefairy", "vulpix"
    ];
    const datos = await Promise.all(nombres.map(obtenerPokemon));
    pokedex = datos.map(adaptarPokemon);
    render(pokedex);
  } catch (error) {
    mostrarError("No pudimos cargar la Pokédex. Revisa tu conexión.", false);
  } finally {
    ocultarCargando();
  }
}

cargarPokedex();

// ============================================================
// Mostrar el Pokémon buscado (tarjeta + botón guardar)
// ============================================================
function mostrarResultado(pokemon) {
  const tarjeta = crearTarjeta(pokemon);

  const boton = document.createElement("button");
  boton.className = "btn-capture";
  boton.textContent = "♡ Añadir a la colección";
  boton.addEventListener("click", function () { capturar(pokemon); });
  tarjeta.appendChild(boton);

  contenedor.innerHTML = "";
  contenedor.appendChild(tarjeta);
}

function mostrarNoEncontrado(nombre) {
  contenedor.innerHTML = `
    <div class="empty-panel">
      <span class="big">🔍</span>
      No encontramos a <strong>"${nombre}"</strong><br>
      Intenta con otro nombre o número.
    </div>
  `;
}

function capturar(pokemon) {
  if (!pokedex.some(function (p) { return p.nombre === pokemon.nombre; })) {
    pokedex.push(pokemon);
  }
  render(pokedex);
  buscador.value = "";
}

// ============================================================
// Búsqueda con try/catch/finally
// ============================================================
async function mostrarBusqueda(entrada) {
  ultimaBusqueda = entrada;
  mostrarCargando();
  ocultarError();

  try {
    const pokemon = await buscarPokemon(entrada);
    if (pokemon === null) {
      mostrarNoEncontrado(entrada);
    } else {
      mostrarResultado(pokemon);
    }
  } catch (error) {
    mostrarError(error.message || "Algo salió mal. Revisa tu conexión.", true);
  } finally {
    ocultarCargando();
  }
}

botonBuscar.addEventListener("click", function () {
  const entrada = buscador.value.trim();
  if (entrada !== "") mostrarBusqueda(entrada);
});

buscador.addEventListener("keydown", function (event) {
  if (event.key === "Enter") botonBuscar.click();
});

botonReintentar.addEventListener("click", function () {
  if (ultimaBusqueda !== "") mostrarBusqueda(ultimaBusqueda);
});

// ============================================================
// Cargar más
// ============================================================
async function cargarMas() {
  mostrarCargando();
  ocultarError();

  try {
    const respuesta = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=12&offset=${offset}`);
    if (!respuesta.ok) throw new Error("No se pudo cargar más Pokémon.");

    const lista = await respuesta.json();
    const datos = await Promise.all(
      lista.results.map(function (item) {
        return fetch(item.url).then(function (r) { return r.json(); });
      })
    );

    datos.map(adaptarPokemon).forEach(function (pokemon) {
      if (!pokedex.some(function (p) { return p.nombre === pokemon.nombre; })) {
        pokedex.push(pokemon);
      }
    });

    offset += 12;
    render(pokedex);
  } catch (error) {
    mostrarError("No se pudo cargar más Pokémon. Revisa tu conexión.", false);
  } finally {
    ocultarCargando();
  }
}

botonCargarMas.addEventListener("click", cargarMas);