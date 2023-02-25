import { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  Alert,
  Pressable,
  Button,
} from "react-native";

export default function App() {
  const [attendances, setattendances] = useState({
    philipp: -1,
    ida: -1,
    lena: -1,
    marie: -1,
    georg: -1,
    karin: -1,
    claudi: -1,
  });

  const [user_texts, setuser_texts] = useState({
    philipp: "",
    ida: "",
    lena: "",
    marie: "",
    georg: "",
    karin: "",
    claudi: "",
    werner: "",
  });

  const [user_update_time, setuser_update_time] = useState({
    philipp: "",
    ida: "",
    lena: "",
    marie: "",
    georg: "",
    karin: "",
    claudi: "",
    werner: "",
  });

  const [att_num, setatt_num] = useState(0);
  const [non_att_num, setnon_att_num] = useState(0);
  const [no_feedback, setno_feedback] = useState(0);
  const [reload, set_reload] = useState(false);
  var loaded = false;

  function update_attendances(key, value) {
    setattendances((prevState) => ({
      ...prevState,
      [key]: value,
    }));
  }

  function update_user_texts(key, value) {
    setuser_texts((prevState) => ({
      ...prevState,
      [key]: value,
    }));
  }

  function update_user_time(key, value) {
    setuser_update_time((prevState) => ({
      ...prevState,
      [key]: value,
    }));
  }

  const get_data = async () => {
    console.log("fetch data");
    fetch("https://omaserver.up.railway.app/current_users")
      .then((response) => response.json())
      .then((json) => {
        try {
          let att_num = 0;
          let non_att_num = 0;
          let no_feedback = 0;
          json.data.forEach((elm) => {
            console.log(elm.updated);
            update_user_time(elm.name, elm.updated);
            update_user_texts(elm.name, elm.message);

            if (elm.name != "werner") {
              update_attendances(elm.name, elm.attendance);
              if (elm.attendance == 1) {
                att_num++;
              } else if (elm.attendance == 0) {
                non_att_num++;
              } else {
                no_feedback++;
              }
            }
          });

          setatt_num(att_num);
          setnon_att_num(non_att_num);
          setno_feedback(no_feedback);
        } catch (err) {
          console.error(err);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    if (!loaded) {
      get_data();
      loaded = true;
    }
    try {
      setInterval(async () => {
        get_data();
      }, 30000);
    } catch (e) {
      console.log(e);
    }
  }, []);

  function bool_to_color(b) {
    if (b == 1) {
      return "green";
    } else if (b == 0) {
      return "red";
    } else {
      return "white";
    }
  }

  return (
    <View style={styles.main_container}>
      <View style={styles.user_attendance}>
        <View style={styles.user_attendance_left}>
          <View style={styles.user_component}>
            <Image
              style={styles.user_picture}
              source={require("./assets/philipp.jpg")}
            ></Image>

            <Text style={styles.user_text}>{user_texts.philipp}</Text>
            {attendances.philipp != -1 ? (
              <Text style={styles.user_update_time}>
                {user_update_time.philipp} Uhr
              </Text>
            ) : (
              <></>
            )}
            <View
              style={[
                styles.attendance_icon,
                { backgroundColor: bool_to_color(attendances.philipp) },
              ]}
            ></View>
          </View>

          <View style={styles.user_component}>
            <Image
              style={styles.user_picture}
              source={require("./assets/marie.jpg")}
            ></Image>

            <Text style={styles.user_text}>{user_texts.marie}</Text>
            {attendances.marie != -1 ? (
              <Text style={styles.user_update_time}>
                {user_update_time.marie} Uhr
              </Text>
            ) : (
              <></>
            )}
            <View
              style={[
                styles.attendance_icon,
                { backgroundColor: bool_to_color(attendances.marie) },
              ]}
            ></View>
          </View>

          <View style={styles.user_component}>
            <Image
              style={styles.user_picture}
              source={require("./assets/georg.jpg")}
            ></Image>

            <Text style={styles.user_text}>{user_texts.georg}</Text>
            {attendances.georg != -1 ? (
              <Text style={styles.user_update_time}>
                {user_update_time.georg} Uhr
              </Text>
            ) : (
              <></>
            )}
            <View
              style={[
                styles.attendance_icon,
                { backgroundColor: bool_to_color(attendances.georg) },
              ]}
            ></View>
          </View>

          <View style={styles.user_component}>
            <Image
              style={styles.user_picture}
              source={require("./assets/karin.jpg")}
            ></Image>

            <Text style={styles.user_text}>{user_texts.karin}</Text>
            {attendances.karin != -1 ? (
              <Text style={styles.user_update_time}>
                {user_update_time.karin} Uhr
              </Text>
            ) : (
              <></>
            )}
            <View
              style={[
                styles.attendance_icon,
                { backgroundColor: bool_to_color(attendances.karin) },
              ]}
            ></View>
          </View>
        </View>
        <View style={styles.user_attendance_right}>
          <View style={styles.user_component}>
            <Image
              style={styles.user_picture}
              source={require("./assets/ida.jpg")}
            ></Image>

            <Text style={styles.user_text}>{user_texts.ida}</Text>
            {attendances.ida != -1 ? (
              <Text style={styles.user_update_time}>
                {user_update_time.ida} Uhr
              </Text>
            ) : (
              <></>
            )}
            <View
              style={[
                styles.attendance_icon,
                { backgroundColor: bool_to_color(attendances.ida) },
              ]}
            ></View>
          </View>
          <View style={styles.user_component}>
            <Image
              style={styles.user_picture}
              source={require("./assets/lena01.jpg")}
            ></Image>

            <Text style={styles.user_text}>{user_texts.lena}</Text>
            {attendances.lena != -1 ? (
              <Text style={styles.user_update_time}>
                {user_update_time.lena} Uhr
              </Text>
            ) : (
              <></>
            )}
            <View
              style={[
                styles.attendance_icon,
                { backgroundColor: bool_to_color(attendances.lena) },
              ]}
            ></View>
          </View>
          <View style={styles.user_component}>
            <Image
              style={styles.user_picture}
              source={require("./assets/claudi.jpg")}
            ></Image>

            <Text style={styles.user_text}>{user_texts.claudi}</Text>
            {attendances.claudi != -1 ? (
              <Text style={styles.user_update_time}>
                {user_update_time.claudi} Uhr
              </Text>
            ) : (
              <></>
            )}
            <View
              style={[
                styles.attendance_icon,
                { backgroundColor: bool_to_color(attendances.claudi) },
              ]}
            ></View>
          </View>

          <View style={styles.user_component}>
            <Image
              style={styles.user_picture}
              source={require("./assets/face.png")}
            ></Image>

            <Text style={styles.user_text}>{user_texts.werner}</Text>
            {user_texts.werner != null ? (
              <Text style={styles.user_update_time}>
                {user_update_time.werner} Uhr
              </Text>
            ) : (
              <></>
            )}
          </View>
        </View>
      </View>
      <View style={styles.attendance_eval}>
        <Text style={styles.attendance_eval_text}>
          {att_num} Leute kommen heute.
        </Text>
        <Text style={styles.attendance_eval_text}>
          {non_att_num} Leute kommen heute nicht.
        </Text>
        <Text style={styles.attendance_eval_text}>
          Von {no_feedback} Leuten gibt es noch keine Rückmeldung.
        </Text>
      </View>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  main_container: {
    flex: 1,
    //borderWidth: 5,
    borderColor: "black",
    flexDirection: "column",
    backgroundColor: "#fff",
    justifyContent: "flex-start",
    alignItems: "stretch",
    margin: "2%",
  },
  user_attendance: {
    flex: 4,
    flexDirection: "row",
    //borderWidth: 5,
    borderColor: "#f00000",
    backgroundColor: "#fff",
    justifyContent: "space-around",
  },
  user_attendance_left: {
    flex: 1,
    //borderWidth: 5,
    textAlign: "center", // <-- the magic
    alignContent: "space-between",
    justifyContent: "space-between",
    borderColor: "blue",
  },
  user_attendance_right: {
    flex: 1,
    //borderWidth: 5,
    alignContent: "space-between",
    justifyContent: "space-around",
    textAlign: "center", // <-- the magic
    borderColor: "blue",
  },
  user_component: {
    margin: 10,
    marginHorizontal: 30,
    padding: "0.3%",
    maxHeight: "22%",
    flexDirection: "row",
    borderRadius: 40,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 5,
    backgroundColor: "#707070",
    borderColor: "purple",
  },
  user_picture: {
    borderRadius:
      Math.round(
        Dimensions.get("window").width + Dimensions.get("window").height
      ) / 2,
    borderWidth: 5,
    // borderColor: "black",
    // padding: 10,
    width: (Dimensions.get("window").width * 0.5) / 8,
    height: (Dimensions.get("window").width * 0.5) / 8,
    marginLeft: 10,
  },
  user_update_time: {
    flex: 1,
    fontWeight: "normal",
    fontSize: 25,
    marginTop: "11%",
    marginRight: "0.8%",
  },
  user_text: {
    // updated TIMESTAMP default NOW() ON UPDATE NOW();
    flex: 5,
    textAlign: "center", // <-- the magic
    fontWeight: "bold",
    fontSize: 25,
  },
  attendance_icon: {
    borderWidth: 5,
    borderColor: "black",
    marginBottom: "-12%",
    marginRight: -25,
    borderRadius:
      Math.round(
        Dimensions.get("window").width + Dimensions.get("window").height
      ) / 2,
    width: (Dimensions.get("window").width * 0.5) / 16,
    height: (Dimensions.get("window").width * 0.5) / 16,
  },
  attendance_eval: {
    flex: 1,
    flexDirection: "row",
    //borderWidth: 5,
    borderColor: "black",
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  attendance_eval_text: {
    flex: 1,
    borderWidth: 5,
    padding: "1%",
    margin: "1.5%",
    borderRadius: 50,
    borderColor: "#2300a3",
    textAlign: "center", // <-- the magic
    fontWeight: "bold",
    fontSize: 18,
  },
});
