interface Team {
   id: number;
   team_name: string;
}

interface Obstacles {
   id: number;
   obstacle_name: string;
   score: number;
   round: number;
   active_comparison : string;
}

interface LoginCode {
   code: string;
}

export const teams : Team[] = [
   { id: 1, team_name: 'RCL' },
   { id: 2, team_name: 'SoloBot' },
   { id: 3, team_name: 'Wildfire FPV' },
   { id: 4, team_name: 'CAM BOT' },
   { id: 5, team_name: 'CheeseCake' },
   { id: 6, team_name: 'Mini Quads I' },
   { id: 7, team_name: 'Alphaflight' },
   { id: 8, team_name: 'StonerFPV' },
   { id: 9, team_name: 'Mini Quads II' },
   {id: 10, team_name: 'Leng FPV'}
];
 
export const obstacles_round_1_red : Obstacles[] = [
   {id: 1, obstacle_name: 'Obstacle 1', active_comparison: 'obstacle 1 red', score: 3, round: 1},
   {id: 2, obstacle_name: 'Obstacle 2', active_comparison: 'obstacle 2 red', score: 3, round: 1},
   {id: 3, obstacle_name: 'Obstacle 3', active_comparison: 'obstacle 3 red', score: 3, round: 1},
   {id: 4, obstacle_name: 'Obstacle 4', active_comparison: 'obstacle 4 red', score: 8, round: 1},
   {id: 5, obstacle_name: 'Obstacle 5', active_comparison: 'obstacle 5 red', score: 6, round: 1},
   {id: 6, obstacle_name: 'Obstacle 6', active_comparison: 'obstacle 6 red', score: 6, round: 1},
   {id: 7, obstacle_name: 'Obstacle 7', active_comparison: 'obstacle 7 red', score: 10, round: 1},
   {id: 8, obstacle_name: 'Obstacle 8', active_comparison: 'obstacle 8 red', score: 2, round: 1}
];

export const obstacles_round_2_red : Obstacles[] = [
   {id: 1, obstacle_name: 'Obstacle 1', active_comparison: 'obstacle 1 red', score: 3, round: 2},
   {id: 2, obstacle_name: 'Obstacle 2', active_comparison: 'obstacle 2 red', score: 3, round: 2},
   {id: 3, obstacle_name: 'Obstacle 3', active_comparison: 'obstacle 3 red', score: 3, round: 2},
   {id: 4, obstacle_name: 'Obstacle 4', active_comparison: 'obstacle 4 red', score: 8, round: 2},
   {id: 5, obstacle_name: 'Obstacle 5', active_comparison: 'obstacle 5 red', score: 6, round: 2},
   {id: 6, obstacle_name: 'Obstacle 6', active_comparison: 'obstacle 6 red', score: 6, round: 2},
   {id: 7, obstacle_name: 'Obstacle 7', active_comparison: 'obstacle 7 red', score: 10, round: 2},
   {id: 8, obstacle_name: 'Obstacle 8', active_comparison: 'obstacle 8 red', score: 2, round: 2}
];

export const obstacles_round_1_blue : Obstacles[] = [
   {id: 1, obstacle_name: 'Obstacle 1', active_comparison: 'obstacle 1 blue', score: 3, round: 1},
   {id: 2, obstacle_name: 'Obstacle 2', active_comparison: 'obstacle 2 blue', score: 3, round: 1},
   {id: 3, obstacle_name: 'Obstacle 3', active_comparison: 'obstacle 3 blue', score: 3, round: 1},
   {id: 4, obstacle_name: 'Obstacle 4', active_comparison: 'obstacle 4 blue', score: 8, round: 1},
   {id: 5, obstacle_name: 'Obstacle 5', active_comparison: 'obstacle 5 blue', score: 6, round: 1},
   {id: 6, obstacle_name: 'Obstacle 6', active_comparison: 'obstacle 6 blue', score: 6, round: 1},
   {id: 7, obstacle_name: 'Obstacle 7', active_comparison: 'obstacle 7 blue', score: 10, round: 1},
   {id: 8, obstacle_name: 'Obstacle 8', active_comparison: 'obstacle 8 blue', score: 2, round: 1}
];

export const obstacles_round_2_blue : Obstacles[] = [
   {id: 1, obstacle_name: 'Obstacle 1', active_comparison: 'obstacle 1 blue', score: 3, round: 2},
   {id: 2, obstacle_name: 'Obstacle 2', active_comparison: 'obstacle 2 blue', score: 3, round: 2},
   {id: 3, obstacle_name: 'Obstacle 3', active_comparison: 'obstacle 3 blue', score: 3, round: 2},
   {id: 4, obstacle_name: 'Obstacle 4', active_comparison: 'obstacle 4 blue', score: 8, round: 2},
   {id: 5, obstacle_name: 'Obstacle 5', active_comparison: 'obstacle 5 blue', score: 6, round: 2},
   {id: 6, obstacle_name: 'Obstacle 6', active_comparison: 'obstacle 6 blue', score: 6, round: 2},
   {id: 7, obstacle_name: 'Obstacle 7', active_comparison: 'obstacle 7 blue', score: 10, round: 2},
   {id: 8, obstacle_name: 'Obstacle 8', active_comparison: 'obstacle 8 blue', score: 2, round: 2}
];

