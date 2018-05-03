Engine.objects['catty/cattySTD'] = {
  "class": "UnitData",
  "anims": ["units/catty"],
  "forms": [
    {
      "hp": 100,
      "mass": 2,
      "cenX": 42,
      "cenY": 60,
      "width": 84,
      "height": 120,
      "damageX_reduct": 0.2,
      "min_damage": 38,
      "max_speedX": 32,
      "max_speedY": 50,
      "collision": 2,
      "coll_mask": 1,
      "friction": 1
    }
  ],
  "frames": [
    {
      "indx": "stand 0",
      "anims": [0,
    1,
    2,
    3,
    4,
    5],
      "next": 12,
      "count": 5
    },
    {
      "indx": "run 1",
      "anims": [0,
    1,
    2,
    3,
    4,
    5],
      "next": 5,
      "count": 1,
      "forceX": 10
    },
    {
      "indx": "fly 2",
      "anims": [0,
    1,
    2,
    3,
    4,
    5],
      "next": 2,
      "forceX": 1
    },
    {
      "indx": "attack 3",
      "anims": [0,
    1,
    2,
    3,
    4,
    5],
      "count": 10
    },
    {
      "anims": [0,
    1,
    2,
    3,
    4,
    5],
      "next": 3,
      "dmgRegs": [
        {
          "x": 40,
          "y": -80,
          "w": 60,
          "h": 80,
          "forceX": 200,
          "forceY": -6,
          "damage": -5,
          "mask": 1
        }
      ]
    },
    {
      "indx": "run 5",
      "anims": [10,
    11,
    18,
    3,
    4,
    24],
      "count": 1,
      "forceX": 10
    },
    {
      "anims": [12,
    13,
    19,
    3,
    4,
    25],
      "count": 1,
      "forceX": 10
    },
    {
      "anims": [10,
    11,
    18,
    3,
    4,
    24],
      "count": 1,
      "forceX": 10
    },
    {
      "anims": [0,
    1,
    2,
    3,
    4,
    5],
      "count": 1,
      "forceX": 10
    },
    {
      "anims": [6,
    7,
    23,
    3,
    4,
    29],
      "count": 1,
      "forceX": 10
    },
    {
      "anims": [8,
    9,
    22,
    3,
    4,
    28],
      "count": 1,
      "forceX": 10
    },
    {
      "anims": [6,
    7,
    23,
    3,
    4,
    29],
      "next": 1,
      "count": 1,
      "forceX": 10
    },
    {
      "indx": "stand 12",
      "anims": [0,
    1,
    14,
    3,
    4,
    15],
      "count": 5
    },
    {
      "anims": [0,
    1,
    16,
    3,
    4,
    17],
      "count": 5
    },
    {
      "anims": [0,
    1,
    14,
    3,
    4,
    15],
      "next": 0,
      "count": 5
    },
    {
      "indx": "up 15",
      "anims": [0,
    1,
    2,
    3,
    32,
    5],
      "count": 2
    },
    {
      "anims": [0,
    1,
    2,
    3,
    33,
    5],
      "next": 16,
      "count": 2
    },
    {
      "indx": "down 17",
      "anims": [0,
    1,
    2,
    3,
    30,
    5],
      "count": 2
    },
    {
      "anims": [0,
    1,
    2,
    3,
    31,
    5],
      "next": 18,
      "count": 2
    }
  ],
  "frameStatus": [0, 15, 17, 3, 0, 0, 1, 1, 1, 0, 0, 0, 0, 15, 17, 0, 0, 0, 2, 2, 2, 0, 0, 0, 0, 0, 0],
  "jumpX": 0.1,
  "jumpY": -30
};
