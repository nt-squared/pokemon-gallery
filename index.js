const buttons = document.querySelectorAll('button');
const pokeBox = document.querySelector('#poke-box');
const spinner = document.querySelector('.spinner');

const BASE_URL = 'https://pokeapi.co/api/v2/pokemon?';

async function getPokemonEntries() {
    let url = 'https://pokeapi.co/api/v2/generation/'
    const res = await fetch(url)
    const data = await res.json();

    const totalGens = data.count;
    let entriesArr = []
    for (let i = 0; i < totalGens; i++) {
        const res = await fetch(`${url}${i + 1}`)
        const pokeGen = await res.json();
        const pokeGenEntries = pokeGen.pokemon_species.length;
        entriesArr.push(pokeGenEntries)
    }

    return (entriesArr);
}
const LOCAL_STORAGE_KEY = 'POKE-GEN';

buttons.forEach((button, index) => {
    let url = BASE_URL;
    let offset = 0;

    button.addEventListener('click', async () => {
        pokeBox.innerHTML = "";



        const entriesArr = await getPokemonEntries();
        let limit = entriesArr[index];

        if (index !== 0) {
            let newEntriesArr = entriesArr.slice(0, index);
            offset = newEntriesArr.reduce((acc, curr) => acc + curr, 0);
        }

        console.log(offset, limit);
        const res = await fetch(`${url}offset=${offset}&limit=${limit}`);
        const allPokemon = await res.json();


        let fetchedData = [];
        const resultsLength = allPokemon.results.length;

        if (localStorage[`${LOCAL_STORAGE_KEY} ${index + 1}`]) {
            console.log('get');
            let storage = JSON.parse(localStorage.getItem(`${LOCAL_STORAGE_KEY} ${index + 1}`))
            storage.forEach(renderPokemon);
            return
        }


        console.log('set');
        spinner.style.display = 'block';
        for (let i = 0; i < resultsLength; i++) {
            const pokeData = await fetchPokemonData(allPokemon.results[i]);
            fetchedData.push(pokeData)
        }

        localStorage.setItem(`${LOCAL_STORAGE_KEY} ${index + 1}`, JSON.stringify(fetchedData))

        fetchedData.forEach(renderPokemon);

        spinner.style.display = 'none';


    })

})


async function fetchPokemonData(pokemon) {
    let url = pokemon.url;
    const res = await fetch(url);
    const { name, sprites, types } = await res.json();

    return {
        name,
        image: sprites?.other['official-artwork']['front_default'],
        types,
    }
}

// Render All Pokemon
function renderPokemon({ types, image, name }) {

    // Create Poke Card
    let pokeCard = document.createElement('div');
    pokeCard.className = 'poke-card'; // add class name

    let typeList = createPokemonTypes(types);
    let pokeImage = createPokemonImage(image)
    let pokeName = createPokemonName(name)

    pokeCard.append(typeList); // add type list
    pokeCard.append(pokeName); // add name
    pokeCard.append(pokeImage); // add image

    pokeBox.append(pokeCard) // add poke card
}

// Handle Pokemon Name
function createPokemonName(name) {
    let pokeName = document.createElement('h4');
    pokeName.className = 'poke-name';
    pokeName.innerHTML = name
    return pokeName
}

// Handle Pokemon Image
function createPokemonImage(image) {
    let img = document.createElement('img');
    img.src = image;
    return img
}

// Handle Pokemon Type
function createPokemonTypes(types) {
    let ul = document.createElement('ul');
    ul.className = 'type-list';

    types.forEach(type => {
        let li = document.createElement('li');
        li.innerText = type?.type['name'];
        getTypeColor(li);
        ul.append(li)
    })

    return ul
}

function getTypeColor(type) {
    typeColors.forEach(typeColor => {
        let [pokeType] = Object.keys(typeColor);

        if (pokeType === type.innerHTML) {
            type.style.backgroundColor = typeColor[pokeType];
        }
    })
}

const typeColors = [
    { normal: '#a8a77b' },
    { fire: '#ef7e3b' },
    { water: '#6893ec' },
    { grass: '#7ac75a' },
    { electric: '#f8ce47' },
    { ice: '#99d8d8' },
    { fighting: '#bf2f2c' },
    { poison: '#9f439d' },
    { ground: '#e0bf6f' },
    { flying: '#a793ec' },
    { psychic: '#f65887' },
    { bug: '#a9b637' },
    { rock: '#b89f43' },
    { ghost: '#6f5a96' },
    { dark: '#705849' },
    { dragon: '#6f43f3' },
    { steel: '#b8b9cf' },
    { fairy: '#efb6bc' }
];

