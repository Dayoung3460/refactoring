
let invoices = require('./invoices.json')
let plays = require('./plays.json')

function statement(invoice, plays) {
  let totalAmount = 0
  let volumeCredits = 0
  let result = `payment statement (customer: ${invoice.customer})\n`
  const format = new Intl.NumberFormat("en-US",
    {style: 'currency', currency: "USD",
    minimumFractionDigits: 2}).format

  
  
  for(let perf of invoice.performance) {
    volumeCredits += volumeCreditsFor(perf)
    function playFor(perf) {
      return plays[perf.playID]
    }

    function amountFor(aPerformance) {
      let result = 0
      switch (playFor(perf).type) {
        case 'tragedy':
          result = 40000
          if(aPerformance.audience > 30) {
            result += 1000 * (aPerformance.audience - 30)
          }
          break
        case 'comedy':
          result = 30000
          if(aPerformance.audience > 20) {
            result += 10000 + 500 * (aPerformance.audience - 20)
          }
          result += 300 * aPerformance.audience
          break
        default:
          throw new Error(`unknown genre: ${playFor(perf).type}`)
      }

      return result
    }

    function volumeCreditsFor(perf) {
      let result = 0
      //  accumulate points
      result += Math.max(perf.audience - 30, 0)
      // extra points for comedy audience
      if('comedy' === playFor(perf).type) result += Math.floor(perf.audience / 5)

      return result
    }





    // print payment statement
    result += `   ${playFor(perf).name}: ${format(amountFor(perf) / 100)} (${perf.audience} seats)\n`
    totalAmount += amountFor(perf)

  }

  result += `total: ${format(totalAmount / 100)}\n`
  result += `point: ${volumeCredits}\n`

  return result
}



console.log(statement(invoices[0], plays))
