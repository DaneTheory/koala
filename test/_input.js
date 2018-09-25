const foo = 1
const bar = 15

const f = (a) => a + 10 - 2 /* ? */

const h = (b) => {
  let a = 10

  return b + a /* ?h(10) */
}
