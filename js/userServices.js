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
    this.userNameInput = document.getElementById('validationCustomUsername');
    this.AddEventListeners();
    this.LoadUser();
  }

  AddEventListeners() {
    try {
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

                var input = document.getElementById('validationCustomUsername');
                console.log(self);
                if (input.value !== '') self.userService.UpdateUsername(input.value);
              },
              false
            );
          });
        },
        false
      );
    } catch (err) {
      Utils.error(err);
    }
  }

  OnLoginModalClose(username) {
    try {
      let currentSessionId = this.currentUser?.sessionId;
      this.currentUser = { sessionId: currentSessionId ? currentSessionId : Utils.uuidv4(), username: username };
      this.usernameDisplay.innerHTML = username;
      localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
    } catch (err) {
      Utils.error(err);
    }
  }

  async Disconnect() {
    try {
      let playerPath = this.GetPlayerPath(this.rootApp.data);
      if (playerPath) await this.rootApp.firebaseService.SetValue(playerPath, null);
    } catch (err) {
      Utils.error(err);
    }
  }

  async UpdateUsername(username) {
    try {
      this.usernameDisplay.innerHTML = username;
      this.username = username;

      const updates = {};

      let data = await this.rootApp.firebaseService.GetValue('rooms/0');

      for (const [t, team] of data.teams.entries()) {
        for (const [s, squad] of team.squads.entries()) {
          if (squad.players) {
            let p = squad.players.findIndex((player) => player.sessionId == this.currentUser.sessionId);
            if (p >= 0) {
              let player = squad.players[p];
              player.username = username;
              updates[`rooms/0/teams/${t}/squads/${s}/players/${p}`] = player;
            }
          }
        }
      }

      await this.rootApp.firebaseService.UpdateValues(updates);
    } catch (err) {
      Utils.error(err);
    }
  }

  GetPlayerPath(data) {
    try {
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
    } catch (err) {
      Utils.error(err);
    }
  }

  GetPlayerTeamID(data) {
    try {
      for (const [t, team] of data.teams.entries()) {
        for (const [s, squad] of team.squads.entries()) {
          if (squad.players) {
            for (const [p, player] of team.squads.entries()) {
              if (player.sessionId == this.currentUser.sessionId) {
                return team.id;
              }
            }
          }
        }
      }
      return undefined;
    } catch (err) {
      Utils.error(err);
    }
  }

  LoadUser() {
    try {
      this.currentUser = this.GetCachedUser();
      if (this.currentUser) {
        this.usernameDisplay.innerHTML = this.currentUser.username;
      } else {
        this.loginModal.show();
      }
    } catch (err) {
      Utils.error(err);
    }
  }

  GetCachedUser() {
    try {
      return JSON.parse(localStorage.getItem('currentUser'));
    } catch (err) {
      Utils.error(err);
    }
  }
}
