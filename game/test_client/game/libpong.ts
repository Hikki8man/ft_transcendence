import 'phaser';
import Pong from './scenes/Pong';
import Lobby from './scenes/Lobby';
import { NewGameData, PlayersGameData } from './types/shared.types';
import { io, Socket } from 'socket.io-client';


// export function admin_login(): void
// {
// 	const sock: Socket = io('http://localhost:6161');
// 	sock.emit('admin_authenticate', 'paclarushtaonas');

// 	sock.on('admin_connection',function(data){
// 		console.log('server reponse: admin_conenction:', data);
// 	});
// }

export function admin_new_game(player_A: string, player_B: string): NewGameData | void
{
	const sock: Socket = io('http://localhost:6161');
	//let gamedata: NewGameData;
//get admin secret from env
	sock.emit('admin_authenticate', 'praclarushtaonas');

	sock.on('admin_connection',function(data: boolean){
		console.log('server reponse: admin_conenction:', data);
	});

	console.log('requesting new game for', player_A, player_B);
	sock.emit('admin_newgame', {player_A: player_A, player_B: player_B});

	sock.on('new_game_data',function(data:NewGameData){
		console.log('server reponse: new_game_data:', data);
		//gamedata = data;
		sock.disconnect();
		return data;
	});
	//sock.disconnect();
}

export function launch_game(players_data: PlayersGameData): void
{
	const config = {
		type: Phaser.AUTO,
		parent: 'game_anchor',
		backgroundColor: '#FFFFFF',
		width: 800,
		height: 600,
		callbacks: {
			preBoot: function (game) {
				game.registry.set('players_data', players_data);
			}
		  },
		scene: [ Lobby, Pong ]
	};
	const game = new Phaser.Game(config);
}
