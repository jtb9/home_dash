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
const newsAPIKey = '21ef90f50c9046c792ebc1abe2901822';

export default function App() {
  const [data, setData] = useState<any>(undefined);
  const [current, setCurrent] = useState<any>({hours: 0, minutes: 0, date: ''});

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

  const getData = () => {
    const url = `http://localhost:8080/data`;

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
  }, []);

  const renderClock1 = () => {
    return (
      <div style={{ padding: '15px', display: 'flex', alignContent: 'column' }}>
        <Typography
          sx={{
            fontSize: 200,
            fontFamily: '"Crimson Text", serif',
            textAlign: 'center',
          }}
          color="text.secondary"
          gutterBottom
        >
          {current.hours}:{current.minutes}
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
          {current.date}/24
        </Typography>
      </div>
    );
  };

  const renderNews = () => {
    if (data === undefined) {
      return <Typography>Loading...</Typography>;
    }

    return (
      <TableContainer sx={{position: 'relative', top: '-80px'}}>
        <Table sx={{ width: '100%' }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {data.articles.map((row: any) => (
              <TableRow
                key={row.title}
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
                  {row.title}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

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
            <img style={{width: '100%'}} src = "https://cdn.barnyak.com/auto/blog_set_1_1.jpg" alt="image1" />
            {renderStream1()}
          </div>
          <div style={{ flex: '1', flexDirection: 'column' }}>
            {renderClock1()}
            {renderNews()}
          </div>
        </div>
      </div>
    </div>
  );
}
