import { Grid, Typography, Box } from "@mui/material";
import youtubePic from "../../assets/youtubePic.png";
import Data from "./content";
import Translate from "../../common/translate/Translate";

const About = () => {
  return (
    <Box>
      <Typography
        fontFamily={"Parisienne"}
        textAlign={"center"}
        color={"#FF6063"}
        fontSize={"48px"}
        fontWeight={400}
      >
        <Translate> About</Translate>
      </Typography>
      <Grid container columnSpacing={10}>
        <Grid
          item
          xs={12}
          sm={6}
          sx={{ fontWeight: 500, fontSize: "16px", color: "white" }}
        >
          <Typography paddingLeft={"20px"} component={"div"}>
            <Data />
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6} textAlign={"center"} sx={{ padding: 2 }}>
          <img style={{ width: "100%" }} src={youtubePic} alt="youtube pic" />
        </Grid>
      </Grid>
    </Box>
  );
};

export default About;
