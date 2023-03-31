const typeColors = [
  { normal: "#a8a77b" },
  { fire: "#ef7e3b" },
  { water: "#6893ec" },
  { grass: "#7ac75a" },
  { electric: "#f8ce47" },
  { ice: "#99d8d8" },
  { fighting: "#bf2f2c" },
  { poison: "#9f439d" },
  { ground: "#e0bf6f" },
  { flying: "#a793ec" },
  { psychic: "#f65887" },
  { bug: "#a9b637" },
  { rock: "#b89f43" },
  { ghost: "#6f5a96" },
  { dark: "#705849" },
  { dragon: "#6f43f3" },
  { steel: "#b8b9cf" },
  { fairy: "#efb6bc" },
];

const getTypeColor = (item) => {
  let bg;
  typeColors.forEach((color) => {
    const [key] = Object.keys(color);
    if (key === item) {
      bg = color[key];
    }
  });
  return bg;
};

export const RenderListTypes = ({ list }) => {
  return (
    // <div className="MuiDataGrid-cellContent"></div>
    list.map((item, index) => {
      const bg = getTypeColor(item.type.name);
      return (
        <span
          className="MuiDataGrid-cellContent"
          style={{
            display: "inline-block",
            padding: "4px 6px",
            margin: "2px",
            borderRadius: "4px",
            background: bg,
          }}
          key={index}
        >
          {item.type.name}
        </span>
      );
    })
  );
};

export const RenderImage = ({ src }) => {
  return (
    <img
      src={src.other["official-artwork"]["front_default"]}
      alt="pokemon-image"
      style={{ maxWidth: "100%", width: "80%" }}
    />
  );
};

export const RenderAbility = ({ list }) => {
  if (!list.length) return <span>NaN</span>;
  return list.map((item, index) => (
    <span
      style={{
        padding: "4px 6px",
        margin: "2px",
        borderRadius: "4px",
        border: "1px solid #646cff",
      }}
      key={index}
    >
      {item.name}
    </span>
  ));
};
