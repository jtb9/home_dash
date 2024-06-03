import { Typography } from "@mui/material";
//@ts-ignore
import NewsTicker from 'react-advanced-news-ticker';

interface Props {
    data: any;
    rootTableStyle: any;
}

export default function News(props: Props) {
    const data = props.data;
    const rootTableStyle = props.rootTableStyle;
    
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
}
