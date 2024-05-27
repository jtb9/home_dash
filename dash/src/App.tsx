import { useEffect, useState } from 'react';
import './App.css';
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

function App() {
  const [data, setData] = useState<any>(undefined);

  const getData = () => {
    axios.get("http://localhost:8080/data").then((data) => {
      setData(data.data);
    })
  }

  useEffect(() => {
    getData();
  }, [])

  const renderClock1 = () => {
    return <div style={{ padding: '15px' }}>
      <Card>
        <CardContent>
          <Typography sx={{ fontSize: 34 }} color="text.secondary" gutterBottom>
            12:24 PM
          </Typography>
        </CardContent>
      </Card>
    </div>
  }

  const renderNews = () => {
    if (data === undefined) {
      return <Typography>Loading...</Typography>
    }

    return <TableContainer>
      <Table sx={{ width: '100%' }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.articles.map((row: any) => (
            <TableRow
              key={row.title}
              sx={{ '&:last-child td, &:last-child th': { border: 0 }, padding: '2px', margin: '2px' }}
            >
              <TableCell sx={{padding: '5px', margin: '0px'}} component="th" scope="row">
                {row.title}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  }

  const renderStream1 = () => {
    return <div style={{ height: '100%' }} className="stream">
      <iframe
        style={{
          display: 'block',
          width: '100%',
          height: '100%'
        }}
        //@ts-ignore
        frameborder={"0"}
        //@ts-ignore
        src={"https://www.youtube.com/embed/P9C25Un7xaM?autoplay=1&mute=1"}
      ></iframe>
    </div>
  }

  return (
    <div className="App">
      <div style={{
        display: 'block',
        width: '100%',
        height: '100%'
      }} className="dash">
        <div style={{ display: 'flex', flexDirection: 'row', height: '100%', width: '100%' }}>
          <div style={{ flex: '1', flexDirection: 'column' }}>
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

export default App;
