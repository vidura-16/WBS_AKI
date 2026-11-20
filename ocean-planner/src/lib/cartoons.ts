// Her cartoon images live in /public/cartoons. Rename files here if you like.
export const CARTOONS = {
  welcome: { file: 'welcome.JPG', label: 'welcome', alt: 'Cartoon of her waving hello' },
  added: { file: 'added.JPG', label: 'added', alt: 'Cartoon of her adding a task' },
  done: { file: 'done.JPG', label: 'done', alt: 'Cartoon of her celebrating' },
  goal: { file: 'goal.JPG', label: 'goal', alt: 'Cartoon of her celebrating a finished goal' },
  empty: { file: 'empty.JPG', label: 'empty', alt: 'Cartoon of her relaxing' },
} as const

export type CartoonKey = keyof typeof CARTOONS

export const MESSAGES = {
  done: ['Another one bloomed! 🌹', 'Nicely done!', 'One less thing on the list.', 'Look at you go!'],
  goal: ['Goal complete. You’re in full bloom! 🌷', 'The whole goal is done. Take a bow!'],
  added: ['Planted in your garden 🌱', 'Added. One step at a time.', 'On the list!'],
} as const

export const pick = (list: readonly string[]) => list[Math.floor(Math.random() * list.length)]
