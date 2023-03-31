// https://pokeapi.co/api/v2/pokemon/

const regionAndGen = [
  {
    region: "Kanto",
    gen: "Generation I",
  },
  {
    region: "Johto",
    gen: "Generation II",
  },
  {
    region: "Hoenn",
    gen: "Generation III",
  },
  {
    region: "Sinnoh",
    gen: "Generation IV",
  },
  {
    region: "Unova",
    gen: "Generation V",
  },
  {
    region: "Kalos",
    gen: "Generation VI",
  },
  {
    region: "Alola",
    gen: "Generation VII",
  },
  {
    region: "Galar",
    gen: "Generation VIII",
  },
  {
    region: "Hisui",
    gen: "Generation IX",
  },
];

// helper function
export const fetchAPI = async (link) => {
  const res = await fetch(link);
  return res.json();
};

const getPokeUrl = async () => {
  const arrPokeUrl = [];
  const data = await fetchAPI(
    "https://pokeapi.co/api/v2/pokemon?limit=1010&offset=0"
  );

  data.results.forEach(({ url }) => arrPokeUrl.push(url));

  return arrPokeUrl;
};

const fetchRegionAndGen = async () => {
  const data = await fetchAPI("https://pokeapi.co/api/v2/generation");

  const arrGenUrl = [];
  data.results.forEach(({ url }) => arrGenUrl.push(url));

  const resultsGenUrl = await Promise.all(arrGenUrl.map(fetchAPI));

  const filteredGenUrl = resultsGenUrl.map(({ pokemon_species }) => ({
    pokemon_species,
  }));

  return filteredGenUrl;
};

const fetchPokeData = async () => {
  const arrPokeUrl = await getPokeUrl();

  const resultsPokeUrl = await Promise.all(arrPokeUrl.map(fetchAPI));

  const firtsRegionAndGen = await fetchRegionAndGen();

  const filteredPokeUrl = resultsPokeUrl.map(
    ({ abilities, id, name, species, sprites, types }) => {
      // get abilities
      const first_ability = [];
      const hidden_ability = [];
      abilities.forEach((ability) => {
        if (ability.is_hidden) {
          hidden_ability.push(ability.ability);
        }
        first_ability.push(ability.ability);
      });

      // get region and generation
      let gen, region;
      firtsRegionAndGen.forEach(({ pokemon_species }, index) => {
        if (JSON.stringify(pokemon_species).includes(JSON.stringify(species))) {
          ({ gen, region } = regionAndGen[index]);
        }
      });

      return {
        first_ability,
        hidden_ability,
        id,
        name,
        gen,
        region,
        sprites,
        types,
      };
    }
  );
  console.log(filteredPokeUrl[0]);
  return filteredPokeUrl;
};

export default fetchPokeData;
