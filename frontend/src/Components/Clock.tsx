import { Typography } from "@mui/material";
interface Props {
    data: any;
}

export default function Clock(props: Props) {
    const data = props.data;

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
            color: 'yellow !important'
          }}
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
        </div>
      </div>
    );
}
