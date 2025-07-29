const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },

    email: { type: String, required: true, unique: true },

    password: { type: String, required: true },

    profileImage: {
      type: String,
      default: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAALEAAACUCAMAAADrljhyAAAAMFBMVEXMzMz////Pz8/Jycn8+/zT09P09PTk5OTs7Oze3t7x8fHZ2dnp6enW1tb4+PjFxcXH7KXlAAAECElEQVR4nO2cDdKrKgxAlfCriPvf7QXte59trUUChM5wpgs4w8QEQugwdDqdTqfT6XQ6nU6n8xXYodaIgw2DEMuOV6fWuQaALUpNfPwfqczMqLU+AsNipnE8+P5nLZpcaljF5Lyv51V5dNa0F9Mwvy/uAT41Fhzrop1zV8aca9HQMsO8xcOF8cjdKA215x/qUvah7H+KNREawPR334e0XAZ6Z4Cr+H2T3laZ1BqG2BXemcTAaGODTRExfEQuxMb6Mg2fKgtSY3tTN6AHOuV1ThAeOV3CgOVOmvjDxwWR8c008YemMl4ShcfR0GwxVplsLIk2RcnC40gTFqlRHLAUwiItUew4QWCcUjxoF3lCGRMkOFRQUIQFJBXoA9VTMiiksaosjA1jHxbVAxkXxhSB/GvG6A9vHLvxN0Q37sbd2LPUNr7bWHmlegVh6Ye8nal2lQbsvqL+lv739m7YojdXNxa4QKboZOECearf3wSDMjYU/U1MWDiStjcmWyiarjfCmOb6BtK7QhZorm8SW/ThHA1EdyGJi8zpZhei73efsXTDFpBU+Djl2AIzX4YUzlCUcxaMqdvG9Tdtz8ZM3UwYlnhcwSvf219QC++rfEOY7O7xKMzYHJsxnCIX3o2HOW6vLGfi8ZUjEZHBFWtofMzv793J/OPTApvGRiHDEORnY+5Ee2OQfgWNPv8EnW5wbPOBMPa1oDhriEeZvuGTnQ1DnB452dAObHZ9D8C6nYp+Zix9YABbom4n+cbAdqg1btCNy9ONi7I9tvkV3+AqjFHKao9VyoSOYKtZGdaVGTvJ5zLtpPRluslS4ovzx309l7r27d1XtvdBl0jbjjT4YJARbQtnVRMhvQ5+eWPbLNLQ5w8wYRcf3xhySlAeT/2xYz91xHeyONcLXaIGcb/r5pWdpnpHBoYndDZ355XiE0Td/rv6l7yDwt3yclW3Dsa/F/vMtNRUXqbbj4NOlnmupgxz2if3iqvUroebPe4rbKgmxVMdxLzRjFeusPHHTfy/sr0wLOoL9uwJNwJdeJsB+Kz2plw0Md+6pYmEF71+yr/CgXKjb8jRoM+UemkBLOsnd6BQ9QPkK5tL5TJ/CYCd1LyixNwpYioohvxbDFhKBfGD/F+fy1vq3nCZjZnOXJzfyVtI/CG09Bpnjgs2nf6HTV5y5otVufLC/rCaz5id/01QdrKVPvR7x1iyzZUxV2F9A7neRUJCdy2RTJEcEkUlY5nnIY6p8tXtZFnkLRfXMs4RyWDqZLYHGQofyKrGGf6LY60mu4M2LnYa/QT6/FSgpXKNxS4yK3ccPQe7gwut4rpgOwHhPqky2ECuHcZbsxMD8t1gCsi9xVKxeDzAPUv+8r+fZcB9eiTG10r/AC9EMCxSyEBWAAAAAElFTkSuQmCC', 
    },

    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],

    following: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('User', userSchema);
