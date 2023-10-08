import {
  Box,
  Typography,
  Grid,
  TextField,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import Translate from "../../common/translate/Translate";

const Contact = () => {
  return (
    <Box>
      <Typography
        fontFamily={"Parisienne"}
        textAlign={"center"}
        color={"#FF6063"}
        fontSize={"48px"}
        fontWeight={400}
      >
        <Translate>Contact</Translate>
      </Typography>
      <Grid container direction={"column"} spacing={10} padding={"50px"}>
        <Grid
          item
          xs={12}
          sm={6}
          sx={{ fontWeight: 500, fontSize: "16px", color: "white" }}
        >
          <TextField
            placeholder="First Name"
            fullWidth
            sx={{ background: "white", borderRadius: 5 }}
          />
        </Grid>
        <Grid item xs={12} sm={6} textAlign={"center"}>
          <TextField
            placeholder="Last name"
            fullWidth
            sx={{ background: "white", borderRadius: 5 }}
          />
        </Grid>
        <Grid item xs={12} sm={6} textAlign={"center"}>
          <TextField
            placeholder="Email"
            fullWidth
            sx={{ background: "white", borderRadius: 5 }}
          />
        </Grid>
        <Grid item xs={12} sm={6} textAlign={"center"}>
          <TextField
            fullWidth
            multiline
            maxRows={4}
            sx={{ background: "white", borderRadius: 5 }}
            InputProps={{
              style: {
                height: 105,
              },
            }}
            placeholder="Message"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Box
            width={350}
            height={100}
            sx={{ background: "white", borderRadius: 5 }}
            justifyContent={"center"}
            alignItems={"center"}
            display={"flex"}
          >
            <FormControlLabel
              control={<Checkbox defaultChecked />}
              label="I'm not a robot"
            />
          </Box>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Box
            width={500}
            height={100}
            sx={{ background: "white", borderRadius: 5 }}
            justifyContent={"center"}
            alignItems={"center"}
            display={"flex"}
          >
            <FormControlLabel
              control={<Checkbox defaultChecked />}
              label="Agree with privacy policy to receive communiactions "
            />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Contact;
