const config = {
    type: Phaser.AUTO,
    width: 700,
    height: 400,
    
    physics: {
      default: "arcade",
      arcade: {
        gravity:{x:0},
        debug: false,
      },
    },
    scene: {
      preload: preload,
      create: create,
      update: update,
    },
  };

  const game = new Phaser.Game(config);
  let clockSound;

  let ball;
  let isSessionActive = false;

  function preload() {
    this.load.image("ball", "./ball2.png");
    this.load.audio("clock", "./click.wav");
  }

  function create() {
    ball = this.physics.add.sprite(300, 200, "ball");
    ball.setBounce(0);
    ball.setCollideWorldBounds(true);
    ball.setScale(0.6);
    
    ball.setVelocity(0, 0);

    clockSound = this.sound.add("clock");

  }

  function update() {
    if (isSessionActive) {
    }
    if (ball.x < 0 || ball.x > game.config.width) {
        ball.setVelocityX(-ball.body.velocity.x);
        clockSound.play();
    }
  }

  function moveBall() {
    if (isSessionActive) {
      ball.setVelocityY(200);
    }
  }

  const sessionList = [];

  function startSession() {
    if (isSessionActive) {
      console.log("Session already active");
      return;
    }

    isSessionActive = true;
    ball.setBounce(1)

    const sessionId = generateSessionId();
    const counter = Phaser.Math.Between(30, 60);
    const startTime = new Date();
    const endTime = new Date(startTime.getTime() + counter * 1000);

    startCountdownAndMove(counter, sessionId, startTime.toLocaleTimeString(), endTime.toLocaleTimeString());
  }

  function startCountdownAndMove(counter, sessionId, startTime, endTime) {
    let currentCounter = counter;

    const countdownInterval = setInterval(() => {
      document.getElementById(
        "counter-display"
      ).textContent = `Counter: ${currentCounter}s`;
      clockSound.play();

      if (currentCounter === 0) {
        clearInterval(countdownInterval);
        document.getElementById("counter-display").textContent =
          "Session Ended";
        isSessionActive = false;
        ball.setBounce(0)

        clockSound.stop();

        sessionList.push({ sessionId, startTime, endTime });
        updateSessionList();
      }

      currentCounter--;
    }, 1000);

    moveBall();
  }

  function generateSessionId() {
    return Math.random().toString(36).substring(7);
  }

  function updateSessionList() {
    const sessionListElement = document.getElementById("display");
    sessionListElement.innerHTML = "";

    sessionList.forEach((session) => {
      const listItem1 = document.createElement("p");
      const listItem2 = document.createElement("p");
      const listItem3 = document.createElement("p");
      listItem1.textContent = `Session ID: ${session.sessionId}`;
      listItem2.textContent = `Start Time: ${session.startTime}`;
      listItem3.textContent = `End Time: ${session.endTime}`;
      sessionListElement.appendChild(listItem1);
      sessionListElement.appendChild(listItem2);
      sessionListElement.appendChild(listItem3);
    });
  }