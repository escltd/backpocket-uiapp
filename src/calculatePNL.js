import { truncateNumber, sortObjectEntries } from "@/common"

export function calculateOrderPnL(marketPair, orderList, showCancelled = false) {

    var totalPnLBuy = 0
    var totalFeesBuy = 0
    var totalPnLSell = 0
    var totalFeesSell = 0

    var lastOrderPrice = 0
    var lastBuyPrice = 0
    var lastSellPrice = 0

    var nCountLastBuy = 0
    var nCountLastSell = 0
    var lResetLastBuy = false
    var lResetLastSell = false

    var marketPairPnL = {
        TotalPnLBuy: 0,
        TotalFeesBuy: 0,
        TotalPnLSell: 0,
        TotalFeesSell: 0,
        LastBuyPrice: 0,
        LastSellPrice: 0,
        OrderList: []
    }

    // var orderIDUnSorted = {}
    // for (var orderID in orderList) {
    //     orderIDUnSorted[orderList[orderID].ID] = parseInt(orderID)
    // }
    
    // var orderListSorted = []
    // var orderListAscending = sortObjectEntries(orderIDUnSorted, 1024000, true)
    
    // for (var id in orderListAscending) {
    //     var recordID = orderListAscending[id]
    //     var sortedList = orderList[orderIDUnSorted[recordID]]
    //     orderListSorted.push(sortedList)
    // }
    
    // // console.log(orderListSorted)
    // // return marketPairPnL

    // if (orderListSorted.length == 0){
    //     return marketPairPnL
    // }

    var feesCharge = 0.075;

    var notSTATUS =  (showCancelled) ? "" : "CANCELED"
    
    var calculatedOrderPnL = []
    // for (var id in orderListSorted) {
    //     var order = orderListSorted[id]
    for (var id in orderList) {
        var order = orderList[id]

        order.PnL = 0
        order.Fees = 0.075
        if (!showCancelled && order.Pair !== marketPair) {
            continue
        }

        if (order.Pair == marketPair) {
            //calculate PnL and Fees
            // if ( lastOrderPrice == 0) {
            //     lastOrderPrice = order.Price
            // }
            if (order.Status == "FILLED" || order.Status == "NEW" || order.Status == "PARTIALLY_FILLED") {
                

                switch (order.Side) {
                    case "BUY":
                        //when  buying PnL dont matter
                        if (lastSellPrice != 0) {
                            // order.PnL = truncateNumber((((lastSellPrice / nCountLastSell) - order.Price) / order.Price) * order.Quantity)
                            order.PnL = truncateNumber(((lastSellPrice / nCountLastSell) - order.Price) * order.Quantity)
                        }

                        // if (order.PnL < 0) {
                        //     order.PnL = 0
                        // }    
                        order.Fees = truncateNumber(order.Total * (feesCharge / 100))

                        if (order.Status == "FILLED") {
                            totalPnLBuy += order.PnL
                            totalFeesBuy +=order.Fees
                            totalFeesSell += parseFloat(truncateNumber(order.Total * (feesCharge / 100)))

                            if (order.Price > (lastBuyPrice / nCountLastBuy)) {
                                lResetLastBuy = true
                            }
                            lResetLastSell = true
                            if (lResetLastBuy) {
                                lastBuyPrice = 0
                                nCountLastBuy = 0
                                lResetLastBuy = false
                            }

                            nCountLastBuy++
                            lastBuyPrice += order.Price
                        }
                        break;

                    case "SELL":
                        if (lastBuyPrice != 0) {
                            order.PnL = truncateNumber((order.Price - (lastBuyPrice / nCountLastBuy)) * order.Quantity)
                        }
                        order.Fees = truncateNumber(order.Total * (feesCharge / 100))

                        if (order.Status == "FILLED") {
                            totalPnLSell += order.PnL
                            totalFeesSell += order.Fees

                            if (order.Price < (lastSellPrice / nCountLastSell)) {
                                lResetLastSell = true
                            }
                            lResetLastBuy = true
                            if (lResetLastSell) {
                                lastSellPrice = 0
                                nCountLastSell = 0
                                lResetLastSell = false
                            }

                            nCountLastSell++
                            lastSellPrice += order.Price
                        }
                        break;
                }
            }

            order.lastBuyPrice = lastBuyPrice / nCountLastBuy
            order.lastSellPrice = lastSellPrice / nCountLastSell
        }
        
        if (order.Status !== notSTATUS) {
            calculatedOrderPnL.push(order)
        }
    }
    
    marketPairPnL.TotalPnLBuy = totalPnLBuy
    marketPairPnL.TotalFeesBuy = totalFeesBuy
    marketPairPnL.TotalPnLSell = totalPnLSell
    marketPairPnL.TotalFeesSell = totalFeesSell

    marketPairPnL.LastBuyPrice = truncateNumber(lastBuyPrice / nCountLastBuy)
    marketPairPnL.LastSellPrice = truncateNumber(lastSellPrice / nCountLastSell)
    marketPairPnL.OrderList = calculatedOrderPnL    
    marketPairPnL.OrderList.reverse()

    
    return marketPairPnL
}


