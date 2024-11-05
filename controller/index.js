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
    // .get(
    //   `https://apilist.tronscanapi.com/api/block`,
    //   {
    //     params: {
    //       sort: "-balance",
    //       start: "0",
    //       limit: "20",
    //       producer: "",
    //       number: "",
    //       start_timestamp: time_to_Tron,
    //       end_timestamp: time_to_Tron,
    //     },
    //   },
    //   {
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //   }
    // )
    .post(
      "https://api.bigdaddygame.cc/api/webapi/GetTRXNoaverageEmerdList",
      {
        language: 0,
        pageNo: 1,
        pageSize: 10,
        random: "b3916639d913484e814da988f6a8b95d",
        signature: "7CD983B51ADD93DD24CCBFBE7A816410",
        timestamp: 1729574397,
        typeId: 13,
      },
      {
        headers: {
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOiIxNzMwODA1MjMzIiwibmJmIjoiMTczMDgwNTIzMyIsImV4cCI6IjE3MzA4MDcwMzMiLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL2V4cGlyYXRpb24iOiIxMS81LzIwMjQgNToxMzo1MyBQTSIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IkFjY2Vzc19Ub2tlbiIsIlVzZXJJZCI6IjEyNTE5NjE4IiwiVXNlck5hbWUiOiI5MTgyMTA0MzI2ODMiLCJVc2VyUGhvdG8iOiIxIiwiTmlja05hbWUiOiJNZW1iZXJOTkdQSFpLNyIsIkFtb3VudCI6IjAuMDAiLCJJbnRlZ3JhbCI6IjAiLCJMb2dpbk1hcmsiOiJINSIsIkxvZ2luVGltZSI6IjExLzUvMjAyNCA0OjQzOjUzIFBNIiwiTG9naW5JUEFkZHJlc3MiOiIxMjQuMTIzLjc4LjEyMyIsIkRiTnVtYmVyIjoiMCIsIklzdmFsaWRhdG9yIjoiMCIsIktleUNvZGUiOiI2OCIsIlRva2VuVHlwZSI6IkFjY2Vzc19Ub2tlbiIsIlBob25lVHlwZSI6IjEiLCJVc2VyVHlwZSI6IjAiLCJVc2VyTmFtZTIiOiIiLCJpc3MiOiJqd3RJc3N1ZXIiLCJhdWQiOiJsb3R0ZXJ5VGlja2V0In0._g94PZRJbcqIhaLo_nHiB9mtWnFSHnM4iWZke-xaxVE",
        },
      }
    )
    .then((result) => {
      if (result?.data?.data?.data?.gameslist?.[0]) {
        recurstionCount = 0;
        const obj = result?.data?.data?.data?.gameslist?.[0];
        // const obj = result?.data?.data?.[0];
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
  const newString = obj.blockID;
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
    `**${obj.blockID.slice(-4)}`,
    JSON.stringify({ ...obj, updatedTimestamp: updatedTimestamp }),
    `${obj.blockID.slice(-5)}`,
    obj.blockNumber,
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
          resultToBeSend = result?.[1]?.[0]?.["@result_msg"];
        })
        .catch((e) => {
          console.log(e);
        });
    } catch (e) {
      console.log(e);
    }
  }
};
