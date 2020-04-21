let globalenv = {
  '+' : (args) => args.reduce((a,b) => a+b),
  '-' : (args) => args.reduce((a,b) => a-b),
  '*' :(args) => args.reduce((a,b) => a*b),
  '/' :(args) => args.reduce((a,b) => a/b),
  'pi'  : Math.PI
}
// console.log('typeof',typeof(globalenv['pi']))

function skipSpace(string) {  
  let first = string.search(/\S/);
  if (first == -1) return "";
  return string.slice(first);
} // end of skip fucnction 

function numberParser (inp) {
  let result = inp.match(/^-?(0|[\d1-9]\d*)(\.\d+)?(?:[Ee][+-]?\d+)?/)
  if (result === null) return null
  return [Number(result[0]) , skipSpace(inp.slice(result[0].length))]
}// end of numberparser


function operation(inp,env=globalenv){
  let result
  let args= []

  if(inp.startsWith('(')){

    inp =skipSpace (inp.slice(1))
    let op = inp.slice(0,inp.indexOf(' '))
    // console.log(op);
    if(!globalenv[op]) return 'nosuch operatio allowed'
    // if(globalenv[op] == Math.PI) return globalenv[op]
    // console.log(typeof(globalenv[op]));
    inp = skipSpace(inp.slice(op.length))


    while (inp[0] != ')'){
      console.log('input',inp[0]);
      if (inp.startsWith('pi')){
        return (result = [Number(3.1415) , inp  = inp.slice(2)])
      }
      
      else result = identify(inp, env)
      console.log('result:',result);
      
      if (!result) return 'no result '
      console.log('result[0',result[0]);
      
      args.push(result[0])
      console.log('args',args);
      
      inp  = skipSpace(result[1])
    }// end of while loop
    
    
    return [globalenv[op](args),inp.slice(1)]

  } // end of if loop 
  else return null 

}



function identify(inp,env = globalenv){
  //  can be an expression or the special forms
inp = skipSpace(inp)
let result = operation(inp, globalenv) || numberParser(inp) || piparser(inp)
return result
   

}
// main function for the interpreter
function evaluate(input){
  let output = identify(input,globalenv)
  return (output =='' ? 'invalid':output)
}

console.log(evaluate('(+ 1 pi)'));

