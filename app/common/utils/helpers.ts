import { SeasonMatchParticipant } from "@routes/matches/interfaces/matches.interface";
import { SeasonPlayer } from "@routes/seasons/interfaces/season-players.interface";
import { SeasonTeamsService } from "@routes/seasons/services/season-teams.service";
import { TeamDivisionsService } from "@routes/teams/services/team-divisions.service";
import { TeamsService } from "@routes/teams/services/teams.service";
import _ from "underscore";

export const ROLES = ['CREATOR_ROLE', 'CASTER_ROLE'];
export const ROLES_STAFF = ['MANAGER_ROLE', 'COACH_ROLE', 'ANALYST_ROLE', 'CAPTAIN_ROLE', 'CEO_ROLE'];
export const ROLES_ORGANIZER = ['ORGANIZER_ROLE', 'ORGANIZER_EDITOR_ROLE', 'ORGANIZER_MODERATOR_ROLE', 'EDITOR_ROLE', 'MODERATOR_ROLE'];

export const myCustomLabels = {
  docs: 'items',
  totalDocs: 'totalItems',
};

export const imageFilter = function (req: any, file: any, cb: any) {
  let validExtensions = ['png', 'jpg', 'jpeg'];

  if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error(`Las extensiones permitidas son: ${validExtensions.join(', ')}`), false);
  }
  cb(null, true);
};

export const getValidUrl = (url: string): string => {
  const newUrl = url.trim().replace(/\s/g, "");

  if (!newUrl) {
    return '';
  }

  if(/^(:\/\/)/.test(newUrl)){
      return `https${newUrl}`;
  }
  if(!/^(f|ht)tps?:\/\//i.test(newUrl)){
      return `https://${newUrl}`;
  }

  return newUrl;
};

export const mergeLists = (a: any, b: any, idField: any) => {
  var indexA = _.indexBy(a, idField)
  var indexB = _.indexBy(b, idField);

  return _.map(indexA, function(obj, key) {
    return _.extend(obj, indexB[key]);
  });
}

export const createNullArray = (len: any, itm: any) => {
  var arr1: any[] = [itm],
    arr2: any[] = [];
  while (len > 0) {
    if (len & 1) arr2 = arr2.concat(arr1);
    arr1 = arr1.concat(arr1);
    len >>>= 1;
  }
  return arr2;
}

export const stringToSlug = (text: string) => {
  text = text.replace(/^\s+|\s+$/g, ''); // trim
  text = text.toLowerCase();

  // remove accents, swap ñ for n, etc
  var from = "àáäâèéëêìíïîòóöôùúüûñç·/_,:;";
  var to = "aaaaeeeeiiiioooouuuunc------";
  for (var i = 0, l = from.length; i < l; i++) {
    text = text.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
  }

  text = text.replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');

  return text;
}

export const randomstring = (length: number) => {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for ( let i = 0; i < length; i++ ) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result.toLocaleUpperCase();
}

export const matchParticipant = (position: any) => {
  return {
    ...position.toJSON(),
    matchParticipant: {
      _id: position.participant.member._id,
      name: position.participant.member.inGameName,
      profilePic: position.participant.member.profilePic || 'https://cdn.arenaprogaming.com/uploads/5f2b07d6ca3ea3446c8bae5b-1619212805680.png'
    }
  }
}

export const noTeamResponse = (position: SeasonMatchParticipant) => {
  return {
    ...position.toJSON(),
    matchParticipant: {
      _id: null,
      teamID: null,
      name: 'Por determinar',
      profilePic: 'https://cdn.arenaprogaming.com/uploads/5dd0dcbc69225e21d8cd2ced-1596148434203.png',
      colors: {
        primary: '#25282a'
      }
    }
  }
}

export const teamNull = () => {
  return {
    _id: null,
    name: 'Por determinar',
    profilePic: 'https://cdn.arenaprogaming.com/uploads/5dd0dcbc69225e21d8cd2ced-1596148434203.png',
    colors: {
      primary: '#25282a'
    }
  }
}

export const noTeamStats = () => {
  return {
    _id: null,
    name: 'Por determinar',
    points: 0,
    place: 0,
    wins: 0,
    ties: 0,
    losts: 0,
    customStats: {
      setsDiff: 0,
      gamesDiff: 0,
    },
    profilePic: 'https://cdn.arenaprogaming.com/uploads/5dd0dcbc69225e21d8cd2ced-1596148434203.png',
  }
}

export const matchPlayer = (position: any, seasonPlayer: SeasonPlayer) => {
  if (!!position.participant) {
    return {
      ...position.toJSON(),
      matchParticipant: {
        _id: seasonPlayer._id,
        memberID: seasonPlayer.member._id,
        name: seasonPlayer.member.inGameName,
        inGameID: seasonPlayer.member.inGameID,
        profilePic: seasonPlayer.member.profilePic || 'https://cdn.arenaprogaming.com/uploads/5f2b07d6ca3ea3446c8bae5b-1619212805680.png',
        colors: seasonPlayer.member.colors
      }
    }
  } else {
    noTeamResponse(position);
  }
}

