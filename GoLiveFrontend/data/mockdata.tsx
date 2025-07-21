export type Stream = {
  id: string;
  title: string;
  streamer: {
    id: string;
    username: string;
    displayName: string;
    avatar: string;
  };
  thumbnail: string;
  game: string;
  viewers: number;
  tags: string[];
  isLive: boolean;
  startedAt?: Date;
};

export type Category = {
  id: string;
  name: string;
  image: string;
  viewers: number;
  tags: string[];
};

export type User = {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  bio?: string;
  followers: number;
  following: number;
  isStreamer: boolean;
  streams?: Stream[];
};

// Mock users
export const mockUsers = [
  {
    id: "user-1",
    username: "ninja",
    displayName: "Ninja",
    avatar:
      "https://images.pexels.com/photos/1270076/pexels-photo-1270076.jpeg?auto=compress&cs=tinysrgb&w=600",
    bio: "Professional gamer and streamer",
    followers: 1850,
    following: 280,
    isStreamer: true,
    stream: true,
    verified: true,
  },
  {
    id: "user-2",
    username: "pokimane",
    displayName: "Pokimane",
    avatar:
      "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=600",
    bio: "Content creator",
    followers: 9200000,
    following: 420,
    isStreamer: true,
    verified: true,
  },
  {
    id: "user-3",
    username: "shroud",
    displayName: "Shroud",
    avatar:
      "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=600",
    bio: "Former CS:GO pro player",
    followers: 10100000,
    following: 312,
    isStreamer: true,
    // not verified
  },
  {
    id: "user-4",
    username: "valkyrae",
    displayName: "Valkyrae",
    avatar:
      "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=600",
    bio: "Content creator and co-owner of 100 Thieves",
    followers: 4900000,
    following: 255,
    isStreamer: true,
  },
  {
    id: "user-5",
    username: "timthetatman",
    displayName: "TimTheTatman",
    avatar:
      "https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=600",
    bio: "Full-time streamer and content creator",
    followers: 7200000,
    following: 179,
    isStreamer: true,
  },
];

// Mock streams
export const mockStreams = [
  {
    id: "stream-1",
    title: "Fortnite Arena Grind! | !merch !socials",
    streamer: {
      id: "user-1",
      username: "ninja",
      displayName: "Ninja",
      avatar:
        "https://images.pexels.com/photos/1270076/pexels-photo-1270076.jpeg?auto=compress&cs=tinysrgb&w=600",
    },
    thumbnail:
      "https://images.pexels.com/photos/3165335/pexels-photo-3165335.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    game: "Fortnite",
    viewers: 45789,
    tags: ["English", "FPS", "Battle Royale"],
    isLive: true,
    startedAt: new Date(Date.now() - 3600000 * 2),
    stream: true,
    isfollowed: true,
  },
  {
    id: "stream-2",
    title: "Valorant Ranked w/ Friends! | !sub !prime",
    streamer: {
      id: "user-2",
      username: "pokimane",
      displayName: "Pokimane",
      avatar:
        "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=600",
    },
    thumbnail:
      "https://images.pexels.com/photos/7915579/pexels-photo-7915579.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    game: "Valorant",
    viewers: 32456,
    tags: ["English", "FPS", "Tactical Shooter"],
    isLive: true,
    startedAt: new Date(Date.now() - 3600000 * 1.5),
    isfollowed: true,
  },
  {
    id: "stream-3",
    title: "CS2 Professional Practice | !sponsor !discord",
    streamer: {
      id: "user-3",
      username: "shroud",
      displayName: "Shroud",
      avatar:
        "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=600",
    },
    thumbnail:
      "https://images.pexels.com/photos/1174746/pexels-photo-1174746.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    game: "Counter-Strike 2",
    viewers: 38901,
    tags: ["English", "FPS", "Esports"],
    isLive: true,
    startedAt: new Date(Date.now() - 3600000 * 3),
    isfollowed: true,
  },
  {
    id: "stream-4",
    title: "GTA RP - New Character Day! | !instagram !tiktok",
    streamer: {
      id: "user-4",
      username: "valkyrae",
      displayName: "Valkyrae",
      avatar:
        "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=600",
    },
    thumbnail:
      "https://images.pexels.com/photos/1293261/pexels-photo-1293261.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    game: "Grand Theft Auto V",
    viewers: 27654,
    tags: ["English", "RP", "Action"],
    isLive: true,
    startedAt: new Date(Date.now() - 3600000 * 0.5),
  },
  {
    id: "stream-5",
    title: "Call of Duty: Warzone Squad Games | !youtube !gfuel",
    streamer: {
      id: "user-5",
      username: "timthetatman",
      displayName: "TimTheTatman",
      avatar:
        "https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=600",
    },
    thumbnail:
      "https://images.pexels.com/photos/7915565/pexels-photo-7915565.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    game: "Call of Duty: Warzone",
    viewers: 34123,
    tags: ["English", "FPS", "Battle Royale"],
    isLive: true,
    startedAt: new Date(Date.now() - 3600000 * 1),
  },
  {
    id: "stream-6",
    title: "Minecraft Building a New Kingdom | !mods !server",
    streamer: {
      id: "user-1",
      username: "ninja",
      displayName: "Ninja",
      avatar:
        "https://images.pexels.com/photos/1270076/pexels-photo-1270076.jpeg?auto=compress&cs=tinysrgb&w=600",
    },
    thumbnail:
      "https://images.pexels.com/photos/163036/mario-luigi-yoschi-figures-163036.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    game: "Minecraft",
    viewers: 18765,
    tags: ["English", "Building", "Adventure"],
    isLive: false,
    startedAt: new Date(Date.now() - 3600000 * 24 * 2),
  },
];

