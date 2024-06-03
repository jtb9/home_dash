import { useEffect, useState } from 'react';
import axios from 'axios';
import WeatherWidget from 'Components/WeatherWidget';
import PokemonTable from 'Components/PokemonTable';
import Clock from 'Components/Clock';
import News from 'Components/News';

const rootTableStyle = {
  border: '2px solid rgba(0,200,0,0.3)',
  outline: '1px solid green',
  borderRadius: '5px',
  width: 'calc(100% - 25px)',
  margin: '2px',
  marginLeft: '5px',
  boxShadow: '0px 0px 3px 1px rgba(74,255,46,0.2)'
}

export default function App() {
  const [data, setData] = useState<any>(undefined);
  const [pokemonData, setPokemonData] = useState<any>(undefined);

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

  const renderImageRow = () => {
    return <div style={{ display: 'flex', alignContent: 'row', height: '100%' }}>
      <img style={{ width: '33%' }} src="https://cdn.barnyak.com/auto/blog_set_1_1.jpg" alt="image1" />
      <img style={{ width: '33%' }} src="https://cdn.barnyak.com/auto/blog_set_2_2.jpg" alt="image1" />
      <img style={{ width: '33%' }} src="https://cdn.barnyak.com/auto/blog_set_3_3.jpg" alt="image1" />
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
          <div style={{ width: '38%', overflow: 'hidden', flexDirection: 'column' }}>
            <WeatherWidget
              src="https://embed.windy.com/embed.html?type=map&location=coordinates&metricRain=in&metricTemp=°F&metricWind=mph&zoom=7&overlay=clouds&product=ecmwf&level=surface&lat=40.472&lon=-76.981&pressure=true&message=true"
              width="100%"
              height="50%"
            />
            <WeatherWidget
              src="https://embed.windy.com/embed.html?type=map&location=coordinates&metricRain=in&metricTemp=°F&metricWind=mph&zoom=7&overlay=radar&product=radar&level=surface&lat=40.472&lon=-76.981&detailLat=41.216&detailLon=-76.978&detail=true&pressure=true&message=true"
              width="100%"
              height="50%"
            />
          </div>
          <div style={{ display: 'flex', width: '62%', flexDirection: 'column', justifyContent: 'space-between', alignContent: 'end' }}>
            <div style={{
              background: 'linear-gradient(125deg, rgba(16,255,0,1) 0%, rgba(9,121,113,1) 25%, rgba(0,255,139,1) 100%)',
              height: '76px',
              width: '100%'
            }}></div>

            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
              <Clock data={data} />
              <News data={data} rootTableStyle={rootTableStyle} />
              <PokemonTable pokemonData={pokemonData} rootTableStyle={rootTableStyle} />
            </div>

            <div style={{ width: '100%', height: '200px' }}>
              {renderImageRow()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
