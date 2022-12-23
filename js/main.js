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
  initChecked = false;

  constructor() {
    Utils.InitLogs();

    self = this;
    this.locationService = new LocationServices(this);
    this.firebaseService = new FirebaseServices();
    this.userService = new UserServices(this);

    this.firebaseService.Subscribe(this.OnData);
    this.locationService.ScanLocation(false);

    this.Update();
  }

  async OnData(snap) {
    try {
      self.data = snap;

      self.UpdateMap();
      self.RenderTemplates();
      if (!self.initChecked) {
        self.initChecked = true;
        self.InitialDataCheck();
      }
    } catch (err) {
      Utils.error(err);
    }
  }

  InitialDataCheck() {
    this.CheckIfInSquad();
  }

  Update() {
    try {
      this.locationService.ScanLocation(false);
      if (this.userInSquad) this.UpdateUserLocation();

      setTimeout(() => this.Update(), AppOptions.tickRateMS);
    } catch (err) {
      Utils.error(err);
    }
  }

  RenderTemplates() {
    try {
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
    } catch (err) {
      Utils.error(err);
    }
  }

  UpdateMap() {
    try {
      let lat = this.data.map.location.lat;
      let long = this.data.map.location.long;
      let zoom = this.data.map.zoom;
      // this.locationService.UpdateMap(lat, long, zoom);

      let players = [];
      let markerData = [];
      // get all players and their markers

      let currentTeam, currentSquad;
      for (const [t, team] of this.data.teams.entries()) {
        for (const [s, squad] of team.squads.entries()) {
          if (squad.players) {
            for (const [p, player] of squad.players.entries()) {
              if (player.sessionId == this.userService.currentUser.sessionId) {
                currentTeam = t;
                currentSquad = s;
              }
            }
          }
        }
      }

      for (const [t, team] of this.data.teams.entries()) {
        for (const [s, squad] of team.squads.entries()) {
          if (squad.players) {
            for (const [p, player] of squad.players.entries()) {
              // all players
              let isTeamMember = t == currentTeam;
              let isSquadMember = s == currentSquad;
              let isSquadLeader = p == 0;
              let isMe = player.sessionId == this.userService.currentUser.sessionId;

              player['squadNumber'] = s;
              if (isTeamMember) player['iconType'] = 'team-member';
              if (isSquadMember) player['iconType'] = 'squad-member';
              if (isSquadLeader) player['iconType'] = 'squad-leader';
              if (isSquadLeader && isSquadMember) player['iconType'] = 'they-squad-leader';
              if (isSquadLeader && isMe) player['iconType'] = 'me-squad-leader';
              if (isMe) player['iconType'] = 'me';

              players.push(player);
            }
          }
        }
      }
      players.forEach((player) => {
        if (player.location) {
          markerData.push({
            squadNumber: player.squadNumber + 1,
            iconType: player.iconType,
            lat: player.location.lat,
            long: player.location.long,
            id: player.location.id,
          });
        }
      });
      this.locationService.UpdateMarkers(markerData);
    } catch (err) {
      Utils.error(err);
    }
  }

  async CheckIfInSquad() {
    try {
      let path = this.userService.GetPlayerPath(this.data);
      this.userInSquad = path != undefined;
      if (this.userInSquad) await this.UpdateUserLocation();
    } catch (err) {
      Utils.error(err);
    }
  }

  async JoinSquad(teamId, squadId) {
    try {
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
        return;
      }

      let playerPath = this.userService.GetPlayerPath(this.data);

      if (playerPath) {
        updates[playerPath] = null;
      }

      // define a player object
      let currentPlayer = {
        username: this.userService.currentUser.username,
        sessionId: this.userService.currentUser.sessionId,
        location: this.userService.currentUser.location,
      };
      console.log(currentPlayer);

      // if there are no players in squad, just add the player as a squad leader
      // otherwise, append player to list
      if (playersInNewSquad == null) {
        updates[`rooms/0/teams/${newTeamIndex}/squads/${newSquadIndex}/players`] = [currentPlayer];
      } else {
        playersInNewSquad.push(currentPlayer);
        updates[`rooms/0/teams/${newTeamIndex}/squads/${newSquadIndex}/players/`] = playersInNewSquad;
      }

      // await this.UpdateUserLocation();
      await this.firebaseService.UpdateValues(updates);
      await this.AssignSquadLeaders();
      this.userService.userInSquad = true;
    } catch (err) {
      Utils.error(err);
    }
  }

  lastCoord = {
    lat: 0,
    long: 0,
  };
  async UpdateUserLocation() {
    try {
      // load location into location service
      let coords = { id: Utils.uuidv4() };
      coords = { ...coords, ...this.locationService.coords };

      let shouldUpdate = Utils.distance(coords.lat, coords.long, this.lastCoord.lat, this.lastCoord.long) > AppOptions.updateMeters;

      if (shouldUpdate) {
        // if currext user exists
        if (this.userService.currentUser) {
          //add location to user object
          this.userService.currentUser.location = coords;

          // update user with new coords
          const updates = {};
          let playerPath = this.userService.GetPlayerPath(this.data);
          if (playerPath) {
            updates[playerPath] = this.userService.currentUser;
          }
          await this.firebaseService.UpdateValues(updates);
        }
      }

      this.lastCoord = coords;
    } catch (err) {
      Utils.error(err);
    }
  }

  async AssignSquadLeaders() {
    try {
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
    } catch (err) {
      Utils.error(err);
    }
  }
};

const app = new App();

let resetDBButton = document.getElementById('reset-db-button');
if (resetDBButton)
  resetDBButton.addEventListener('click', () => {
    app.firebaseService.SetValue('/', {
      rooms: [
        {
          gamemode: 'TDM',
          roomId: 'ea3f1eaf-f712-44eb-bd47-a2e783df974e',
          roomName: 'Cement Factory',
          map: {
            name: 'LVPP',
            location: {
              lat: 36.1390106,
              long: -115.1765157,
            },
            zoom: 10,
          },
          teams: [
            {
              id: 'efdcb41b-15ba-4b6a-8833-8eafe744e770',
              squads: [
                {
                  id: '8fa53299-5b1e-4e34-a679-37b8c1b72124',
                  players: [],
                  squadNumber: 1,
                },
                {
                  id: '514a5efc-149f-4d71-bbd1-9534d0bb6518',
                  players: [],
                  squadNumber: 2,
                },
                {
                  id: '35633482-b82a-4852-a66e-697d82bd3121',
                  players: [],
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
                  players: [],
                  squadNumber: 1,
                },
                {
                  id: 'cb64b16a-93c5-406e-83d7-a1d576b26c70',
                  players: [],
                  squadNumber: 2,
                },
                {
                  id: '2fd3ad96-3dc4-4f12-b728-48f4f7389ba2',
                  players: [],
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
