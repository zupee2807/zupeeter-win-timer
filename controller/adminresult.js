const { queryDb } = require("../helper/adminHelper");

exports.sendDisawarAmountToTheAdmin = async (io) => {
  try {
    const data = await queryDb(
      "SELECT `number`,`amount` FROM `satta_bet_log_03`;",
      []
    );
    io.emit("oneminsattadisawaramount", JSON.stringify(data || ""));
  } catch (e) {
    console.log(e);
  }
};
exports.sendGaliAmountToTheAdmin = async (io) => {
  try {
    const data = await queryDb(
      "SELECT `number`,`amount` FROM `satta_bet_log_02`;",
      []
    );
    io.emit("oneminsattagaliamount", JSON.stringify(data || ""));
  } catch (e) {
    console.log(e);
  }
};
exports.sendFaridabadAmountToTheAdmin = async (io) => {
  try {
    const data = await queryDb(
      "SELECT `number`,`amount` FROM `satta_bet_log_01`;",
      []
    );
    io.emit("oneminsattafaridabadamount", JSON.stringify(data || ""));
  } catch (e) {
    console.log(e);
  }
};
exports.sendGaziyabadAmountToTheAdmin = async (io) => {
  try {
    const data = await queryDb(
      "SELECT `number`,`amount` FROM `satta_bet_log`;",
      []
    );
    io.emit("oneminsattagaziyabadamount", JSON.stringify(data || ""));
  } catch (e) {
    console.log(e);
  }
};
exports.sendRouletteAmountToTheAdmin = async (io) => {
  try {
    const data = await queryDb(
      "SELECT `number`,`amount` FROM `roulette_bet_log`;",
      []
    );
    io.emit("oneminrouletteamount", JSON.stringify(data || ""));
  } catch (e) {
    console.log(e);
  }
};
exports.sendWingoAmountToTheAdmin = async (io) => {
  try {
    const data = await queryDb(
      "SELECT `slot_num`,`game_type`,`round_no`,`mid_amount` FROM wingo_get_amount_on_slot WHERE `game_type` = 1;",
      []
    );
    io.emit("oneminwingoamount", JSON.stringify(data || ""));
  } catch (e) {
    console.log(e);
  }
};
exports.sendWingoAmountToTheAdminThreeMin = async (io) => {
  try {
    const data = await queryDb(
      "SELECT `slot_num`,`game_type`,`round_no`,`mid_amount` FROM wingo_get_amount_on_slot WHERE `game_type` = 2;",
      []
    );
    io.emit("oneminwingoamountthreemin", JSON.stringify(data || ""));
  } catch (e) {
    console.log(e);
  }
};
exports.sendWingoAmountToTheAdminFiveMin = async (io) => {
  try {
    const data = await queryDb(
      "SELECT `slot_num`,`game_type`,`round_no`,`mid_amount` FROM wingo_get_amount_on_slot WHERE `game_type` = 3;",
      []
    );
    io.emit("oneminwingoamountfivemin", JSON.stringify(data || ""));
  } catch (e) {
    console.log(e);
  }
};