export const matchTeam = (position: SeasonMatchParticipant, team: any, seasonTeam: any, version: number, teamPlayers?: any) => {
  if (!!position.participant) {
    if (!team) {
      noTeamResponse(position);
    } else {
      if (version === 2) {
        const { parentTeam, name, logoUrl, colors } = team;
        return {
          ...position.toJSON(),
          matchParticipant: {
            _id: seasonTeam._id,
            teamID: team._id,
            name: name || parentTeam.name,
            profilePic: logoUrl || parentTeam.logoUrl || 'https://cdn.arenaprogaming.com/uploads/5dd0dcbc69225e21d8cd2ced-1596148434203.png',
            colors: colors || parentTeam.colors,
            stats: seasonTeam.stats,
            teamPlayers
          }
        }
      } else {
        return {
          ...position.toJSON(),
          matchParticipant: {
            _id: seasonTeam._id,
            teamID: team._id,
            name: team.name,
            profilePic: team.logoUrl || 'https://cdn.arenaprogaming.com/uploads/5dd0dcbc69225e21d8cd2ced-1596148434203.png',
            colors: team.colors
          }
        }
      }
    }
  } else {
    noTeamResponse(position);
  }
}

export const getTeamsFromRoom = async(participantIDs: string[], version: number) => {
  const seasonTeamsService = SeasonTeamsService.getInstance();
  const teamsService = TeamsService.getInstance();
  const teamDivisionsService = TeamDivisionsService.getInstance();

  return participantIDs.map(async(teamID) => {
    const seasonTeam = await seasonTeamsService.getById(teamID);
    if (!seasonTeam) {
      return {
        _id: null,
        name: 'Por determinar',
        profilePic: 'https://cdn.arenaprogaming.com/uploads/5dd0dcbc69225e21d8cd2ced-1596148434203.png',
        colors: {
          primary: '#25282a'
        }
      }
    } else {
      if (version === 2) {
        const teamDivision = await teamDivisionsService.getById(seasonTeam.teamID).populate('parentTeam');
        if (!teamDivision) {
          return {
            _id: null,
            name: 'Por determinar',
            profilePic: 'https://cdn.arenaprogaming.com/uploads/5dd0dcbc69225e21d8cd2ced-1596148434203.png',
            colors: {
              primary: '#25282a'
            }
          }
        }

        const { parentTeam, name, logoUrl, colors, _id } = teamDivision;

        return {
          _id: seasonTeam._id,
          teamID: _id,
          name: name || parentTeam.name,
          profilePic: logoUrl || parentTeam.logoUrl || 'https://cdn.arenaprogaming.com/uploads/5dd0dcbc69225e21d8cd2ced-1596148434203.png',
          colors: colors || parentTeam.colors
        }
      } else {
        const team = await teamsService.getById(seasonTeam.teamID);
        if (!team) {
          return {
            _id: null,
            name: 'Por determinar',
            profilePic: 'https://cdn.arenaprogaming.com/uploads/5dd0dcbc69225e21d8cd2ced-1596148434203.png',
            colors: {
              primary: '#25282a'
            }
          }
        }

        return {
          _id: seasonTeam._id,
          teamID: team._id,
          name: team.name,
          profilePic: team.logoUrl || 'https://cdn.arenaprogaming.com/uploads/5dd0dcbc69225e21d8cd2ced-1596148434203.png',
          colors: team.colors
        }
      }
    }
  })
}

export const nearestPow2 = (participantsNumber: number) => {
  return Math.pow(2, Math.ceil(Math.log(participantsNumber) / Math.log(2)));
}

export const getRoundsUpper = (totalParticipants: number) => {
  return (Math.ceil(Math.log(totalParticipants) / Math.log(2)));
}

export const getRoundsLower = (totalParticipants: number) => {
  return getRoundsUpper(totalParticipants) + (getRoundsUpper(totalParticipants) - 2);
}

export const changeIntoBye = (seed: number, participantsCount: number) => {
  return seed <= participantsCount ? seed : null;
}

export const getOrganizeSeeds = (participantsCount: number, rounds: number, seeds: any) => {
  if (participantsCount < 4) {
    return [];
  }

  let matches: any[][] = [
    [1, 2]
  ];

  for (let round = 1; round < rounds; round++) {
    let roundMatches = [];
    let sum = Math.pow(2, round + 1) + 1;

    for (let i = 0; i < matches.length; i++) {
      let home = changeIntoBye(matches[i][0], participantsCount);
      let away = changeIntoBye(sum - matches[i][0], participantsCount);
      roundMatches.push([home, away]);
      home = changeIntoBye(sum - matches[i][1], participantsCount);
      away = changeIntoBye(matches[i][1], participantsCount);
      roundMatches.push([home, away]);
    }
    matches = roundMatches;
  }

  const seedFlat = _.reduce(matches, function(a, b: any) { return a.concat(b); }, []);
  const flatIDs = seedFlat.map(seed => {

    const seedDB = {
      seed: !!seed ? seeds[seed - 1].seed : null,
      participant: !!seed ? seeds[seed - 1].participant : null
    }

    return seedDB;
  });

  return flatIDs;
}