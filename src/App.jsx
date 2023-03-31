import { useEffect, useState } from "react";
import { Box, Skeleton } from "@mui/material";
import { DataGrid, GridSkeletonCell, GridToolbar } from "@mui/x-data-grid";

import "./App.css";
import { RenderListTypes, RenderImage, RenderAbility } from "./renderHelper";
import pokemonLogo from "./assets/Pokémon_logo.png";
import fetchPokeData from "./fetchApi";

function App() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchPokeData();
        // console.log(data);
        setData(data);
        setIsLoading(false);
      } catch (err) {
        console.error(err.stack);
      }
    };

    fetchData();
  }, []);

  const columns = [
    { field: "id", headerName: "ID" },
    {
      field: "name",
      headerName: "Pokemon Name",
      width: 150,
      cellClassName: "capitalize",
    },
    {
      field: "types",
      headerName: "Types",
      width: 150,
      sortable: false,
      filterable: false,
      renderCell: (params) => <RenderListTypes list={params.value} />,
    },
    {
      field: "sprites",
      headerName: "Image",
      width: 150,
      sortable: false,
      filterable: false,
      renderCell: (params) => <RenderImage src={params.value} />,
    },
    {
      field: "first_ability",
      headerName: "First Ability",
      width: 150,
      sortable: false,
      filterable: false,
      cellClassName: "capitalize",
      renderCell: (params) => <RenderAbility list={params.value} />,
    },
    {
      field: "hidden_ability",
      headerName: "Hidden Ability",
      width: 150,
      sortable: false,
      filterable: false,
      cellClassName: "capitalize",
      renderCell: (params) => <RenderAbility list={params.value} />,
    },
    {
      field: "region",
      headerName: "Region",
    },
    {
      field: "gen",
      headerName: "Generation",
      flex: 1,
    },
  ];

  return (
    <Box
      sx={{
        "& .MuiDataGrid-root": {
          color: "rgba(255, 255, 255, 0.87)",
          borderColor: "rgba(224, 224, 224, 1)",
          minHeight: "75vh",
        },
        "& .MuiDataGrid-row": {
          maxHeight: "max-content !important",
        },
        "& .MuiDataGrid-cell": {
          flexWrap: "wrap",
          alignItems: "center",
          minHeight: "120px !important",
        },
        "& .MuiTablePagination-root": {
          color: "rgba(255, 255, 255, 0.87)",
        },
      }}
    >
      <img
        src={pokemonLogo}
        alt="Pokemon logo"
        style={{
          maxWidth: "100%",
          height: "15vh",
          display: "block",
          margin: "0 auto 2rem",
        }}
      />
      {isLoading && (
        <Skeleton
          animation="wave"
          variant="rectangular"
          width={1100}
          height="75vh"
          sx={{ borderRadius: "2px", background: "rgb(17 24 39 / 0.4)" }}
        />
      )}
      {!isLoading && (
        <DataGrid
          rows={data}
          columns={columns}
          components={{ toolbar: GridToolbar, SkeletonCell: GridSkeletonCell }}
          slotProps={{
            toolbar: {
              showQuickFilter: true,
              quickFilterProps: { debounceMs: 500 },
            },
          }}
        />
      )}
    </Box>
  );
}

export default App;
