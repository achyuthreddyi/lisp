

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
  'e':Math.e,
}
function numberparser(data){
  let result = /[-]?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?/.exec(data);
  if ( result != null && result.index === 0) return ([Number(result[0]), data.trim().slice(result[0].length)]);
  return null;
} // end of number parser
function skipSpace(input){
  let first = input.search(/\S/)
  if (first == -1 )return ""
  return input.slice(first)
} // end of skip space function

function quote_parser(input){
  if (!input.startsWith('quote ')) return null
  input = skipSpace(input.slice(6))
  // console.log(input);
  let copy = input
  // console.log(str);
  let c = 1 , result = ''
  while (c){
    if(copy.startsWith('(')) c+=1
    else if (copy.startsWith(')')) c-=1
    if(!c) break
    result += copy[0] 
    copy = copy.slice(1)
    if (!copy.length) return null
    }
    return [result,copy]


}




function defining_variable(input){
  let result = input.match(/^[a-zA-Z]\w*/)
  if(result == null) return null
  return [result[0],skipSpace(input.slice(result[0].length))]

}
function define_parser(input){
  if (!input.startsWith('define')) return null
  input = skipSpace(input.slice(7))
  let identity,value
  if (!(identity = defining_variable(input))) return null
  input = identity[1]
  if(!(value= evaluate(input))) return null
  globalEnv[identity[0]] = value[0]
  input = skipSpace(value[1])
  if(!input.startsWith(')')) return null
  input = skipSpace(input.slice(1))
  return ['',input]

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



function if_parser(input){ 
  if(!input.startsWith('if')) return null
  input = skipSpace(input.slice(2))
  result  = expression_parser(input)
  let condition = result[0]
  console.log(condition);  
  input = result[1]
  input = evaluate(skipSpace(result[1]))
  console.log('input now becomes',input);
  if (condition){
    return input[0]
    }
  else return evaluate(skipSpace(input[1]))

}

function begin_parser(input){
  let result
  if(!input.startsWith('begin ')) return null
  input = input.slice(6)
  let i=0
  while (input[0] != ')'){
    console.log(i++);
    
    result = evaluate(skipSpace(input))
    console.log('in beegin praser',result);
    // console.log(re);
    
    input = skipSpace(result[1])
  }
  return [result[0], input.slice(1)]

}

function specialform_parser(input){
  // comprises of define lambda quote 
  let result
  if(!input.startsWith('(')) return null
  input = skipSpace(input.slice(1))
  result = define_parser(input) || quote_parser(input)
  if (!result) return null
  return result
}

function expression_parser(input){  
  // comprises of operations // ifparser // beginparser
  if (!input.startsWith('(')) return null
  input = skipSpace(input.slice(1))
  let result = operation_parser(input) ||if_parser(input) || begin_parser(input)
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
let finalresult = evaluate('(quote (one two)))')
// if(finalresult) console.log(finalresult[0]);
 console.log('final result is ',finalresult);
//  console.log(globalEnv);
 
// (evaluate('45'))
// console.log('finalreafafaadfadsfa',evaluate('(+ 1 1 (* 2 4 )) (+ 3 3))'));
