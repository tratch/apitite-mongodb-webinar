var _ = require('underscore'),
    fs = require('fs'),
    moment = require('moment'),
    mongodb = require('mongodb'),
    Q = require('q'),
    rnorm = require('randgen').rnorm;

var ObjectID = mongodb.ObjectID;

var items = [
  { item: 'bicycle',        price: 349.00  },
  { item: 'shoes',          price: 99.00   },
  { item: 'lamp',           price: 49.00   },
  { item: 'stapler',        price: 9.00    },
  { item: 'computer',       price: 1595.00 },
  { item: 'notebook',       price: 10.00   },
  { item: 'shirt',          price: 50.00   },
  { item: 'pants',          price: 75.00   },
  { item: 'hat',            price: 40.00   },
  { item: 'gloves',         price: 60.00   },
  { item: 'glasses',        price: 120.00  },
  { item: 'mouse',          price: 29.00   },
  { item: 'monitor',        price: 250.00  },
  { item: 'speakers',       price: 100.00  },
  { item: 'tv',             price: 530.00  },
  { item: 'watch',          price: 670.00  },
  { item: 'calculator',     price: 140.00  },
  { item: 'pens',           price: 13.00   },
  { item: 'pencils',        price: 7.00    },
  { item: 'scissors',       price: 10.00   },
  { item: 'teddy bear',     price: 48.00   },
  { item: 'framed picture', price: 200.00  },
  { item: 'book',           price: 15.00   },
  { item: 'phone',          price: 599.00  },
  { item: 'headphones',     price: 215.00  },
  { item: 'trashcan',       price: 160.00  },
  { item: 'lighter',        price: 3.00    },
  { item: 'cigarettes',     price: 20.00   },
  { item: 'candy bar',      price: 2.00    },
  { item: 'keyboard',       price: 41.00   }
];

var start = moment('2013-01-01');  // inclusive
var end = moment('2015-04-21');    // exclusive
var mean = 50;

var getNumberOfOrders = function(mean) {
  var numberOfOrders = Math.round(rnorm(mean));
  return numberOfOrders < 0 ? 0 : numberOfOrders;
};

var getItem = function() {
  return items[_.random(items.length-1)];
};

var getQuantity = function() {
  var x = Math.random();  // [0,1)

  if (x < 0.8)
    return 1;
  else if (x < 0.9)
    return 2;
  else if (x < 0.95)
    return 3;
  else if (x < 0.98)
    return 4;
  else
    return 5;
};

var getCustomer = function() {
  return 'foo' + _.random(1,1000) + '@bar.com';
};

var getCurrentDayData = function(currentDay, numberOfOrders) {
  var data = [],
      datum,
      item;

  for (var i = 0; i < numberOfOrders; i++) {
    item = getItem();
    datum = {
      _id: { $oid: (new ObjectID()).toJSON() },
      date: { $date: currentDay.format('YYYY-MM-DDTHH:mm:ss.SSSZZ') },
      item: item.item,
      price: item.price,
      quantity: getQuantity(),
      customer: getCustomer()
    };

    data.push(JSON.stringify(datum));
  }

  return data;
};

var run = function(start, end, mean) {

  var data = [];
  var currentDayData;

  var numberOfOrders = mean;

  for (var currentDay = start; currentDay.isBefore(end); currentDay.add(1, 'days')) {

    numberOfOrders = getNumberOfOrders(numberOfOrders);
    currentDayData = getCurrentDayData(currentDay, numberOfOrders);
    data = data.concat(currentDayData);

  }

  fs.writeFile('out.json', data.join('\n'));

};

run(start, end, mean);