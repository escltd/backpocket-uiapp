import { truncateNumber, sortObjectEntries } from "@/common"

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
    
    var calculatedOrderPnL = []
    for (var id in orderList) {
        var order = orderList[id]

        order.PnL = 0
        order.Fees = 0.075
        if (!showCancelled && order.Pair !== marketPair) {
            continue
        }

        if (order.Pair == marketPair) {
            order.AveragePrice = order.Price
             if (totalQuote!==0 && totalBase!==0) {
                order.AveragePrice = truncateNumber(totalQuote / totalBase)
            }
            order.TotalBase = totalBase
            order.TotalQuote = totalQuote
            
            if (order.Status == "FILLED" || order.Status == "NEW" || order.Status == "PARTIALLY_FILLED") {
                switch (order.Side) {
                    case "BUY":
                        if (order.AveragePrice > 0) {
                            order.PnL = truncateNumber(((order.AveragePrice) - order.Price) * order.Quantity)
                        }
                        order.Fees = truncateNumber(order.Total * (feesCharge / 100))
                        if(order.Status == "FILLED") {
                            totalBase += order.Quantity
                            totalQuote += order.Total
                        }
                        break;

                    case "SELL":
                        if ((order.AveragePrice) > 0) {
                            order.PnL = truncateNumber((order.Price - (order.AveragePrice)) * order.Quantity)
                        }
                        order.Fees = truncateNumber(order.Total * (feesCharge / 100))

                        if(order.Status == "FILLED") {
                            totalPnL += order.PnL
                            totalBase -= order.Quantity
                            totalQuote -= (order.Quantity * order.AveragePrice)
                            if (totalQuote < 0) {
                                totalQuote = 0
                            }
                        }
                        break;
                }

                if (order.Status == "FILLED") {
                    totalFees += order.Fees
                }
            }
        }
        AveragePrice = order.AveragePrice
        if (order.Status !== notSTATUS) {
            calculatedOrderPnL.push(order)
        }
    }
    
    marketPairPnL.TotalPnL = totalPnL
    marketPairPnL.TotalFees = totalFees
    marketPairPnL.TotalBase = truncateNumber(totalBase)
    marketPairPnL.TotalQuote = truncateNumber(totalQuote)

    marketPairPnL.AveragePrice = truncateNumber(AveragePrice)
    marketPairPnL.OrderList = calculatedOrderPnL    
    marketPairPnL.OrderList.reverse()

    
    return marketPairPnL
}
