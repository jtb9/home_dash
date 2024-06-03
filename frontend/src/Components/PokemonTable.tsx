import { Typography, TableRow, TableCell, Table, TableBody, TableContainer, TableHead } from "@mui/material";

interface Props {
    pokemonData: any;
    rootTableStyle: any;
}

export default function PokemonTable(props: Props) {
    const pokemonData = props.pokemonData;
    const rootTableStyle = props.rootTableStyle;
    
    if (pokemonData === undefined) {
        return <Typography>Loading...</Typography>;
      }
  
      let pokemonDataMax = [];
  
      let sizeOfSet = pokemonData.length;
  
      if (sizeOfSet >= 10) {
        sizeOfSet = 10;
      }
  
      for (let i = 0; i < sizeOfSet; i++) {
        const row = pokemonData[i];
  
        let extraStyle = {}
  
        if (i === 0) {
          //@ts-ignore
          extraStyle.color = 'yellow !important';
        }
  
        pokemonDataMax.push(
          <TableRow
            key={row.name}
            sx={{
  
              '&:last-child td, &:last-child th': { border: 0 },
              padding: '2px',
              margin: '2px',
            }}
          >
            <TableCell
              sx={{ padding: '5px', margin: '0px', ...extraStyle, }}
              component="th"
              scope="row"
            >
              {row.name}
            </TableCell>
            <TableCell
              sx={{ padding: '5px', margin: '0px' }}
              component="th"
              scope="row"
            >
              {row.timeDisplay}
            </TableCell>
          </TableRow>
        )

    }
    
    return (
        <TableContainer sx={{ ...rootTableStyle }}>
          <div style={{ position: 'relative' }}>
            <img style={{ width: '50px', position: 'absolute', left: '30px', top: '0px', zIndex: '10' }} src="zapdos.png" alt="zapdos" />
            <img style={{ width: '50px', position: 'absolute', top: '-5px', zIndex: '10', transform: 'rotate(-10deg)' }} src="jolteon.png" alt="zapdos" />
          </div>
          <Table sx={{ width: '100%' }} aria-label="simple table">
            <TableHead >
              <TableRow style={{ backgroundColor: "rgba(255,255,255,.1)" }} >
                <TableCell />
                <TableCell />
              </TableRow>
            </TableHead>
            <TableBody>
              {pokemonDataMax}
            </TableBody>
          </Table>
        </TableContainer>
      );
}
