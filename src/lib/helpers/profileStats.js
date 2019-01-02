/* eslint import/prefer-default-export: 0 */

// TODO: Optimize
export const calculateStats = (copies) => {
  const statistics = {
    accountStats: {
      added: {
        count: 0,
        price: 0,
      },
      sold: {
        count: 0,
        price: 0,
      },
      paid: {
        count: 0,
        price: 0,
      },
      toSell: {
        count: 0,
        price: 0,
      },
      toPay: {
        count: 0,
        price: 0,
      },
    },
    priceStats: {
      max: {
        all: 0,
        inStock: 0,
      },
      min: {
        all: -1,
        inStock: -1,
      },
      avg: {
        all: 0,
        inStock: 0,
      },
    },
  };

  const data = copies.reduce((acc, copy) => {
    const { accountStats, priceStats } = acc;
    const price = +copy.price;

    accountStats.added.count++;
    accountStats.added.price += price;

    if (copy.isAdded) {
      accountStats.toSell.count++;
      accountStats.toSell.price += price;

      priceStats.avg.inStock += price;

      if (price > priceStats.max.inStock) {
        priceStats.max.inStock = price;
      }

      if (priceStats.min.inStock === -1 || price < priceStats.min.inStock) {
        priceStats.min.inStock = price;
      }
    }

    if (copy.isSold) {
      accountStats.sold.count++;
      accountStats.sold.price += price;
      accountStats.toPay.count++;
      accountStats.toPay.price += price;
    }

    if (copy.isPaid) {
      accountStats.sold.count++;
      accountStats.sold.price += price;
      accountStats.paid.count++;
      accountStats.paid.price += price;
    }


    priceStats.avg.all += price;

    if (price > priceStats.max.all) {
      priceStats.max.all = price;
    }

    if (priceStats.min.all === -1 || price < priceStats.min.all) {
      priceStats.min.all = price;
    }

    return { accountStats, priceStats };
  }, statistics);

  const inStock = data.accountStats.toSell.count;

  if (copies.length > 0) {
    data.priceStats.avg.all = Math.round(data.priceStats.avg.all / copies.length);
  } else {
    data.priceStats.min.all = 0;
  }

  if (inStock > 0) {
    data.priceStats.avg.inStock = Math.round(data.priceStats.avg.inStock / inStock);
  } else {
    data.priceStats.min.inStock = 0;
  }

  return data;
};
