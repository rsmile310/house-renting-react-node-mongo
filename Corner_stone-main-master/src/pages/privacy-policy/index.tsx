import { Box, Grid, Typography } from "@mui/material";
import Data from "./content";
import youtubePic from "../../assets/youtubePic.png";
import china from "../../assets/icons/china.png";
import france from "../../assets/icons/france.png";
import russia from "../../assets/icons/russia.png";
import UK from "../../assets/icons/united-kingdom.png";
import egypt from "../../assets/icons/egypt.png";
import india from "../../assets/icons/india.png";
import Translate from "../../common/translate/Translate";

const PrivacyPolicy = () => {
  return (
    <Box>
      <Typography
        fontFamily={"Parisienne"}
        textAlign={"center"}
        color={"#FF6063"}
        fontSize={"48px"}
        fontWeight={400}
      >
        <Translate>Privacy Policy</Translate>
      </Typography>
      <Box display={"flex"} width={"100%"} justifyContent={"center"}>
        <Box padding={2}>
          <img
            src={china}
            alt="china"
            style={{ width: "40px", cursor: "pointer" }}
          />
        </Box>
        <Box padding={2}>
          <img
            src={france}
            alt="france"
            style={{ width: "40px", cursor: "pointer" }}
          />
        </Box>
        <Box padding={2}>
          <img
            src={russia}
            alt="russia"
            style={{ width: "40px", cursor: "pointer" }}
          />
        </Box>
        <Box padding={2}>
          <img src={UK} alt="UK" style={{ width: "40px", cursor: "pointer" }} />
        </Box>
        <Box padding={2}>
          <img
            src={egypt}
            alt="egypt"
            style={{ width: "40px", cursor: "pointer" }}
          />
        </Box>
        <Box padding={2}>
          <img
            src={india}
            alt="india"
            style={{ width: "40px", cursor: "pointer" }}
          />
        </Box>
      </Box>
      <Grid container columnSpacing={10}>
        <Grid
          item
          xs={12}
          sm={6}
          sx={{ fontWeight: 500, fontSize: "16px", color: "white", padding: 2 }}
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

export default PrivacyPolicy;
