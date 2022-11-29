import {
  useSession,
  signOut,
  getSession,
  GetSessionParams,
} from "next-auth/react";
import {
  FormGroup,
  TextField,
  ThemeProvider,
  createTheme,
  CssBaseline,
  Button,
  CircularProgress,
} from "@mui/material";
import styles from "../styles/index.module.css";
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  Timestamp,
  where,
} from "firebase/firestore";
import db from "../firebase/config";
import Image from "next/image";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { SetStateAction, useEffect, useState } from "react";

type CalenderType = {
  id: string;
  date: Date;
  email: string;
  hours: number;
  leetcode: string;
  link: string;
  worked_on: string;
  learned: string;
};

type FormType = {
  hours: number;
  leetcode: string;
  link: string;
  worked_on: string;
  learned: string;
};

export default function Home() {
  const darkTheme = createTheme({
    palette: {
      mode: "dark",
    },
  });
  const { data: session, status } = useSession();

  const [value, onChange] = useState(new Date());
  const [userData, setUserData] = useState<CalenderType[]>([]);
  const [formData, setFormData] = useState<FormType>({
    hours: 0,
    leetcode: "",
    link: "",
    worked_on: "",
    learned: "",
  });
  const [dates, setDates] = useState<Date[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.user?.email]);

  useEffect(() => {
    // console.log(userData);
    const tempDates: SetStateAction<Date[]> = [];
    userData.forEach((date) => {
      tempDates.push(date.date);
    });
    setDates(tempDates);
  }, [userData]);

  useEffect(() => {
    console.log(dates);
  }, [dates]);

  useEffect(() => {
    const dataDate = userData.find(
      (element) => element.date.getDate() === value.getDate()
    );

    if (!dataDate) {
      let formObj: FormType = {
        hours: 0,
        learned: "",
        leetcode: "",
        link: "",
        worked_on: "",
      };
      setFormData(formObj);
      return;
    }
    console.log(dataDate);
    console.log(value);
    let obj: FormType = {
      hours: dataDate?.hours!,
      learned: dataDate?.learned!,
      leetcode: dataDate?.leetcode!,
      link: dataDate?.link!,
      worked_on: dataDate?.worked_on!,
    };
    setFormData(obj);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  if (status !== "authenticated") {
    return (
      <div>
        <p>You are not Signed in</p>
      </div>
    );
  }

  const getData = () => {
    (async () => {
      const colRef = collection(db, "calender");
      const q = query(colRef, where("email", "==", session?.user?.email));
      const docs = await getDocs(q);
      const tempData: Array<CalenderType> = Array();
      docs.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        let obj: CalenderType = {
          id: doc.id,
          date: new Timestamp(
            doc.data().date.seconds,
            doc.data().date.nanoseconds
          ).toDate(),
          email: doc.data().email,
          hours: doc.data().hours,
          leetcode: doc.data().leetcode,
          link: doc.data().link,
          worked_on: doc.data().worked_on,
          learned: doc.data().learned,
        };
        tempData.push(obj);
      });
      const dataDate = tempData.find(
        (element) => element.date.getDate() === value.getDate()
      );
      if (dataDate) {
        let obj: FormType = {
          hours: dataDate?.hours!,
          learned: dataDate?.learned!,
          leetcode: dataDate?.leetcode!,
          link: dataDate?.link!,
          worked_on: dataDate?.worked_on!,
        };
        setFormData(obj);
      }
      setUserData(tempData);
      setIsLoading(false);
    })();
  };

  const handleSubmit = () => {
    const dataDate = userData.find(
      (element) => element.date.getDate() === value.getDate()
    );
    if (!dataDate) {
      const colRef = doc(collection(db, "calender"));
      setDoc(colRef, {
        date: value,
        email: session.user?.email,
        hours: formData.hours,
        learned: formData.learned,
        leetcode: formData.leetcode,
        link: formData.link,
        worked_on: formData.worked_on,
      });
      return;
    }
    const colRef = doc(db, "calender", dataDate?.id);
    setDoc(
      colRef,
      {
        date: value,
        email: session.user?.email,
        hours: formData.hours,
        learned: formData.learned,
        leetcode: formData.leetcode,
        link: formData.link,
        worked_on: formData.worked_on,
      },
      { merge: true }
    ).then(() => {
      console.log("Document Added");
      getData();
    });
  };

  const handleWorkedOnChange = (
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    setFormData({ ...formData, worked_on: event.target.value });
  };

  const handleHoursChange = (
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    if (!event.target.value) {
      setFormData({ ...formData, hours: 0 });
      return;
    }
    setFormData({ ...formData, hours: parseInt(event.target.value) });
  };

  const handleLeetCodeChange = (
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    setFormData({ ...formData, leetcode: event.target.value });
  };

  const handleLinkChange = (
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    setFormData({ ...formData, link: event.target.value });
  };

  const handleLearnedChange = (
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    setFormData({ ...formData, learned: event.target.value });
  };

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
            {isLoading ? (
              <CircularProgress />
            ) : (
              <>
                <FormGroup className={styles.form_section}>
                  <TextField
                    required
                    id="outlined-required"
                    label="What did you work on"
                    multiline
                    rows={2}
                    value={formData.worked_on}
                    onChange={handleWorkedOnChange}
                  />
                  <TextField
                    required
                    id="outlined-required"
                    label="How many hours"
                    value={formData.hours}
                    onChange={handleHoursChange}
                  />
                  <TextField
                    id="outlined-required"
                    label="Leet Code Question"
                    multiline
                    rows={2}
                    value={formData.leetcode}
                    onChange={handleLeetCodeChange}
                  />
                  <TextField
                    id="outlined-required"
                    label="Link"
                    value={formData.link}
                    onChange={handleLinkChange}
                  />
                  <TextField
                    required
                    id="outlined-required"
                    label="Fact you learned today"
                    multiline
                    rows={4}
                    value={formData.learned}
                    onChange={handleLearnedChange}
                  />
                  <Button variant="contained" onClick={handleSubmit}>
                    Submit
                  </Button>
                </FormGroup>
                <div className={styles.calender_section}>
                  <Calendar
                    onChange={onChange}
                    value={value}
                    tileClassName={({ date }) => {
                      if (dates.find((x) => x.getTime() === date.getTime())) {
                        let highlight: string = "highlight";
                        return highlight;
                      }
                    }}
                  />
                </div>
              </>
            )}
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
