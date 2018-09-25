const foo = 1;
const bar = 15;

const f = a => a + 10 - 2; /* ? */

process.env.KOALA && console.log("", f, " \uD83D\uDC28 at /Users/dominic.charlesworth/workspace/koala/test/_input.js:4:27:65")
const h = b => {
  let a = 10;

  return b + a; /* ?h(10) */
};
process.env.KOALA && console.log("", h(10), " \uD83D\uDC28 at /Users/dominic.charlesworth/workspace/koala/test/_input.js:9:14:127")
