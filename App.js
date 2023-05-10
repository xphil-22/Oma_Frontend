import { useState, useEffect, useRef } from "react";
import { StatusBar } from "expo-status-bar";
// import user_item from "user_item";

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

  var loaded = false;
  var local_date = new Date();
  let date_str =
    local_date.getFullYear() +
    "." +
    String(local_date.getMonth() + 1).padStart(2, "0") +
    "." +
    String(local_date.getDate()).padStart(2, "0");
  const [display_date, set_display_date] = useState(date_str);
  //const [date, set_date] = useState(new Date(local_date));
  const date = useRef(new Date(local_date));
  //console.log("datee: ", date)

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
      console.error("cannot read pins, api is maybe not available", error);
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

  Date.prototype.addHours = function(h) {
    this.setTime(this.getTime() + (h*60*60*1000));
    return this;
  }

  const get_data = async (date_to_fetch = date.current) => {
    //console.log(date_to_fetch);
    var date_str =
      date_to_fetch.getFullYear() +
      "." +
      String(date_to_fetch.getMonth() + 1).padStart(2, "0") +
      "." +
      String(date_to_fetch.getDate()).padStart(2, "0");
    //console.log(
    //  "fetch data",
    //  `https://omaserver.up.railway.app/current_users/?date=${date_str}`
    //);
    fetch(`https://omaserver.up.railway.app/current_users/?date=${date_str}`)
      .then((response) => response.json())
      .then((json) => {
        try {
          //console.log("fetch: ", date_to_fetch)
          //console.log("wrong date: ", json.wrong_date, date_to_fetch)
          if (json.wrong_date) {
            throw new Error("date is too far in the future or in the past");
          }
          let att_num = 0;
          let non_att_num = 0;
          let no_feedback = 0;
          set_display_date(date_str);
          //set_date(new Date(date_to_fetch));
          date.current = new Date(date_to_fetch);
          //console.log("edited date: ", date)
          json.data.forEach((elm) => {
            console.log(elm.update_time);
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

            //console.log(today, tomorrow, yesterday)
            var date_time = "";
            if (elm.update_date == today) {
              date_time = `Heute `;
            } else if (elm.update_date == yesterday) {
              date_time = `Gestern `;
            } else {
              date_time = elm.update_date;
            }
            if (elm.name == "werner") {
              //alert(String(elm.message) == "null")
            }
            //console.log(elm.name, date_time + elm.update_time)
            update_user_time(elm.name, date_time + " " + elm.update_time);
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
        //console.log("loading: ", date)
        get_data();
      }, 8000);
    } catch (e) {
      console.log(e);
    }

    setInterval(read_pins, 10000);
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
        {/*<Button
          style={styles.button_tomorrow}
          title="getdate"
          onPress={() => {
            alert(date.current);
            //alert(user_texts.werner.to_string())
            //alert(user_texts.werner == null)
          }}
        ></Button>*/}
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
          <View style={styles.user_component}>
            <Image
              style={styles.user_picture}
              source={require("./assets/Philipp.jpg")}
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
            {
              //<user_item username='firstUser' />
              }

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
              source={require("./assets/werner.png")}
            ></Image>

            <Text style={styles.user_text}>{user_texts.werner}</Text>
            {String(user_texts.werner) != "null" &&
            String(user_texts.werner) != "" ? (
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