// Mock categories/games
export const mockCategories = [
  {
    id: "cat-1",
    name: "Fortnite",
    image:
      "https://images.pexels.com/photos/7915570/pexels-photo-7915570.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    viewers: 285600,
    tags: ["Shooter", "Battle Royale", "Action"],
  },
  {
    id: "cat-2",
    name: "League of Legends",
    image:
      "https://images.pexels.com/photos/7915255/pexels-photo-7915255.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    viewers: 198400,
    tags: ["MOBA", "Strategy", "Action"],
  },
  {
    id: "cat-3",
    name: "Valorant",
    image:
      "https://images.pexels.com/photos/7915579/pexels-photo-7915579.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    viewers: 173200,
    tags: ["FPS", "Tactical", "Shooter"],
  },
  {
    id: "cat-4",
    name: "Minecraft",
    image:
      "https://images.pexels.com/photos/163036/mario-luigi-yoschi-figures-163036.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    viewers: 156900,
    tags: ["Adventure", "Sandbox", "Building"],
  },
  {
    id: "cat-5",
    name: "Counter-Strike 2",
    image:
      "https://images.pexels.com/photos/1174746/pexels-photo-1174746.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    viewers: 134500,
    tags: ["FPS", "Shooter", "Competitive"],
  },
  {
    id: "cat-6",
    name: "Grand Theft Auto V",
    image:
      "https://images.pexels.com/photos/1293261/pexels-photo-1293261.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    viewers: 120800,
    tags: ["Action", "Adventure", "Open World"],
  },
  {
    id: "cat-7",
    name: "Call of Duty: Warzone",
    image:
      "https://images.pexels.com/photos/7915565/pexels-photo-7915565.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    viewers: 98700,
    tags: ["FPS", "Battle Royale", "Shooter"],
  },
  {
    id: "cat-8",
    name: "Apex Legends",
    image:
      "https://images.pexels.com/photos/1852310/pexels-photo-1852310.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    viewers: 84300,
    tags: ["FPS", "Battle Royale", "Shooter"],
  },
];
export const mockChatMessages = (streamId: string) => {
  const messages = [
    {
      id: "1",
      username: "user123",
      message: "Hello everyone!",
      badges: ["subscriber"],
      time: new Date(Date.now() - 1000 * 60 * 5),
    },
    {
      id: "2",
      username: "gamerlover99",
      message: "Great stream today!",
      badges: [],
      time: new Date(Date.now() - 1000 * 60 * 4),
    },
    {
      id: "3",
      username: "twitchfan42",
      message: "Can you play some Valorant next?",
      badges: ["moderator"],
      time: new Date(Date.now() - 1000 * 60 * 3),
    },
    {
      id: "4",
      username: "streamwatcher",
      message: "LMAO that was hilarious 😂",
      badges: ["subscriber", "vip"],
      time: new Date(Date.now() - 1000 * 60 * 2),
    },
    {
      id: "5",
      username: "nightbot",
      message: "Don't forget to follow the channel!",
      badges: ["moderator"],
      time: new Date(Date.now() - 1000 * 60 * 1),
    },
    {
      id: "6",
      username: "prime_subscriber",
      message: "Just subscribed with Prime!",
      badges: ["subscriber"],
      time: new Date(Date.now() - 1000 * 30),
    },
    {
      id: "7",
      username: "chatsupporter",
      message: "Great play! How did you do that?",
      badges: [],
      time: new Date(Date.now() - 1000 * 15),
    },
    {
      id: "8",
      username: "moderator_user",
      message: "Please keep chat respectful everyone",
      badges: ["moderator"],
      time: new Date(),
    },
    // Additional mock messages for better visualization
    { id: "9", username: "viewer1", message: "Let's go! PogChamp", badges: [], time: new Date() },
    { id: "10", username: "viewer2", message: "This is so cool!", badges: [], time: new Date() },
    { id: "11", username: "proplayer", message: "Insane clutch!", badges: ["vip"], time: new Date() },
    { id: "12", username: "lurker", message: "👀", badges: [], time: new Date() },
    { id: "13", username: "emote_spammer", message: "Kappa Kappa Kappa", badges: [], time: new Date() },
    { id: "14", username: "hypeguy", message: "HYPE HYPE HYPE!", badges: [], time: new Date() },
    { id: "15", username: "newfollower", message: "Just followed!", badges: [], time: new Date() },
    { id: "16", username: "oldtimer", message: "Been here since day 1!", badges: [], time: new Date() },
    { id: "17", username: "mod_jane", message: "Reminder: No spoilers in chat!", badges: ["moderator"], time: new Date() },
    { id: "18", username: "vip_dan", message: "VIP in the house!", badges: ["vip"], time: new Date() },
    { id: "19", username: "user456", message: "What rank are you now?", badges: [], time: new Date() },
    { id: "20", username: "user789", message: "Can you say hi to my friend?", badges: [], time: new Date() },
  ];

  return messages;
};

