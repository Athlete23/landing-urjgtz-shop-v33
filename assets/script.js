document.addEventListener("DOMContentLoaded", function() {
  (() => {
    let now = new Date();
    const fullDate = document.querySelectorAll(".fullDate");

    let minDays;
    let dateFormat;
    const getFullDate = (d = null, mode) => {
      now = new Date();
      let day = now.getDate();
      now.setDate(day - d);
      if (mode == "yy") {
        return (
          now.getFullYear() +
          "." +
          (now.getMonth() + 1 < 10
            ? "0" + (now.getMonth() + 1)
            : now.getMonth() + 1) +
          "." +
          (now.getDate() < 10 ? "0" + now.getDate() : now.getDate())
        );
      } else if (mode == "mm") {
        return (
          (now.getMonth() + 1 < 10
            ? "0" + (now.getMonth() + 1)
            : now.getMonth() + 1) +
          "." +
          (now.getDate() < 10 ? "0" + now.getDate() : now.getDate()) +
          "." +
          now.getFullYear()
        );
      } else if (mode == "year") {
        return now.getFullYear();
      } else {
        return (
          (now.getDate() < 10 ? "0" + now.getDate() : now.getDate()) +
          "." +
          (now.getMonth() + 1 < 10
            ? "0" + (now.getMonth() + 1)
            : now.getMonth() + 1) +
          "." +
          now.getFullYear()
        );
      }
    };

    if (fullDate) {
      if (fullDate.length > 0) {
        minDays = null;
        dateFormat = null;
        fullDate.forEach(elem => {
          if (elem.getAttribute("minDays")) {
            minDays = +elem.getAttribute("minDays");
            dateFormat = elem.getAttribute("dateMode");
            elem.innerHTML = getFullDate(minDays, dateFormat);
          } else {
            elem.innerHTML = getFullDate(0);
          }
        });
      }
    }
  })();
  (() => {
    const docInfoDoorsWrapper = document.querySelector(
      ".docInfoDoors__wrapper"
    );
    const docInfoDoors = document.querySelectorAll(".docInfoDoors__doorsImage");
    const docInfoPopUp = document.querySelector(".winPopupBgDocInfoDoors");
    const docInfoPopUpClose = document.querySelector(
      ".winPopupDocInfoDoors__closeBtn"
    );
    const docInfoPopUpOk = document.querySelector(".winPopupDocInfoDoors__btn");
    const docInfoDoorsForm = document.querySelector(".docInfoDoors__form ");
    let parentDiv = docInfoDoorsForm;
    let ml = parentDiv
      .querySelector("[ct_timer-ml]")
      .getAttribute("ct_timer-ml");
    let mr = parentDiv
      .querySelector("[ct_timer-mr]")
      .getAttribute("ct_timer-mr");
    let sl = parentDiv
      .querySelector("[ct_timer-sl]")
      .getAttribute("ct_timer-sl");
    let sr = parentDiv
      .querySelector("[ct_timer-sr]")
      .getAttribute("ct_timer-sr");
    let dialogMinutes = ml + mr;
    let dialogSeconds = sl + sr;
    let doorDiscountFirstElem;
    let doorDiscountSecondElem;
    let doorDiscountWinElem;
    let giftContainer;
    if (document.querySelector("#giftBoxes")) {
      giftContainer = document.querySelector("#giftBoxes");
      if (
        giftContainer.getAttribute("doordiscountfirst") &&
        giftContainer.getAttribute("doordiscountsecond") &&
        giftContainer.getAttribute("doordiscountwin")
      ) {
        doorDiscountFirstElem = giftContainer.getAttribute("doordiscountfirst");
        doorDiscountSecondElem = giftContainer.getAttribute(
          "doordiscountsecond"
        );
        doorDiscountWinElem = giftContainer.getAttribute("doordiscountwin");
      }
    }
    const startTimer = () => {
      if (dialogSeconds == 0) {
        if (dialogMinutes == 0) {
          return;
        }
        dialogMinutes--;
        if (dialogMinutes < 10) dialogMinutes = "0" + dialogMinutes;
        dialogSeconds = 59;
      } else dialogSeconds--;
      if (dialogSeconds < 10) dialogSeconds = "0" + dialogSeconds;
      dialogMinutes = dialogMinutes + "";
      dialogSeconds = dialogSeconds + "";
      setTimeout(startTimer, 1000);
      let timerFind = parentDiv.querySelectorAll("[ct_dataTimer]");
      timerFind.forEach(e => {
        if (e.classList.contains("minutesLeft")) {
          e.innerText = dialogMinutes.charAt(0);
        }
        if (e.classList.contains("minutesRight")) {
          e.innerText = dialogMinutes.charAt(1);
        }
        if (e.classList.contains("secondsLeft")) {
          e.innerText = dialogSeconds.charAt(0);
        }
        if (e.classList.contains("secondsRight")) {
          e.innerText = dialogSeconds.charAt(1);
        }
      });
    };
    docInfoPopUp.classList.remove(
      "winPopupBgDocInfoDoorsShow",
      "winPopupBgDocInfoDoorsEdit"
    );
    docInfoDoorsForm.classList.remove("docInfoDoorsFormShow");

    docInfoDoors.forEach(door => {
      door.addEventListener("click", docInfoOpenDoor);
    });

    function docInfoOpenDoor(event) {
      event.currentTarget.classList.add("docInfoDoors__doorsImage--open");

      setTimeout(() => {
        docInfoDoors.forEach(prize => {
          prize.classList.add("docInfoDoors__doorsImage--open");
        });
      }, 2000);

      setTimeout(() => {
        docInfoPopUp.classList.add("winPopupBgDocInfoDoorsShow");
      }, 4500);

      setTimeout(() => {
        docInfoDoorsWrapper.classList.add("docInfoDoors__wrapper--hide");
        docInfoDoorsForm.classList.add("docInfoDoorsFormShow");
        startTimer();
        docInfoDoors.forEach(prize => {
          prize.classList.remove("docInfoDoors__doorsImage--open");
        });
      }, 5000);

      docInfoPopUpClose.addEventListener("click", () => {
        docInfoPopUp.classList.remove("winPopupBgDocInfoDoorsShow");
      });

      docInfoPopUpOk.addEventListener("click", () => {
        docInfoPopUp.classList.remove("winPopupBgDocInfoDoorsShow");
        docInfoDoorsForm.scrollIntoView({
          block: "center",
          behavior: "smooth"
        });
      });
      if (doorDiscountWinElem) {
        docInfoDoors.forEach(door => {
          if (
            door.matches(
              ".docInfoDoors__doorsImageFirst.docInfoDoors__doorsImage--open"
            )
          ) {
            document.querySelector(
              ".docInfoDoors__prizeFirst"
            ).innerHTML = doorDiscountWinElem;
            document.querySelector(
              ".docInfoDoors__prizeSecond"
            ).innerHTML = doorDiscountSecondElem;
            document.querySelector(
              ".docInfoDoors__prizeThird"
            ).innerHTML = doorDiscountFirstElem;
          } else if (
            door.matches(
              ".docInfoDoors__doorsImageSecond.docInfoDoors__doorsImage--open"
            )
          ) {
            document.querySelector(
              ".docInfoDoors__prizeFirst"
            ).innerHTML = doorDiscountSecondElem;
            document.querySelector(
              ".docInfoDoors__prizeSecond"
            ).innerHTML = doorDiscountWinElem;
            document.querySelector(
              ".docInfoDoors__prizeThird"
            ).innerHTML = doorDiscountFirstElem;
          } else if (
            door.matches(
              ".docInfoDoors__doorsImageThird.docInfoDoors__doorsImage--open"
            )
          ) {
            document.querySelector(
              ".docInfoDoors__prizeFirst"
            ).innerHTML = doorDiscountFirstElem;
            document.querySelector(
              ".docInfoDoors__prizeSecond"
            ).innerHTML = doorDiscountSecondElem;
            document.querySelector(
              ".docInfoDoors__prizeThird"
            ).innerHTML = doorDiscountWinElem;
          }
        });
      } else {
        docInfoDoors.forEach(door => {
          if (
            door.matches(
              ".docInfoDoors__doorsImageFirst.docInfoDoors__doorsImage--open"
            )
          ) {
            document.querySelector(".docInfoDoors__prizeFirst").innerHTML =
              "100%";
            document.querySelector(".docInfoDoors__prizeSecond").innerHTML =
              "50%";
            document.querySelector(".docInfoDoors__prizeThird").innerHTML =
              "25%";
          } else if (
            door.matches(
              ".docInfoDoors__doorsImageSecond.docInfoDoors__doorsImage--open"
            )
          ) {
            document.querySelector(".docInfoDoors__prizeFirst").innerHTML =
              "50%";
            document.querySelector(".docInfoDoors__prizeSecond").innerHTML =
              "100%";
            document.querySelector(".docInfoDoors__prizeThird").innerHTML =
              "25%";
          } else if (
            door.matches(
              ".docInfoDoors__doorsImageThird.docInfoDoors__doorsImage--open"
            )
          ) {
            document.querySelector(".docInfoDoors__prizeFirst").innerHTML =
              "25%";
            document.querySelector(".docInfoDoors__prizeSecond").innerHTML =
              "50%";
            document.querySelector(".docInfoDoors__prizeThird").innerHTML =
              "100%";
          }
        });
      }

      docInfoDoors.forEach(door => {
        door.removeEventListener("click", docInfoOpenDoor);
      });
    }
  })();
});
