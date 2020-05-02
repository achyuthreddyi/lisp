

// "use strict";
let globalEnv = {
  '+': (args) => args.reduce((a,b) => a+b),
  '-' : (args) => args.reduce((a,b) => a-b),
  '*' :  (args) => args.reduce((a,b) => a*b),
  '/': (args) => args.reduce((a,b) => a/b),
  '>': (args)=> args[0]>args[1] ?  true : false,
  '<':(args)=> args[0]<args[1] ?  true : false,
  'sqrt':a=>  Math.sqrt(a)
                        
}
let globalConsts = {
  'pi': Math.PI,
  
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

function lambda_parser(input){
  if (!input.startsWith('lambda ')) return null
  input = skipSpace(input.slice(7))
  let args = {}
  let local = {}
  let parameters
  input = skipSpace(input.slice(1))
  while(!input.startsWith(')')){
    parameters = defining_variable(input)
    if (!parameters) return null
    // console.log('inside the lamba_parser',parameters);
    globalConsts[parameters[0]] = null
     console.log('inside the lamba_parser',globalConsts);
    
    
    args[parameters[0]] = null
    input = skipSpace(parameters[1])
  }
  input = input.slice(1)
  local.args = args

  let result = validate_fun(input)
  if (!result) return null
  local.def = result[0]
  input = skipSpace(result[1])
  if(!input.startsWith(')')) return null
  return [local,input.slice(1)]
 
}






function validate_fun(input){
  let result 
  if((result = numberparser(skipSpace(input)))) return result
  else if ((result = defining_variable(skipSpace(input)))) return result
  input = skipSpace(input)
  if (input.startsWith('(')){
    input = skipSpace(input.slice(1))
    result ='('
    let c = 1
    while(c){
      if (input.startsWith('(')) c +=1
      if (input.startsWith(')')) c -=1
      if(!c) break
      result += input[0]
      input = input.slice(1)

    } 
    result += ')'
    return[result,skipSpace(input.slice(1))]   

  }
  return null

}

function defining_variable(input){
  let result = input.match(/^[a-zA-Z]\w*/)
  if(result == null) return null
  return [result[0],skipSpace(input.slice(result[0].length))]

}
function define_parser(input){
  // console.log('inside teh define parser',input);
  
  if (!input.startsWith('define')) return null
  console.log('inside teh define parser',input);
  input = skipSpace(input.slice(7))
  let identity,value
  if (!(identity = defining_variable(input))) return null
  input = identity[1]
  if(!(value= evaluate(input))) return null // can be number or lambda function
  globalEnv[identity[0]] = value[0]
  console.log('global enviromnet in define function',globalEnv);
  
  input = skipSpace(value[1])
  if(!input.startsWith(')')) return null

  input = skipSpace(input.slice(1))
  return ['',input]

}
//  toevaluate the function req --- 1) default parameters 2) it should again go back and formthe loop
function evaluate_lambda_function(operator,input){
  // console.log('operator',operator, input);
  let value , i=0
  let key_of_args = Object.keys(globalEnv[operator]['args'])
  // let x = []


  while(!input.startsWith(')'))
  {
    value = evaluate(input)
    console.log('environment in the evaluate function',globalEnv);
    
    console.log('value in evaluation function',value);
    globalEnv[operator]['args'] [key_of_args[i]] = value[0]
    globalConsts[[key_of_args[i]]] = value[0]
     i += 1 
    input = skipSpace(value[1])
  }
  console.log('environment in the evaluate function 4',globalConsts);
  result = evaluate(globalEnv[operator]['def'])
  console.log('result in evaluate laambda',result);
  

  
  

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
    if (typeof globalEnv[op] ==='object'){
      input = skipSpace(input.slice(op.length))
      console.log('op',op);
      
      return evaluate_lambda_function(op,input)
    }
     
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
    // console.log('in beegin praser',result);
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
  result = define_parser(input) || lambda_parser(input) || quote_parser(input) 
  if (!result) return null
  return result
}

function expression_parser(input){  
  // comprises of operations // ifparser // beginparser
  if (!input.startsWith('(')) return null
  input = skipSpace(input.slice(1))
  let result = operation_parser(input) ||if_parser(input) || begin_parser(input) || defining_variable(input)
  return result ? result : null
  // return null
}

function evaluate(input){
  // comprises of specialform parser, expressionprser, numberparser  
 let result
  result = specialform_parser(input) || expression_parser(input) || numberparser(input)
  return result
}

// // let finalresult = evaluate('(* 10 if 11 ( + 1 2 )   pi )')
// let finalresult = evaluate('(define circle_area ( lambda (r) (* pi r r)))')
// // if(finalresult) console.log(finalresult[0]);
//  console.log('final result is ',finalresult);
//  console.log(globalEnv.circle_area);
// //  console.log(evaluate('(circle_area 3 )'));
 
 
// (evaluate('45'))
// console.log('finalreafafaadfadsfa',evaluate('(+ 1 1 (* 2 4 )) (+ 3 3))'));
console.log(evaluate('(define circle_area ( lambda (r) (* pi r r)))'))
console.log(evaluate('(circle_area 3 )'));

// console.log(globalEnv);
