import { StyleSheet, View, FlatList, Image, Dimensions, } from "react-native";

function User_item_left() {
  return (
    <View style={styles.user_component}>
      <Image
        style={styles.user_picture}
        source={require("./../assets/philipp.jpg")}
      ></Image>

      <Text style={styles.user_text}>{"user_texts.philipp"}</Text>
      {1 != -1 ? (
        <Text style={styles.user_update_time}>
          12 Uhr
        </Text>
      ) : (
        <></>
      )}
      <View
        style={[
          styles.attendance_icon,
          { backgroundColor: "green" }
        ]}
      ></View>
    </View>
  );
}

const styles = StyleSheet.create({
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
});

export default User_item_left;
