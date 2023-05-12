import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Dimensions,
} from "react-native";
import PropTypes from "prop-types";

function bool_to_color(b) {
  if (b == 1) {
    return "green";
  } else if (b == 0) {
    return "red";
  } else {
    return "white";
  }
}

class UserComponent extends Component {
  render() {
    return (
      <View style={styles.user_component}>
        <Image
          style={styles.user_picture}
          source={require(`./assets/${this.props.image_name}`)}
        ></Image>

        <Text style={styles.user_text}>{this.props.user_text}</Text>

        {(this.props.attendance != -1 && this.props.username != "werner") ||
        (this.props.username == "werner" &&
          this.props.user_text != "") ? (
          <Text style={styles.user_update_time}>
            {this.props.user_update_time} Uhr
          </Text>
        ) : null}
        {this.props.username != "werner" ? (
          <View
            style={[
              styles.attendance_icon,
              { backgroundColor: bool_to_color(this.props.attendance) },
            ]}
          ></View>
        ) : null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
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
  user_text: {
    // updated TIMESTAMP default NOW() ON UPDATE NOW();
    flex: 5,
    textAlign: "center", // <-- the magic
    fontWeight: "bold",
    fontSize: 25,
  },
  user_update_time: {
    flex: 1.5,
    fontWeight: "normal",
    fontSize: 22,
    marginTop: "11%",
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

UserComponent.propTypes = {
  username: PropTypes.string.isRequired,
  user_text: PropTypes.string.isRequired,
  attendance: PropTypes.number.isRequired,
  user_update_time: PropTypes.string.isRequired,
  image_name: PropTypes.string.isRequired,
};

export default UserComponent;
