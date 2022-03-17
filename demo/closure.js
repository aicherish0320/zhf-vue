const hello = (name) => {
  return (msg) => {
    console.log(`Hello ${name},${msg}`)
  }
}

hello('aic')('nice to meet you')
