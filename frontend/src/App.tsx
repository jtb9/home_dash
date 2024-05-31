import { useEffect, useState } from 'react';
import axios from 'axios';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
//@ts-ignore
import NewsTicker from 'react-advanced-news-ticker';

const newsAPIKey = '21ef90f50c9046c792ebc1abe2901822';

const rootTableStyle = {
  border: '1px solid green',
  borderRadius: '5px',
  width: 'calc(100% - 5px)',
  margin: '2px',
  boxShadow: '0px 0px 3px 1px rgba(74,255,46,0.2)'
}

export default function App() {
  const [data, setData] = useState<any>(undefined);
  const [pokemonData, setPokemonData] = useState<any>(undefined);
  const [current, setCurrent] = useState<any>({ hours: 0, minutes: 0, date: '' });

  useEffect(() => {
    function setTime() {
      const d = new Date();

      setCurrent({
        hours: d.getHours(),
        minutes: d.getMinutes(),
        date: `${d.getMonth()}/${d.getDay()}`,
      });
    }

    const intervalId = setInterval(() => {
      setTime();
    }, 1000 * 15); // in milliseconds
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      getData();
      getPokemonData();
    }, 1000 * 60);
    return () => clearInterval(intervalId);
  }, []);

  const getPokemonData = () => {
    const url = `https://raw.githubusercontent.com/bigfoott/ScrapedDuck/data/events.min.json`;

    // @ts-ignore
    axios
      .get(url)
      // @ts-ignore
      .then((data) => {

        let rawData = data.data;
        let filteredForToday = [];

        for (let i = 0; i < rawData.length; i++) {
          const start = new Date(rawData[i].start);
          const end = new Date(rawData[i].end);
          const today = new Date();

          if (start.getTime() <= today.getTime() && end.getTime() >= today.getTime()) {
            rawData[i].timeDisplay = `from ${start.toDateString()} at ${start.getHours()} to ${end.toDateString()} at ${end.getHours()}`

            filteredForToday.push(rawData[i]);
          }
        }

        filteredForToday = filteredForToday.sort((a, b) => {
          //@ts-ignore
          return new Date(a.end) - new Date(b.end)
        })

        // @ts-ignore
        setPokemonData(filteredForToday);
        // @ts-ignore
      })
      .catch((e) => {
        console.error(e);
      });
  }

  const getCurrentHour = () => {
    let base = new Date().getHours().toString();

    if (parseInt(base) > 12) {
      base = (parseInt(base) - 12).toString();
    }

    if (base.length === 1) {
      base = `0${base}`;
      return base;
    }
    else {
      return base;
    }
  }

  const getCurrentSystemTemp = () => {
    if (data === undefined || data.weather === undefined) {
      return "Unkown";
    }

    let c = data.weather.cpuTemp;
    let f = 0;

    // Using the above formula
    f = (c * (9 / 5)) + 32;

    return `${Math.round(f)}F`;
  }

  const getCurrentOutdorTemp = () => {
    if (data === undefined || data.weather === undefined) {
      return "Unkown";
    }

    let c = data.weather.temperatureApparentAvg;
    let f = 0;

    // Using the above formula
    f = (c * (9 / 5)) + 32;

    return `${Math.round(f)}F`;
  }

  const getData = () => {
    let url = `http://localhost:8080/data`;

    // for testing
    url = `http://10.0.128.64:8080/data`;

    // @ts-ignore
    axios
      .get(url)
      // @ts-ignore
      .then((data) => {
        // @ts-ignore
        setData(data.data);
        // @ts-ignore
      })
      .catch((e) => {
        console.error(e);
      });
  };

  useEffect(() => {
    getData();
    getPokemonData();
  }, []);

  const renderClock1 = () => {
    let minutes = new Date().getMinutes().toString();

    //@ts-ignore
    if (minutes.length === 1) {
      //@ts-ignore
      minutes = `0${minutes}`
    }

    return (
      <div style={{ padding: '15px', display: 'flex', alignContent: 'column' }}>
        <Typography
          sx={{
            fontSize: 100,
            fontFamily: '"Crimson Text", serif',
            textAlign: 'center',
          }}
          color="text.secondary"
          gutterBottom
        >
          {getCurrentHour() + ":" + minutes}
        </Typography>
        <Typography
          sx={{
            fontSize: 30,
            fontFamily: '"Crimson Text", serif',
            textAlign: 'center',
            paddingLeft: '20px',
          }}
          color="text.secondary"
          gutterBottom
        >
          {new Date().toDateString()}
        </Typography>
        <div style={{ paddingLeft: '15px' }}>
          <Typography>System Temperature: {getCurrentSystemTemp()}</Typography>
          <Typography>Room Temperature: Unknown</Typography>
          <Typography>Outdoor Temperature: {getCurrentOutdorTemp()}</Typography>
        </div>
      </div>
    );
  };

  const renderNews = () => {
    if (data === undefined) {
      return <Typography>Loading...</Typography>;
    }

    let titles = [];

    for (let i = 0; i < data.articles.length; i++) {
      const t = data.articles[i].title;

      if (t !== "[Removed]") {
        titles.push(<div>
          {t}
        </div>)
      }
    }

    return <div style={rootTableStyle}>
      <NewsTicker>
        {titles}
      </NewsTicker>
    </div>
  };

  const renderPokemon = () => {
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
          sx={{ padding: '5px', margin: '0px' }}
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

  const renderStream1 = () => {
    return (
      <div style={{ height: '50%' }} className="stream">
        <iframe
          style={{
            display: 'block',
            width: '100%',
            height: '100%',
          }}
          // @ts-ignore
          frameBorder="0"
          // @ts-ignore
          src="https://www.youtube.com/embed/P9C25Un7xaM?autoplay=1&mute=1"
        />
      </div>
    );
  };

  const renderImageRow = () => {
    return <div style={{display: 'flex', alignContent: 'row'}}>
      <img style={{ width: '33%' }} src="https://cdn.barnyak.com/auto/blog_set_2_1.jpg" alt="image1" />
      <img style={{ width: '33%' }} src="https://cdn.barnyak.com/auto/blog_set_2_2.jpg" alt="image1" />
      <img style={{ width: '33%' }} src="https://cdn.barnyak.com/auto/blog_set_2_3.jpg" alt="image1" />
    </div>
  }

  return (
    <div
      style={{
        fontFamily: '"Crimson Text", serif !important',
        height: '100%',
        width: '100%',
      }}
      className="App"
    >
      <div
        style={{
          display: 'block',
          width: '100%',
          height: '100%',
        }}
        className="dash"
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            height: '100%',
            width: '100%',
          }}
        >
          <div style={{ flex: '1', maxWidth: '40%', flexDirection: 'column' }}>
            <img style={{ width: '100%' }} src="https://cdn.barnyak.com/auto/blog_set_1_1.jpg" alt="image1" />
            <img style={{ width: '100%' }} src="https://cdn.barnyak.com/auto/blog_set_3_3.jpg" alt="image2" />
          </div>
          <div style={{ flex: '1', flexDirection: 'column' }}>
            <div style={{
              background: 'linear-gradient(125deg, rgba(16,255,0,1) 0%, rgba(9,121,113,1) 25%, rgba(0,255,139,1) 100%)',
              height: '46px',
              width: '100%'
            }}></div>
            {renderClock1()}
            {renderNews()}
            {renderPokemon()}
            {renderImageRow()}
          </div>
        </div>
      </div>
    </div>
  );
}
