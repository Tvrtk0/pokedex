const typeColors = {
	normal: '#A8A77A',
	fire: '#EE8130',
	water: '#6390F0',
	electric: '#F7D02C',
	grass: '#7AC74C',
	ice: '#96D9D6',
	fighting: '#C22E28',
	poison: '#A33EA1',
	ground: '#E2BF65',
	flying: '#A98FF3',
	psychic: '#F95587',
	bug: '#A6B91A',
	rock: '#B6A136',
	ghost: '#735797',
	dragon: '#6F35FC',
	dark: '#705746',
	steel: '#B7B7CE',
	fairy: '#D685AD',
};

const pokemon_section = document.getElementById('pokemon-section')

if (!document.getElementsByClassName("modal-list")[0].firstChild) {
    document.getElementById("empty-msg").innerHTML = "No hidden pokemon found."
} 

function createPokemonItem(id, name, sprite_front_default, type) {
    const pokemonItem = document.createElement('div')
    const pokemonItemInnerHTML = 
        `
        <img class="hide-btn" src="img/x.svg" alt="hide btn" title="Hide ${name}">
        <span class="pokemonId">#${String(id).padStart(3, '0')}</span>
        <img class="pokemonImg" src="${sprite_front_default}" alt="${name} img">
        <div class="title noselect">
            <h3>${name}</h3>
            <img class="arrow" src="img/arrow.svg" alt="arrow" title="Show details">
        </div>
        `
    
    pokemonItem.innerHTML = pokemonItemInnerHTML
    pokemonItem.classList.add('pokemon')
    pokemonItem.getElementsByClassName('hide-btn')[0].addEventListener("click", () => {
        pokemonItem.classList.add("hide")
        
        const btn = document.createElement('button')
        btn.innerHTML = "Show";
        btn.classList.add("show-btn")
        btn.style.backgroundColor = typeColors[type[0]];
        btn.addEventListener('click', () => {
            console.log(pokemonItem.classList.remove("hide"));
            document.getElementById(`${id}`).remove()
            if (!document.getElementsByClassName("modal-list")[0].firstChild) {
                document.getElementById("empty-msg").innerHTML = "No hidden pokemon found."
            } 
        })
        
        const li = document.createElement('li')
        li.classList.add("hidden-pokemon-el")
        li.id = id
        li.innerHTML = `<img src="${sprite_front_default}" alt="${name} img" width="100px"><span>${name}</span>`
        li.appendChild(btn)
        
        document.getElementsByClassName("modal-list")[0].appendChild(li)
        
        if (document.getElementsByClassName("modal-list")[0].firstChild) {
            document.getElementById("empty-msg").innerHTML = ""
        } 
    })

    return pokemonItem
}

function createAccordion(typeList, abilities, statsList) {
    let types = typeList.map(t => `<li class="type-element">${t}</li>`)
                    .toString().split(',').join('')

    let stats = statsList.map(s =>`<li class="stats-element"><span class="base-stat">${s.stat}</span><span>${s.name}</span></li>`)
                    .toString().split(',').join('')
    
    const pokemonAccordion = document.createElement('div')
    const pokemonAccordionInnerHTML = `
            <ul class="type-list">${types}</ul>
            <ul class="stats-list">${stats}</ul>`
    
    pokemonAccordion.innerHTML = pokemonAccordionInnerHTML
    pokemonAccordion.classList.add('accordion')
    pokemonAccordion.style.height = "0px"

    return pokemonAccordion
}

function styleAccordion(pokemonAccordion, types) {
    let deg = 0
    pokemonAccordion.previousElementSibling.addEventListener("click", function() {
        deg += 180
        if (pokemonAccordion.style.height == "0px") {
            pokemonAccordion.style.height = "auto";
            pokemonAccordion.style.opacity = 1;
            this.lastElementChild.style.transform = `rotate(${deg}deg)`
        } else {
            pokemonAccordion.style.height = "0px";
            pokemonAccordion.style.opacity = 0;
            this.lastElementChild.style.transform = `rotate(${deg}deg)`
        }
    });
    
    const typeEl = pokemonAccordion.getElementsByClassName("type-element")
    Array.from(typeEl).forEach((typeEl, index)=>{
        typeEl.style.backgroundColor = typeColors[types[index]]
    })
}

function createPokemonElement(pokemon) {
        const id = pokemon.id
        const name = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)
        const type = pokemon.types.map(type => type['type'].name)
        const abilities = pokemon.abilities.map(ability => ability['ability'].name) //.toString().split(",").join(", ")
        const stats = pokemon.stats.map(stat => {
            return {
                stat: stat['base_stat'],
                name: stat['stat'].name
            }
        }).slice(0, 3)
        const sprite_front_default = pokemon.sprites.front_default
        const sprite_front_shiny = pokemon.sprites.front_shiny
        const weight = pokemon.weight
        const height = pokemon.height

        stats.forEach(s => (s.name === 'hp') ? s.name = 'Health' : s.name = s.name.charAt(0).toUpperCase() + s.name.slice(1))

        const pokemonAccordion = createAccordion(type, abilities, stats)
        const pokemonItem = createPokemonItem(id, name, sprite_front_default, type)

        pokemonItem.appendChild(pokemonAccordion)
        pokemon_section.appendChild(pokemonItem)

        styleAccordion(pokemonAccordion, type)
}

async function getPokemon(start, amount) {
    for (let i = start; i < start+amount; i++ ) {
        let url = `https://pokeapi.co/api/v2/pokemon/${i}`;
        const res = await fetch(url);
        const pokemon = await res.json();
        createPokemonElement(pokemon)
    }
}

let start = 1
let amount = 20

getPokemon(start, amount)

const load_btn = document.getElementById('load')
load_btn.addEventListener("click", function () {
    start = start + amount
    getPokemon(start, amount)
})






/* Modal */
const openModalButtons = document.querySelectorAll('[data-modal-target]')
const closeModalButtons = document.querySelectorAll('[data-close-button]')
const overlay = document.getElementById('overlay')

openModalButtons.forEach(button => {
  button.addEventListener('click', () => {
    const modal = document.querySelector(button.dataset.modalTarget)
    openModal(modal)
  })
})

overlay.addEventListener('click', () => {
  const modals = document.querySelectorAll('.modal.active')
  modals.forEach(modal => {
    closeModal(modal)
  })
})

closeModalButtons.forEach(button => {
  button.addEventListener('click', () => {
    const modal = button.closest('.modal')
    closeModal(modal)
  })
})

function openModal(modal) {
  if (modal == null) return
  modal.classList.add('active')
  overlay.classList.add('active')
}

function closeModal(modal) {
  if (modal == null) return
  modal.classList.remove('active')
  overlay.classList.remove('active')
}

