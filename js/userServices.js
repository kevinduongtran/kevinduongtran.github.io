import Utils from './utils.js';

export class UserServices {
  self = this;
  rootApp;
  currentUser;
  userInSquad = false;

  loginModalElement = document.getElementById('exampleModal');
  userNameInput = document.getElementById('validationCustomUsername');
  loginModal = new bootstrap.Modal(this.loginModalElement);
  usernameDisplay = document.getElementById('username-display');
  disconnectButton = document.getElementById('disconnect-button');

  constructor(_app) {
    this.rootApp = _app;
    console.log('Init UserServices');

    this.AddEventListeners();
    this.LoadUser();
  }

  AddEventListeners() {
    this.loginModalElement.addEventListener('hide.bs.modal', () => {
      this.OnLoginModalClose(this.userNameInput.value);
    });

    this.disconnectButton.addEventListener('click', () => {
      this.Disconnect();
    });

    window.addEventListener(
      'load',
      function () {
        // Fetch all the forms we want to apply custom Bootstrap validation styles to
        var forms = document.getElementsByClassName('needs-validation');
        // Loop over them and prevent submission
        Array.prototype.filter.call(forms, function (form) {
          form.addEventListener(
            'submit',
            function (event) {
              if (form.checkValidity() === false) {
                event.preventDefault();
                event.stopPropagation();
              } else {
                document.getElementById('close-modal-button').click();
              }
              form.classList.add('was-validated');
              event.preventDefault();
              event.stopPropagation();
              if (userNameInput.value !== '') this.UpdateUsername(userNameInput.value);
            },
            false
          );
        });
      },
      false
    );
  }

  OnLoginModalClose(username) {
    let currentSessionId = this.currentUser?.sessionId;
    this.currentUser = { sessionId: currentSessionId ? currentSessionId : Utils.uuidv4(), username: username };
    this.usernameDisplay.innerHTML = username;
    localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
  }

  async Disconnect() {
    let playerPath = this.GetPlayerPath(this.rootApp.data);
    if (playerPath) await this.rootApp.firebaseService.SetValue(playerPath, null);
  }

  async UpdateUsername(username) {
    usernameDisplay.innerHTML = username;
    this.username = username;

    const updates = {};

    let data = await this.firebaseService.GetValue('rooms/0');

    for (const [t, team] of data.teams.entries()) {
      for (const [s, squad] of team.squads.entries()) {
        if (squad.players) {
          let p = squad.players.findIndex((player) => player.sessionId == this.userService.currentUser.sessionId);
          if (p >= 0) {
            console.log('player found', p);
            let player = squad.players[p];
            console.log(p, player);
            player.username = username;
            updates[`rooms/0/teams/${t}/squads/${s}/players/${p}`] = player;
          }
        }
      }
    }

    await this.firebaseService.UpdateValues(updates);
  }

  GetPlayerPath(data) {
    for (const [t, team] of data.teams.entries()) {
      for (const [s, squad] of team.squads.entries()) {
        if (squad.players) {
          let p = squad.players.findIndex((player) => player.sessionId == this.currentUser.sessionId);
          if (p >= 0) {
            // remove player from old squad
            return `rooms/0/teams/${t}/squads/${s}/players/${p}`;
          }
        }
      }
    }
    return undefined;
  }

  LoadUser() {
    this.currentUser = this.GetCachedUser();
    if (this.currentUser) {
      this.usernameDisplay.innerHTML = this.currentUser.username;
    } else {
      this.loginModal.show();
    }
  }

  GetCachedUser() {
    return JSON.parse(localStorage.getItem('currentUser'));
  }
}
