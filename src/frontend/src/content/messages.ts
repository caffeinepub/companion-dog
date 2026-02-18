export const encouragingMessages = [
  "You're doing great! Keep it up! 🌟",
  "Believe in yourself! You've got this! 💪",
  "Every step forward is progress! 🚀",
  "You're amazing just the way you are! ✨",
  "Take a deep breath - you're doing wonderfully! 🌈",
  "Your hard work is paying off! 🎯",
  "Keep shining bright! ☀️",
  "You're stronger than you think! 💎",
  "Today is full of possibilities! 🌸",
  "You're making a difference! 🌟",
  "Stay positive and keep going! 🎨",
  "You're capable of amazing things! 🦋",
  "Remember to smile - you're awesome! 😊",
  "Your potential is limitless! 🌠",
  "Keep up the fantastic work! 🎉",
  "You're on the right path! 🛤️",
  "Believe in your dreams! 💫",
  "You're doing better than you think! 🌺",
  "Stay focused and keep moving forward! 🎯",
  "You're a star! Keep shining! ⭐"
];

export function getRandomMessage(): string {
  return encouragingMessages[Math.floor(Math.random() * encouragingMessages.length)];
}
