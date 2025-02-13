import Alarm from "./Alarm.js";
import Clock from "./Clock.js";
import Stopwatch from "./Stopwatch.js";
import Timer from "./Timer.js";

customElements.define("x-alarm", Alarm);
customElements.define("x-clock", Clock);
customElements.define("x-stopwatch", Stopwatch);
customElements.define("x-timer", Timer);

document.querySelector("x-timer").addEventListener("stop", ({ target }) => {
  target.paused = true;
});

document.querySelector("x-alarm").addEventListener("stop", ({ target }) => {
  target.alarms.forEach((alarm) => alarm.setAttribute("paused", ""));
});
