import { truncateNumber, sortObjectEntries } from "@/common"

export function returnAverage(totalBase, totalQuote) {
    var averagePrice = 0
    if (totalQuote!==0 && totalBase!==0) {
        averagePrice = totalQuote / totalBase
        if (averagePrice < 0) {
            averagePrice = -1 * averagePrice
        }
    }
    return averagePrice
}

export function calculateOrderPnL(marketPair, orderList, showCancelled = false) {

    var totalPnL = 0
    var totalFees = 0
    var totalBase = 0
    var totalQuote = 0
    var AveragePrice = 0

    var marketPairPnL = {
        TotalPnL: 0,
        TotalFees: 0,
        TotalBase: 0,
        TotalQuote: 0,
        AveragePrice: 0,
        OrderList: []
    }

    var feesCharge = 0.075;

    var notSTATUS =  (showCancelled) ? "" : "CANCELED"
    
    var lastId = ""
    var calculatedOrderPnL = []
    for (var id in orderList) {
        var order = orderList[id]

        order.PnL = 0
        order.Fees = 0.075
        if (!showCancelled && order.Pair !== marketPair) {
            continue
        }

        if (order.Pair == marketPair) {
            order.AveragePrice = returnAverage(totalBase, totalQuote)
            if (order.AveragePrice <= 0) {
                order.AveragePrice = order.Price
            }
            
            if (order.Status == "FILLED" || order.Status == "NEW" || order.Status == "PARTIALLY_FILLED") {
                switch (order.Side) {
                    case "BUY":
                        order.PnL = truncateNumber(((order.AveragePrice) - order.Price) * order.Quantity)
                        order.Fees = truncateNumber(order.Total * (feesCharge / 100))
                        if(order.Status == "FILLED") {
                            totalPnL += order.PnL
                            totalBase += order.Quantity
                            totalQuote += order.Total
                        }
                        break;

                    case "SELL":
                        order.PnL = truncateNumber((order.Price - (order.AveragePrice)) * order.Quantity)
                        order.Fees = truncateNumber(order.Total * (feesCharge / 100))
                        if(order.Status == "FILLED") {
                            totalPnL += order.PnL
                            if (totalBase > 0) {
                                totalBase -= order.Quantity
                                totalQuote -= order.Quantity * order.AveragePrice
                            }
                        }
                        break;
                }
                lastId = id
                order.TotalPnL = totalPnL
                if (order.Status == "FILLED") {
                    totalFees += order.Fees
                }
            }
            order.TotalBase = truncateNumber(totalBase)
            order.TotalQuote = truncateNumber(totalQuote)
        }
        AveragePrice = returnAverage(totalBase, totalQuote)
        if (AveragePrice <= 0) {
            AveragePrice = order.Price
        }
        if (order.Status !== notSTATUS) {
            calculatedOrderPnL.push(order)
        }
    }

    if (lastId !== "" && orderList[lastId].Status == "FILLED" && orderList[lastId].Side == "BUY") {
        totalPnL -= orderList[lastId].PnL
        order.TotalPnL = totalPnL
    }
    
    marketPairPnL.TotalPnL = totalPnL
    marketPairPnL.TotalFees = totalFees
    marketPairPnL.TotalBase = truncateNumber(totalBase)
    marketPairPnL.TotalQuote = truncateNumber(totalQuote)

    marketPairPnL.AveragePrice = AveragePrice
    marketPairPnL.OrderList = calculatedOrderPnL    
    marketPairPnL.OrderList.reverse()

    
    return marketPairPnL
}
