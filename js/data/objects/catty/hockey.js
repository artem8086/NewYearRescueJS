Engine.objects['catty/hockey'] = {
  "class": "UnitData",
  "setName": "hockey_stick",
  "anims": ["units/catty", "faces/hockey", "weapons/hockey_stick"],
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
    256,
    512,
    4],
      "next": 12,
      "count": 5
    },
    {
      "indx": "run 1",
      "anims": [0,
    1,
    2,
    3,
    256,
    512,
    4],
      "next": 5,
      "count": 1
    },
    {
      "indx": "run attack 2",
      "anims": [0,
    1,
    17,
    3,
    256,
    515,
    23],
      "next": 31
    },
    {
      "indx": "attack 3",
      "anims": [0,
    1,
    17,
    3,
    256,
    515,
    23],
      "next": 19
    },
    {
      "indx": "in air 4",
      "anims": [0,
    1,
    2,
    3,
    256,
    512,
    4],
      "count": 4,
      "next": 28
    },
    {
      "indx": "run 5",
      "anims": [9,
    10,
    21,
    3,
    256,
    515,
    23],
      "count": 1
    },
    {
      "anims": [11,
    12,
    18,
    3,
    256,
    516,
    24],
      "count": 1
    },
    {
      "anims": [9,
    10,
    17,
    3,
    256,
    515,
    23],
      "count": 1
    },
    {
      "anims": [0,
    1,
    2,
    3,
    256,
    512,
    4],
      "count": 1
    },
    {
      "anims": [5,
    6,
    17,
    3,
    256,
    518,
    26],
      "count": 1
    },
    {
      "anims": [7,
    8,
    18,
    3,
    256,
    519,
    27],
      "count": 1
    },
    {
      "anims": [5,
    6,
    17,
    3,
    256,
    518,
    26],
      "next": 1,
      "count": 1
    },
    {
      "indx": "stand 12",
      "anims": [0,
    1,
    13,
    3,
    256,
    513,
    14],
      "count": 5
    },
    {
      "anims": [0,
    1,
    15,
    3,
    256,
    514,
    16],
      "count": 5
    },
    {
      "anims": [0,
    1,
    13,
    3,
    256,
    513,
    14],
      "next": 0,
      "count": 5
    },
    {
      "indx": "up 15",
      "anims": [0,
    1,
    2,
    3,
    259,
    512,
    4],
      "count": 2
    },
    {
      "anims": [0,
    1,
    2,
    3,
    260,
    512,
    4],
      "next": 16,
      "count": 2
    },
    {
      "indx": "down 17",
      "anims": [0,
    1,
    2,
    3,
    257,
    512,
    4],
      "count": 2
    },
    {
      "anims": [0,
    1,
    2,
    3,
    258,
    512,
    4],
      "next": 18,
      "count": 2
    },
    {
      "indx": "attack 19",
      "anims": [0,
    1,
    18,
    3,
    256,
    516,
    24]
    },
    {
      "anims": [0,
    1,
    18,
    3,
    256,
    521,
    29]
    },
    {
      "anims": [0,
    1,
    18,
    3,
    256,
    523,
    31],
      "count": 1
    },
    {
      "anims": [0,
    1,
    17,
    3,
    256,
    522,
    30],
      "dmgRegs": [
        {
          "x": 40,
          "y": -30,
          "w": 30,
          "h": 40,
          "forceX": 30,
          "forceY": -5,
          "damage": -5,
          "mask": 5
        }
      ]
    },
    {
      "anims": [0,
    1,
    17,
    3,
    256,
    521,
    29],
      "dmgRegs": [
        {
          "x": 45,
          "y": -40,
          "w": 45,
          "h": 70,
          "forceX": 60,
          "forceY": -3,
          "damage": -9,
          "mask": 5
        }
      ]
    },
    {
      "anims": [0,
    1,
    2,
    3,
    256,
    517,
    25]
    },
    {
      "anims": [0,
    1,
    2,
    3,
    256,
    516,
    24]
    },
    {
      "anims": [0,
    1,
    2,
    3,
    256,
    515,
    23]
    },
    {
      "anims": [0,
    1,
    2,
    3,
    256,
    512,
    4],
      "count": 1,
      "next": 3
    },
    {
      "indx": "in air 28",
      "anims": [0,
    1,
    17,
    3,
    256,
    518,
    26],
      "count": 2
    },
    {
      "anims": [0,
    1,
    18,
    3,
    256,
    519,
    27],
      "count": 2
    },
    {
      "anims": [0,
    1,
    17,
    3,
    256,
    518,
    26],
      "count": 2,
      "next": 4
    },
    {
      "indx": "run attack 31",
      "anims": [0,
    1,
    18,
    3,
    256,
    516,
    24]
    },
    {
      "anims": [9,
    10,
    18,
    3,
    256,
    521,
    29]
    },
    {
      "anims": [9,
    10,
    18,
    3,
    256,
    523,
    31],
      "count": 1
    },
    {
      "anims": [11,
    12,
    17,
    3,
    256,
    522,
    30],
      "dmgRegs": [
        {
          "x": 40,
          "y": -30,
          "w": 30,
          "h": 40,
          "forceX": 30,
          "forceY": -5,
          "damage": -5,
          "mask": 5
        }
      ]
    },
    {
      "anims": [9,
    10,
    17,
    3,
    256,
    521,
    29],
      "dmgRegs": [
        {
          "x": 45,
          "y": -40,
          "w": 45,
          "h": 70,
          "forceX": 60,
          "forceY": -3,
          "damage": -9,
          "mask": 5
        }
      ]
    },
    {
      "anims": [0,
    1,
    2,
    3,
    256,
    517,
    25]
    },
    {
      "anims": [5,
    6,
    2,
    3,
    256,
    516,
    24]
    },
    {
      "anims": [7,
    8,
    2,
    3,
    256,
    515,
    23]
    },
    {
      "anims": [5,
    6,
    2,
    3,
    256,
    512,
    4],
      "count": 1,
      "next": 2
    },
    {
      "indx": "dead 40",
      "anims": [0,
    1,
    2,
    3,
    32,
    4],
      "count": 1
    },
    {
      "anims": [0,
    1,
    43,
    35,
    33,
    44],
      "count": 1
    },
    {
      "anims": [45,
    36,
    34,
    46],
      "count": 31
    },
    {
      "anims": [45,
    36,
    34,
    46],
      "next": 43
    },
    {
      "indx": "dead in air 44",
      "anims": [0,
    1,
    37,
    3,
    32,
    40],
      "count": 4
    },
    {
      "anims": [0,
    1,
    38,
    3,
    32,
    41],
      "count": 2
    },
    {
      "anims": [0,
    1,
    39,
    3,
    32,
    42],
      "count": 2
    },
    {
      "anims": [0,
    1,
    38,
    3,
    32,
    41],
      "count": 2,
      "next": 44
    }
  ],
  "inAirStatus": 13,
  "deathStatus": 12,
  "frameStatus": [0, 15, 17, 3, 3, 3, 1, 1, 1, 2, 2, 2, 40, 4, 15, 17, 3, 3, 3, 4, 4, 4, 3, 3, 3, 44],
  "forceX": [0, 0, 0, 0, 0, 0, 10, 10, 10, 7, 7, 7, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0.5, 0.5, 0.5, 0],
  "forceY": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  "jumpX": 0.1,
  "jumpY": -30
};
