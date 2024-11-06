const { queryDb } = require("../helper/adminHelper");

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
