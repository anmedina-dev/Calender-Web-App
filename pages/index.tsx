import {
  useSession,
  signOut,
  getSession,
  GetSessionParams,
} from "next-auth/react";
import {
  FormControl,
  Input,
  TextField,
  ThemeProvider,
  createTheme,
  CssBaseline,
} from "@mui/material";
import dayjs, { Dayjs } from "dayjs";
import styles from "../styles/index.module.css";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import Image from "next/image";
import { useState } from "react";

export default function Home() {
  const darkTheme = createTheme({
    palette: {
      mode: "dark",
    },
  });
  const { data: session, status } = useSession();

  const [value, setValue] = useState<Dayjs | null>(dayjs());
  const handleChange = (newValue: Dayjs | null) => {
    setValue(newValue);
  };

  if (status !== "authenticated") {
    return (
      <div>
        <p>You are not Signed in</p>
      </div>
    );
  }

  const userImage = session.user?.image;

  return (
    <div className={styles.body}>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <div className="container">
          <div className={styles.header}>
            <div className={styles.dropdown}>
              <a
                className="btn btn-secondary dropdown-toggle"
                role="button"
                id="dropdownMenuButton1"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <Image
                  src={userImage!}
                  alt="user"
                  className={styles.profile_image}
                  height={50}
                  width={50}
                  priority
                />
                {session.user?.name}
              </a>
              <ul
                className="dropdown-menu"
                aria-labelledby="dropdownMenuButton1"
              >
                <li>
                  <a
                    className="dropdown-item"
                    href="#"
                    onClick={() => signOut()}
                  >
                    Sign Out
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className={styles.main_section}>
            <FormControl className={styles.form_section}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DesktopDatePicker
                  label="Date"
                  inputFormat="MM/DD/YYYY"
                  value={value}
                  onChange={handleChange}
                  renderInput={(params) => (
                    <TextField
                      required
                      id="outlined-required"
                      color="primary"
                      {...params}
                    />
                  )}
                />
              </LocalizationProvider>
              <TextField required id="outlined-required" label="Required" />
            </FormControl>
            <div className={styles.calender_section}>Hello</div>
          </div>
        </div>
      </ThemeProvider>
    </div>
  );
}

export const getServerSideProps = async (
  context: GetSessionParams | undefined
) => {
  const session = await getSession(context);
  if (!session) {
    return {
      redirect: {
        destination: "/login",
      },
    };
  }
  return {
    props: { session },
  };
};
