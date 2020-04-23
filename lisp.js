let globalenv = {
  '+': (args) => args.reduce((a,b) => a+b),
  '-' : (args) => args.reduce((a,b) => a-b),
  '*' :  (args) => args.reduce((a,b) => a*b),
  '/': (args) => args.reduce((a,b) => a/b),
  'pi': Math.PI
}
function specialform_parser(input){
  // comprises of define lambda quote begin if 
  return null

}
function expression_parser(input){
  // comprises of operations
  return null

}
function numberparser(data){
  let result = /[-]?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?/.exec(data);
  if ( result != null && result.index === 0) return ([Number(result[0]), data.trim().slice(result[0].length)]);
  return null;

}
function evaluate(input){
  // comprises of specialform parser, expressionprser, numberparser

  let result
  result = specialform_parser(input) || expression_parser(input) || numberparser(input)
  return result
}
console.log(evaluate('45'));
// (evaluate('45'))