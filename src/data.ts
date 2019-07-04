export const getRandomString = (length: number) => {
  const LETTERS = "abcdefghijklmnopqrstuvwxyz";
  let str = "";
  for (let i = 0; i < length; i++) {
    str += LETTERS[Math.floor(Math.random() * LETTERS.length)];
  }
  return str;
};

const getRandomYear = () => {
  return 2000 + Math.floor(Math.random() * 100);
};

const getRandomBetween = (min: number, max: number) => {
  return min + Math.floor(Math.random() * (min + max));
};

export const generateMovies = (numMovies: number) =>
  Array.from(new Array(numMovies)).map(() => ({
    title: getRandomString(10),
    year: getRandomYear(),
    rating: getRandomBetween(1, 4),
    producer: getRandomString(25),
    star: getRandomString(25),
    city: getRandomString(10),
    country: getRandomString(10),
    media_house: getRandomString(15)
  }));
