export default class Alarm extends HTMLElement {
  #intervalCallback;
  #intervalId = 0;
  #alarmSound;

  constructor() {
    super();
    this.addEventListener("click", this);
    this.duration = 60 * 1000;
    this.#alarmSound = new Audio('media/alarm.mp3');
    this.#intervalCallback = () => {
      this.alarms.forEach((alarm) => {
        const { value } = alarm.querySelector("input");
        const date =
          new Date(value).getTime() ||
          new Date(`${new Date().toLocaleDateString()} ${value}`).getTime();
          console.log("Parsed date:", date);
          if (date) {
            console.log("Llega");
            const delta = Date.now() - date;
          if (delta > 0 && delta < new Date(this.duration)) {
            alarm.setAttribute("ringing", "");
            this.dispatchEvent(
              new CustomEvent("ring", { bubbles: true, detail: alarm })
            );
            this.#alarmSound.currentTime = 0;
            this.#alarmSound.play().catch((err) => console.warn("Error al reproducir el audio:", err));
            this.#alarmSound.volume = 0.9; 
            return;
          }
        }

        alarm.removeAttribute("ringing");
      });
    };
  }

  get alarms() {
    return [...this.querySelector(".items").children];
  }

  get duration() {
    return Number(this.getAttribute("duration"));
  }

  set duration(value) {
    this.setAttribute("duration", value);
  }

  add() {
    const alarm = this.querySelector("template").content.cloneNode(true);
    this.querySelector(".items").appendChild(alarm);
  }

  connectedCallback() {
    if (!this.#intervalId) {
      this.#intervalId = setInterval(this.#intervalCallback, 1000);
    }
  }

  delete(alarm) {
    this.querySelector(".items").removeChild(alarm);
  }

  disconnectedCallback() {
    clearInterval(this.#intervalId);
  }

  handleEvent(event) {
    const { target } = event;
    const { classList } = target;
    if (classList.contains("add")) {
      this.add();
    } else if (classList.contains("delete")) {
      this.delete(this.alarms.find((alarm) => alarm.contains(target)));
    } else if (classList.contains("pause")) {
      this.pause(this.alarms.find((alarm) => alarm.contains(target)));
      //el backgound color del boton start cambia a gris
    } else if (classList.contains("start")) {
      this.start(this.alarms.find((alarm) => alarm.contains(target)));
      //el backgound color del boton start cambia a azul
      this.#alarmSound.currentTime = 0;
      this.#alarmSound.play().catch((err) => console.warn("Error al reproducir el audio:", err));
      this.#alarmSound.volume = 0.9;
    }
  }

  pause(alarm) {
    if (this.alarms.includes(alarm)) {
      alarm.setAttribute("paused", "");
    }
  }

  start(alarm) {
    if (this.alarms.includes(alarm)) {
      alarm.removeAttribute("paused");
    }
  }
}