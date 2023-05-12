import { useState, useEffect, useRef } from "react";
import { StatusBar } from "expo-status-bar";
import UserComponent from "./usercomponent";

import { Icon } from "@rneui/themed";
import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  Alert,
  Pressable,
  Button,
  FlatList,
  Platform
} from "react-native";
import { ListItem } from "@rneui/base";

export default function App() {
  let userArray = [
    { name: "philipp", image_name: "philipp.jpg" },
    { name: "marie", image_name: "marie.jpg" },
    { name: "georg", image_name: "georg.jpg" },
    { name: "karin", image_name: "karin.jpg" },
    { name: "ida", image_name: "ida.jpg" },
    { name: "lena", image_name: "lena02.jpg" },
    { name: "claudi", image_name: "claudi.jpg" },
    { name: "werner", image_name: "werner.png" },
    ,
  ];

  const [attendances, setattendances] = useState({
    philipp: -1,
    ida: -1,
    lena: -1,
    marie: -1,
    georg: -1,
    karin: -1,
    claudi: -1,
    werner: -2,
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

  var loaded = false;
  var local_date = new Date();
  let date_str =
    local_date.getFullYear() +
    "." +
    String(local_date.getMonth() + 1).padStart(2, "0") +
    "." +
    String(local_date.getDate()).padStart(2, "0");
  const [display_date, set_display_date] = useState(date_str);
  const date = useRef(new Date(local_date));

  function calc_Days(date, days) {
    const dateCopy = new Date(date);
    dateCopy.setDate(date.getDate() + days);
    return dateCopy;
  }

  const read_pins = async () => {
    console.log("try to read pins ...");
    try {
      const response = await fetch("http://localhost:5000/read_pins");
      const json = await response.json();
      console.log(json.pin_status);
      if (json.pin_status == 1) {
        get_data(calc_Days(date.current, 1));
      } else if (json.pin_status == -1) {
        get_data(calc_Days(date.current, -1));
      }
      return json.pin_status;
    } catch (error) {
      console.log("cannot read pins, api is maybe not available", error);
    }
  };

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

  Date.prototype.addHours = function (h) {
    this.setTime(this.getTime() + h * 60 * 60 * 1000);
    return this;
  };

  const get_data = async (date_to_fetch = date.current) => {
    var date_str =
      date_to_fetch.getFullYear() +
      "." +
      String(date_to_fetch.getMonth() + 1).padStart(2, "0") +
      "." +
      String(date_to_fetch.getDate()).padStart(2, "0");
    fetch(`https://omaserver.up.railway.app/current_users/?date=${date_str}`)
      .then((response) => response.json())
      .then((json) => {
        try {
          if (json.wrong_date) {
            throw new Error("date is too far in the future or in the past");
          }
          let att_num = 0;
          let non_att_num = 0;
          let no_feedback = 0;
          set_display_date(date_str);
          date.current = new Date(date_to_fetch);
          json.data.forEach((elm) => {
            var d = new Date();
            var today =
              String(d.getDate()).padStart(2, "0") +
              "." +
              String(d.getMonth() + 1).padStart(2, "0");
            d.setDate(d.getDate() + 1);
            var tomorrow =
              String(d.getDate()).padStart(2, "0") +
              "." +
              String(d.getMonth() + 1).padStart(2, "0");
            d.setDate(d.getDate() - 2);
            var yesterday =
              String(d.getDate()).padStart(2, "0") +
              "." +
              String(d.getMonth() + 1).padStart(2, "0");

            var date_time = "";
            if (elm.update_date == today) {
              date_time = `Heute`;
            } else if (elm.update_date == yesterday) {
              date_time = `Gestern`;
            } else {
              date_time = elm.update_date;
            }

            update_user_time(elm.name, date_time + " " + elm.update_time);

            if (elm.message != null) {
              update_user_texts(elm.name, elm.message);
            }
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
      }, 8000);
    } catch (e) {
      console.log(e);
    }
    if (Platform.OS === "web") {
      setInterval(read_pins, 10000);
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
      <View style={styles.change_day_containter}>
        <Button
          style={styles.button_tomorrow}
          title="gestern"
          color="#0000a8"
          onPress={() => {
            get_data(calc_Days(date.current, -1));
          }}
        ></Button>
        <Text style={styles.current_date}>{display_date}</Text>
        <Button
          style={styles.button_tomorrow}
          title="morgen"
          color="#006705"
          onPress={() => {
            get_data(calc_Days(date.current, 1));
          }}
        ></Button>
      </View>

      <View style={styles.user_attendance}>
        <View style={styles.user_attendance_left}>
          {userArray.map((item, i) =>
            i < 4 ? (
              <UserComponent
                username={item.name}
                user_text={user_texts[item.name]}
                attendance={attendances[item.name]}
                user_update_time={user_update_time[item.name]}
                image_name={item.image_name}
              />
            ) : null
          )}
        </View>
        <View style={styles.user_attendance_right}>
          {userArray.map((item, i) =>
            i >= 4 ? (
              <UserComponent
                username={item.name}
                user_text={user_texts[item.name]}
                attendance={attendances[item.name]}
                user_update_time={user_update_time[item.name]}
                image_name={item.image_name}
              />
            ) : null
            )}
        </View>
      </View>
      <View style={styles.attendance_eval}>
        <Text style={styles.attendance_eval_text}>
          {att_num == 1 ? (
            <Text>{att_num} Person kommt heute.</Text>
          ) : (
            <Text>{att_num} Personen kommen heute.</Text>
          )}
        </Text>
        <Text style={styles.attendance_eval_text}>
          {non_att_num == 1 ? (
            <Text>{non_att_num} Person kommt heute nicht.</Text>
          ) : (
            <Text>{non_att_num} Personen kommen heute nicht.</Text>
          )}
        </Text>
        <Text style={styles.attendance_eval_text}>
          {no_feedback == 1 ? (
            <Text>
              Von {no_feedback} Person gibt es noch keine Rückmeldung.
            </Text>
          ) : (
            <Text>
              Von {no_feedback} Personen gibt es noch keine Rückmeldung.
            </Text>
          )}
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
  current_date: {
    fontWeight: "bold",
    fontSize: 35,
  },
  change_day_containter: {
    flex: 0.35,
    flexDirection: "row",
    justifyContent: "space-between",
    //borderWidth: 5,
    marginHorizontal: "1.5%",
  },
  button_yesterday: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    alignContent: "center",
  },
  button_tomorrow: {
    backgroundColor: "#f00000",
    flex: 1,
    borderWidth: 5,
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
    flex: 1.5,
    fontWeight: "normal",
    fontSize: 22,
    marginTop: "11%",
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
    marginTop: 7,
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
