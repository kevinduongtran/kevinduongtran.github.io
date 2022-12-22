import AppOptions from './config.js';
import { FirebaseServices } from './firebaseServices.js';
import { LocationServices } from './locationServices.js';
import { UserServices } from './userServices.js';
import Utils from './utils.js';

let App = class {
  locationService;
  userService;
  firebaseService;
  data;
  username;
  currentUser;

  constructor() {
    self = this;
    this.locationService = new LocationServices();
    this.firebaseService = new FirebaseServices();
    this.userService = new UserServices(this);

    this.firebaseService.Subscribe(this.OnData);

    this.Update();
  }

  async OnData(snap) {
    self.data = snap;
    document.querySelectorAll(`.from-template`).forEach((el) => el.remove());
    self.data.teams.forEach((team, t) => {
      let teamTemplate = 'team-template';
      let teamContainer = 'teams-container';
      let teamReplacements = { teamName: team.teamName, teamId: team.id };

      Utils.FillTemplate(teamTemplate, teamContainer, teamReplacements);
      team.squads.forEach((squad, s) => {
        let squadTemplate = `squad-template-${team.id}`;
        let squadTemplateContainer = `squad-container-${team.id}`;
        let squadReplacements = { squadId: squad.id, squadNumber: squad.squadNumber };

        Utils.FillTemplate(squadTemplate, squadTemplateContainer, squadReplacements);
        document.getElementById(`squad-${squad.id}`).addEventListener('click', () => {
          self.JoinSquad(team.id, squad.id);
        });
        if (squad.players != null) {
          squad.players.forEach((player, p) => {
            let squadMemberTemplate = `squad-member-template-${squad.id}`;
            let squadContainerTemplate = `squad-member-container-${squad.id}`;
            let squadMemberReplacements = { username: player.username, squadLeaderTag: p == 0 ? `<i class="bi bi-star-fill me-1"></i>` : `<i class="bi me-4"></i>` };

            Utils.FillTemplate(squadMemberTemplate, squadContainerTemplate, squadMemberReplacements);
          });
        }
      });
    });
    self.userInSquad = self.userService.GetPlayerPath(self.data) != undefined;
    if (self.userInSquad) await self.UpdateUserLocation();
  }

  async JoinSquad(teamId, squadId) {
    let newTeamIndex, newSquadIndex;
    let updates = {};

    let root = this.data.teams;

    // get index of teamId and squad id
    newTeamIndex = root.findIndex((el) => el.id == teamId).toString();
    newSquadIndex = root[newTeamIndex].squads.findIndex((el) => el.id == squadId).toString();

    // get list of players in squad
    let playersInNewSquad = root[newTeamIndex].squads[newSquadIndex].players;

    // check if player alreay in squad
    if (playersInNewSquad != undefined && playersInNewSquad.some((player) => player.sessionId == this.userService.currentUser.sessionId)) {
      console.log('player already in squad');
      return;
    }

    let playerPath = this.userService.GetPlayerPath(this.data);

    if (playerPath) {
      updates[playerPath] = null;
    }

    // define a player object
    let currentPlayer = { username: this.userService.currentUser.username, sessionId: this.userService.currentUser.sessionId };

    // if there are no players in squad, just add the player as a squad leader
    // otherwise, append player to list
    if (playersInNewSquad == null) {
      updates[`rooms/0/teams/${newTeamIndex}/squads/${newSquadIndex}/players`] = [currentPlayer];
    } else {
      playersInNewSquad.push(currentPlayer);
      updates[`rooms/0/teams/${newTeamIndex}/squads/${newSquadIndex}/players/`] = playersInNewSquad;
    }

    await this.firebaseService.UpdateValues(updates);
    await this.AssignSquadLeaders();
    await this.UpdateUserLocation();
    this.userService.userInSquad = true;
  }

  Update() {
    if (this.userInSquad) this.UpdateUserLocation();
    setTimeout(() => this.Update(), AppOptions.tickRateMS);
  }

  async UpdateUserLocation() {
    let location = await this.locationService.GetLocation();

    // if currext user exists
    if (this.userService.currentUser) {
      console.log('ping', location);
      //add location to user object
      this.userService.currentUser.location = {
        lat: location.coords.latitude,
        long: location.coords.longitude,
      };

      const updates = {};
      let playerPath = this.userService.GetPlayerPath(this.data);
      if (playerPath) {
        updates[playerPath] = this.userService.currentUser;
      }
      await this.firebaseService.UpdateValues(updates);
      // this.userService.UpdateUser(this.userService.currentUser);

      // update user on firebase
      // this.firebaseService.UpdateUser(this.userService.currentUser.uuid, this.userService.currentUser);
      // this.userService.CacheUser();
      // self.DisplayUser();
    }
  }

  async AssignSquadLeaders() {
    let data = await this.firebaseService.GetValue('rooms/0');

    for (let t = 0; t < data.teams.length; t++) {
      const team = data.teams[t];
      for (let s = 0; s < team.squads.length; s++) {
        let players = data.teams[t].squads[s].players;
        if (players) {
          players = players.filter(function () {
            return true;
          });
          data.teams[t].squads[s].players = players;
        }
      }
    }
    await this.firebaseService.SetValue('rooms/0', data);
  }
};

const app = new App();

let resetDBButton = document.getElementById('resetDB');
if (resetDBButton)
  resetDBButton.addEventListener('click', () => {
    app.firebaseService.SetValue('/', {
      rooms: [
        {
          gamemode: 'TDM',
          roomId: 'ea3f1eaf-f712-44eb-bd47-a2e783df974e',
          roomName: 'Cement Factory',
          teams: [
            {
              id: 'efdcb41b-15ba-4b6a-8833-8eafe744e770',
              squads: [
                {
                  id: '8fa53299-5b1e-4e34-a679-37b8c1b72124',
                  squadNumber: 1,
                },
                {
                  id: '514a5efc-149f-4d71-bbd1-9534d0bb6518',
                  squadNumber: 2,
                },
                {
                  id: '35633482-b82a-4852-a66e-697d82bd3121',
                  squadNumber: 3,
                },
              ],
              teamName: 'BLUFOR',
            },
            {
              id: 'opfor123',
              squads: [
                {
                  id: '17cf4d12-3115-4a44-9964-c5c4f3ee49f5',
                  squadNumber: 1,
                },
                {
                  id: 'cb64b16a-93c5-406e-83d7-a1d576b26c70',
                  squadNumber: 2,
                },
                {
                  id: '2fd3ad96-3dc4-4f12-b728-48f4f7389ba2',
                  squadNumber: 3,
                },
              ],
              teamName: 'OPFOR',
            },
          ],
        },
      ],
    });
  });
