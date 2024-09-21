import { AppBar, Toolbar, Typography } from "@mui/material";
import MainContainer from "./components/MainContainer";

export default function Home() {
  return (
    <>
     <AppBar>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Real-Time Data Visualization
        </Typography>
      </Toolbar>
    </AppBar>

   <MainContainer/>
   </>
  );
}
