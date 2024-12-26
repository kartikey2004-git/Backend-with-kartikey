const asyncHandler = (requestHandler) => {
  return (req,res,next) => {
    Promise
    .resolve(requestHandler(req,res,next))
    .catch((err) => next(err))
  }
}

export {asyncHandler}


// A higher-order function (HOF) is a function that either takes another function as a parameter or returns a function as a result



// for reference

// const asyncHandler = () => {}
// const asyncHandler = (func) => {() => {}}
// const asyncHandler = (func) => () => {}
// const asyncHandler = (func) => async() => {}



// const asyncHandler = (fn) => async(req,res,next) => {
//   try {
//     await fn(req,res,next)
//   } catch (error) {
//     res.status(error.code || 500).json({
//       success: false,
//       message: error.message
//     })
//   }
// }

