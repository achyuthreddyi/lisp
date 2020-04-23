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

// //////
function parseEvaluate( data , envt = environment){
  var value
  if( data[0] !== '(' ){
    if((variable = findTheVariable(data[0], envts[0]))){ // Variable reference
      data.shift()
      return variable
    }
    else if( Number(data[0]) === Number(data[0])) return Number(data.shift()) //Number
    throwError("Syntax Error! : '" + data[0] + "' is Invalid")
  }
  data.shift() //Removing ' ( '
  while( data[0] !== ')' ){
    if( data[0] === 'define' ){
      data.shift()
      let property = data[0]
      data.shift()
    if( data[1] !== 'lambda') envt[property] = value = parseEvaluate(data, envt)
    else{
      data.shift()
      envt[property] = value = lambdaParser( data, envt)
      data.shift()
      }
    console.log(property + " : " + value + " Updated to the global envt!")
    }
    else if( data[0] === 'quote'){
      data.shift()
      if( data[0] !== '(' && data[0] !== ')' ) return data.shift()
      else if( data[0] === ')' ) throwError("Invalid Quote")
      else value = getLiteralExpression( data )
    }
    else if( data[0] === 'set!' ){ //Should rework
      data.shift()
      let variable = data[0]
      data.shift()
      if( variable in envt ){
        envt[variable] = parseEvaluate(data, envt)
        console.log("The global variable " + variable + " is now : " + envt[variable])
      }
      else throwError("The variable " + variable + " is not a global variable")
    }

    else if( data[0] === 'lambda' ){
      value = lambdaParser( data, envt) //for direct evaluation
      data.shift()
      let noOfParameters = Object.keys(envts[0].parameters).length
      let params = Object.keys(envts[0].parameters)
      let paramIndex = 0
      while( noOfParameters !== 0 ){
        envts[0].parameters[params[paramIndex++]] = parseEvaluate(data)
        noOfParameters--
      }
      value = parseEvaluate(getTokens(value), envts[0])
      data.push(')')
    }

    else if( data[0] === 'begin' ) data.shift()
    else if( data[0] === '('){
      value = parseEvaluate( data , envt)
      //data.shift()
    }
    else if( data[0] === 'if' ){
      data.shift()
      if( parseEvaluate(data, envt) === true ){
        value = parseEvaluate(data, envt)
        break
      }
      else{
        parseEvaluate(data, envt)
        if( data[0] === 'oops' )  break
        value = parseEvaluate(data, envt)
        break
      }
    }
// //////




  let result
  result = specialform_parser(input) || expression_parser(input) || numberparser(input)
  return result
}
console.log(evaluate('45'));
// (evaluate('45'))