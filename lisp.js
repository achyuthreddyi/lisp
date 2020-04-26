// "use strict";
let globalEnv = {
  '+': (args) => args.reduce((a,b) => a+b),
  '-' : (args) => args.reduce((a,b) => a-b),
  '*' :  (args) => args.reduce((a,b) => a*b),
  '/': (args) => args.reduce((a,b) => a/b),
  '>': (args)=> args[0]>args[1] ?  true : false,
  '<':(a,b) => Math.min(a,b),
  'sqrt':a=>  Math.sqrt(a)
                        
}
let globalConsts = {
  'pi': Math.PI,
  'e':Math.e
}
function numberparser(data){
  let result = /[-]?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?/.exec(data);
  if ( result != null && result.index === 0) return ([Number(result[0]), data.trim().slice(result[0].length)]);
  return null;
}
function skipSpace(input){
  let first = input.search(/\S/)
  if (first == -1 )return ""
  return input.slice(first)

}

function specialform_parser(input){
  // comprises of define lambda quote 
  return null

}



function operation_parser(input){
  // console.log('entering the operator_parser',input);
  let args = []
  let result  
  if(input.startsWith('(')) input =skipSpace (input.slice(1))
    let op = input.slice(0,input.indexOf(' '))
    // console.log('operator is ',op);
    // checking for constants
    if(globalConsts[op]) {      
      console.log(op);
      
      return [globalConsts[op],skipSpace(input.slice(op.length))]      
    }
    if(!globalEnv[op]) return null 
     
    input  = skipSpace(input.slice(op.length))
    while(input[0] != ')'){
      result = evaluate(input)
      if(!result) return null
      args.push(result[0])
      input=skipSpace(result[1])
      // console.log(`args are ${args}`);
      
    }  
  return [globalEnv[op](args),input.slice(1)  ]
}


// function balance_brakcet(input){
//   console.log('inside itht balance_bracket',input.slice(0,input.length-1));
//   let count = 0
//   let result
//   if (input.startsWith('(')){
//     count +=1
//     while(count){

//       result = input.slice(0,1)
//     }
    

//   }// end of if loop
  
// }



function if_parser(input){
  // let args = []
  let conseq, alt;
  if(!input.startsWith('if')) return null
  input = skipSpace(input.slice(2))
  result  = expression_parser(input)
  let condition = result[0]
  console.log(condition);
  
  input = result[1]
  // console.log('result is ',result[1]);
  // console.log('evalate inif condition',evaluate(skipSpace(result[1])));
  input = evaluate(skipSpace(result[1]))
  console.log('input now becomes',input);
  if (condition){
    return input[0]
  }
  else return evaluate(skipSpace(input[1]))
  
  // console.log('result',evaluate(skipSpace(result[1])));
  
  // let conseq, alt;
  // conseq =evaluate(skipSpace(result[1]))
  // console.log('conseq', (conseq));
  // console.log('evaluate',typeof( '(+ 1 1 (* 2 4 )) (+ 3 3))'));
  
  
  

}








function expression_parser(input){  
  // comprises of operations // ifparser // beginparser
  if (!input.startsWith('(')) return null
  input = skipSpace(input.slice(1))
  let result = operation_parser(input) ||if_parser(input)
  return result ? result : null
  // return null

}



function evaluate(input){
  // comprises of specialform parser, expressionprser, numberparser  
 let result
  result = specialform_parser(input) || expression_parser(input) || numberparser(input)
  return result
}


// let finalresult = evaluate('(* 10 if 11 ( + 1 2 )   pi )')
let finalresult = evaluate('(if (> 10 20) (+ 1 1 (* 2 4 )) (+ 3 3))')
// if(finalresult) console.log(finalresult[0]);
 console.log('final result is ',finalresult);
// (evaluate('45'))



// console.log('finalreafafaadfadsfa',evaluate('(+ 1 1 (* 2 4 )) (+ 3 3))'));
