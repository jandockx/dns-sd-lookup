require('must/register') // registers .must on Object.prototype
const Must = this.must.constructor // get the Must constructor

/**
 * Tests that the subject has a property {@code invariants} that is an Array of functions,
 * and asserts the result of each of these functions, called with the subject as only parameter.
 */
/* IDEA: it would be nicer to .call the invariants on this.actual, so we can write the functions using this.
   However, than we cannot use arrow functions, and we have to use function() functions: we cannot associate
   a this, even with .call or .apply, to an arrow function. */
Must.prototype.valid = function () {
  this.assert(this.actual.invariants instanceof Array, 'have an array of invariants')
  this.actual.invariants.forEach(invar => {
    this.assert(typeof invar === 'function', 'have functions as invariants (' + invar + ' is not)')
    this.assert(invar(this.actual), 'adhere to ' + invar)
  })
}
