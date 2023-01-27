const input = document.querySelector('input')
const buttons = document.querySelectorAll('button')
const pokeBox = document.querySelector('#poke-box')
const pokeRegion = document.querySelector('#poke-region')

// to get {"front_default":"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png",}

document.addEventListener("DOMContentLoaded", () => {
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            // add region name
            getPokemonRegion(button.id)
                .then(regionName => addRegionName(regionName))

            // empty content when load data
            pokeBox.textContent = '';
            getGenerationLength()
                .then(data => {
                    Promise.all(data)
                        .then(data => {
                            let [offset, limit] = getOffsetAndLimit(button.id, data);
                            return getPokemonsOfSpecificGeneration(offset, limit);
                        })
                        .then(data => {
                            let arrayUrls = getPokemonData(data);
                            let arraysPokeInfo = getPokemonInfo(arrayUrls);
                            // console.log(arraysPokeInfo);
                            Promise.all(arraysPokeInfo)
                                .then(arraysPokeInfo => {
                                    arraysPokeInfo.forEach(arrayPokeInfo => {
                                        renderPokemon(arrayPokeInfo)
                                    })
                                })
                        });
                });
        })
    })
})


// get pokemon regions
function getPokemonRegion(id) {
    return fetch(`https://pokeapi.co/api/v2/generation/${id}`)
        .then(async res => await res.json())
        .then(data => data['main_region']['name'])
}

// add pokemon region to box container
function addRegionName(regionName) {
    pokeRegion.textContent = regionName + " Region";
}

// Get total numbers of pokemons from each generation and put it into an array
function getGenerationLength() {
    return fetch(`https://pokeapi.co/api/v2/generation/`)
        .then(async res => await res.json())
        .then((data) => {
            const { results } = data;
            const arraySpecies = [];
            results.forEach(result => {
                let length = fetch(result.url)
                    .then(res => res.json())
                    .then(data => data['pokemon_species'].length)
                arraySpecies.push(length)
            })
            return arraySpecies
        })
}

// Get offset and limit of every generation
function getOffsetAndLimit(gen, array) {
    let sum = 0;
    // total pokemons of previous generation compared to the gen variable
    let limit;

    for (let i = 0; i < array.length; i++) {
        if (i === (gen - 1)) limit = array[i]
    }

    for (let i = 0; i < gen - 1; i++) {
        sum += array[i]
    }

    return [sum, limit]
}

function getPokemonsOfSpecificGeneration(offset, limit) {
    return fetch(`https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`)
        .then(async res => await res.json())
        .then((speciesData) => speciesData)
}

// Get url of every pokemon of a generation return an array of urls
function getPokemonData({ results }) {
    const arrayUrls = [];
    results.forEach(result => {
        if (result.url) {
            let url = result.url;
            arrayUrls.push(url)
        }
    })
    return arrayUrls;
}

// Fetch url of every pokemon of a generation and return name / image / type 
function getPokemonInfo(url) {
    const arrayPokeUrls = url;
    const arraysPokeInfo = [];
    arrayPokeUrls.forEach(arrayPokeUrl => {
        let pokeInfo = fetch(arrayPokeUrl)
            .then(async res => await res.json())
            .then((data) => {
                // console.log(data);
                return {
                    name: data.name,
                    image: data.sprites.other['official-artwork'].front_default,
                    types: data.types
                }
            })
        arraysPokeInfo.push(pokeInfo)
    })
    return arraysPokeInfo;
}

// Use information after fetch to create a card of each pokemon 
function renderPokemon({ name, image, types }) {
    // div tag for pokemon container
    const div = document.createElement('div');
    div.classList.add('container')

    // p tag for pokemon name
    const p = document.createElement('p');
    p.textContent = name;

    // ul & li tags for pokemon types
    const ul = document.createElement('ul');
    createTypes(types, ul);

    // img tag for pokemon image
    const img = document.createElement('img');
    img.src = image;

    // add all tags to its container
    div.append(p, ul, img)

    // add all containers to a box
    pokeBox.append(div);
}

function createTypes(types, ul) {
    types.forEach(type => {
        // create li tag
        let typeLi = document.createElement('li');

        // add content to li tag
        typeLi.innerText = type['type']['name'];

        // add background color to the tag
        // by classifying types
        getTypeColor(typeLi);

        // add li tag to ul tag
        ul.append(typeLi);
    })
}

function getTypeColor(type) {
    typeColors.forEach(color => {
        const [key] = Object.keys(color)
        if (key === type.innerText) {
            type.style.backgroundColor = color[key];
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
]