const schedule = require("node-cron");
const schedules = require("node-schedule");
const {
  queryDb,
  functionToreturnDummyResult,
} = require("../helper/adminHelper");
const moment = require("moment");
const soment = require("moment-timezone");
const { default: axios } = require("axios");

exports.generatedTimeEveryAfterEveryOneMin = (io) => {
  const job = schedule.schedule("* * * * * *", function () {
    const now = new Date();
    const nowIST = soment(now).tz("Asia/Kolkata");

    const currentMinute = nowIST.minutes();
    const currentSecond = nowIST.seconds();
    // const timeToSend =
    //   currentTime.getSeconds() > 0
    //     ? 60 - currentTime.getSeconds()
    //     : currentTime.getSeconds();
    io.emit("onemin", `${currentMinute}_${currentSecond}`);
  });
};

exports.generatedTimeEveryAfterEveryOneMinTRX = (io) => {
  let oneMinTrxJob = schedule.schedule("* * * * * *", function () {
    const currentTime = new Date();
    const timeToSend =
      currentTime.getSeconds() > 0
        ? 60 - currentTime.getSeconds()
        : currentTime.getSeconds();
    io.emit("onemintrx", timeToSend);
  });
};
exports.jobRunByCrone = async () => {
  schedule.schedule("54 * * * * *", async function () {
    // let timetosend = new Date();
    // timetosend.setSeconds(54);
    // timetosend.setMilliseconds(0);
    // let updatedTimestamp = parseInt(timetosend.getTime().toString());
    const actualtome = soment.tz("Asia/Kolkata");
    const time = actualtome;
    // .add(5, "hours").add(30, "minutes").valueOf();
    const getTime = await queryDb(
      "SELECT `utc_time` FROM `trx_UTC_timer` ORDER BY `id` DESC LIMIT 1;",
      []
    );
    let time_to_Tron = getTime?.[0]?.utc_time;
    setTimeout(async () => {
      await callTronAPISecond(time_to_Tron, time);
      recurstionCount = 0;
    }, 5000);
  });
};

async function callTronAPISecond(time_to_Tron, time) {
  await axios
    .get(
      `https://apilist.tronscanapi.com/api/block`,
      {
        params: {
          sort: "-balance",
          start: "0",
          limit: "20",
          producer: "",
          number: "",
          start_timestamp: time_to_Tron,
          end_timestamp: time_to_Tron,
        },
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
    .then((result) => {
      if (result?.data?.data?.[0]) {
        recurstionCount = 0;
        const obj = result?.data?.data?.[0];
        sendOneMinResultToDatabase(time, obj, time_to_Tron);
      } else {
        console.log("recursion called", time_to_Tron);
        setTimeout(async () => {
          await callTronAPISecond(time_to_Tron, time);
        }, 1500);
      }
    })
    .catch((e) => {
      console.log("error in tron api", time_to_Tron);
      if (recurstionCount <= 4) {
        setTimeout(() => {
          recurstionCount = recurstionCount + 1;
          callTronAPISecond(time_to_Tron, time);
        }, 1000);
      } else {
        console.log("else function is called", time_to_Tron);
        sendOneMinResultToDatabase(
          time,
          functionToreturnDummyResult(
            Math.floor(Math.random() * (4 - 0 + 1)) + 0
          ),
          time_to_Tron
        );
      }
    });
}
const sendOneMinResultToDatabase = async (time, obj, updatedTimestamp) => {
  const newString = obj.hash;
  let num = null;
  for (let i = newString.length - 1; i >= 0; i--) {
    if (!isNaN(parseInt(newString[i]))) {
      num = parseInt(newString[i]);
      break;
    }
  }
  const query = `CALL sp_insert_trx_one_min_result_new(?, ?, ?, ?, ?, ?, ?)`;
  await queryDb(query, [
    num,
    String(moment(time).format("HH:mm:ss")),
    1,
    `**${obj.hash.slice(-4)}`,
    JSON.stringify({ ...obj, updatedTimestamp: updatedTimestamp }),
    `${obj.hash.slice(-5)}`,
    obj.number,
  ])
    .then((result) => {})
    .catch((e) => {
      console.log(e);
    });
};

exports.rouletteResult = (io) => {
  let resultToBeSend = "";

  function generatedTimeEveryAfterEveryOneMinForRollet() {
    let second = 59;
    let job = schedules.scheduleJob("* * * * * *", async function () {
      io.emit("oneminrollet", second); // Emit the formatted time
      if (second === 5) {
        try {
          callAPI();
        } catch (e) {
          console.log(e);
        }
      }
      if (second === 0) {
        second = 59;
        io.emit("rolletresult", resultToBeSend);
        job?.cancel();
        job?.cancel();
        job?.cancel();
        job?.cancel();
        setTimeout(() => {
          generatedTimeEveryAfterEveryOneMinForRollet();
        }, 10000);
      } else {
        second--;
      }
    });
  }
  generatedTimeEveryAfterEveryOneMinForRollet();
  async function callAPI() {
    try {
      const query_for_call_set_result =
        "CALL generate_result_of_roulette_game(@result_msg); SELECT @result_msg;";
      await queryDb(query_for_call_set_result)
        .then((result) => {
          resultToBeSend = result?.[0]?.["@result_msg"];
        })
        .catch((e) => {
          console.log(e);
        });
    } catch (e) {
      console.log(e);
    }
  }
};