// Mock followed channels
export const mockFollowedChannels = [
  {
    id: "user-1",
    username: "ninja",
    displayName: "Ninja",
    avatar:
      "https://images.pexels.com/photos/1270076/pexels-photo-1270076.jpeg?auto=compress&cs=tinysrgb&w=600",
    isLive: true,
    game: "Fortnite",
    viewers: 45789,
  },
  {
    id: "user-2",
    username: "pokimane",
    displayName: "Pokimane",
    avatar:
      "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=600",
    isLive: true,
    game: "Valorant",
    viewers: 32456,
  },
  {
    id: "user-3",
    username: "shroud",
    displayName: "Shroud",
    avatar:
      "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=600",
    isLive: true,
    game: "Counter-Strike 2",
    viewers: 38901,
  },
  {
    id: "user-4",
    username: "valkyrae",
    displayName: "Valkyrae",
    avatar:
      "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=600",
    isLive: false,
    game: "",
    viewers: 0,
  },
  {
    id: "user-5",
    username: "timthetatman",
    displayName: "TimTheTatman",
    avatar:
      "https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=600",
    isLive: false,
    game: "",
    viewers: 0,
  },
];

export const CLIPS = [
  {
    id: "1",
    uri: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    title: "Epic Victory!",
    game: "Fortnite",
    tags: ["English", "Battle Royale", "Highlights"],
    streamer: {
      avatar: "https://randomuser.me/api/portraits/men/1.jpg",
      name: "StreamerOne",
      verified: true,
    },
    likes: 12,
    comments: [
      { id: "c1", user: "Alice", text: "Nice clip!" },
      { id: "c2", user: "Bob", text: "Awesome!" },
    ],
  },
  {
    id: "2",
    uri: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    title: "Ace In Valorant!",
    game: "Valorant",
    tags: ["FPS", "Clutch", "Pro Play"],
    streamer: {
      avatar: "https://randomuser.me/api/portraits/women/2.jpg",
      name: "StreamerTwo",
      verified: false,
    },
    likes: 5,
    comments: [{ id: "c3", user: "Charlie", text: "Great moment!" }],
  },
  {
    id: "3",
    uri: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
    title: "Insane Snipe!",
    game: "Call of Duty",
    tags: ["FPS", "Sniper", "Long Shot"],
    streamer: {
      avatar: "https://randomuser.me/api/portraits/men/3.jpg",
      name: "StreamerThree",
      verified: true,
    },
    likes: 8,
    comments: [{ id: "c4", user: "Dana", text: "Unbelievable!" }],
  },
  {
    id: "4",
    uri: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
    title: "Funny Fail!",
    game: "Minecraft",
    tags: ["Funny", "Fail", "Building"],
    streamer: {
      avatar: "https://randomuser.me/api/portraits/women/4.jpg",
      name: "StreamerFour",
      verified: false,
    },
    likes: 3,
    comments: [{ id: "c5", user: "Eli", text: "LOL!" }],
  },
];
