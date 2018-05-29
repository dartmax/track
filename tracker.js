const request_promise = require('request-promise');
const cheerio = require('cheerio');

const trackArrayReg = [
  {id:1, reg:/^LP\d{14}$|^[A-Z]{2}\d{14}NPI$/i},
  {id:2, reg:/^[A-Z]{2}\d{14}NPI$|^460\d{9}$|^959\d{9}$/i},
  {id:3, reg:/^3A5[A-Z]{1}\d{9}$|UB0\d{9}AT$|RR2\d{9}AT$/i}
];

const scrapeFeedburner = (trackid) => {
return Promise.all(trackArrayReg.map((regexp, track) => {
  if(regexp.reg.test(trackid)) return regexp.id
  }).filter((item, index, array) => {
      return item;
    })
  )
}

const getArticleData = (arr, trackid) => {
const operations = arr.map((id, i) => {

  return request_promise('https://novaposhta.ua/ru/tracking/international/cargo_number/'+trackid).then(html => {
    const $ = cheerio.load(html);
    const tracks = $('.spoiler-content tr').slice(1).map((i, el) => {
      const date = $(el).find('td').eq(0).text().trim();
      const status = $(el).find('td').eq(2).text().trim()
      const location = $(el).find('td').eq(1).text().trim()
      return {location,date,status}
    });
    const origin = $('.highlight>div>div').eq(0).text().split(':')[1].split(' - ')[0].trim();
    const destination = $('.highlight>div>div').eq(0).text().split(':')[1].split(' - ')[1].trim();
    const next_tracking_ids = $('.highlight>div>div').eq(3).text().split(':')[1].split(',')[0].trim();
    const weight = $('.highlight>div>div').eq(1).text().split(':')[1].trim();
    const status = $('.tracking-int>tbody tr td').eq(1).text();


    return {
      tracks,
      name: 'Новая Почта (Международная)',
      origin,
      destination,
      next_tracking_ids,
      weight,
      status
    }
  })

})
return Promise.all(operations);
}



const firstArray = (array, n) => {



  if (array == null)
    return void 0;
  if (n == null)
    return array[0];
  if (n < 0)
    return [];

  return array.slice(0, n);
};


const editMap = (arr) => {

console.log(arr);


    const states = [];
    const carriers = [];
    const nextArray = [];

    const origin = {};
    const destination = {};
    const next_tracking_ids = [];
    const weight = {};
    const status = {};
    const all = {};

    for (let o in arr) {
      origin[o] = arr[o].origin;
      destination[o] = arr[o].destination;
      next_tracking_ids[o] = arr[o].next_tracking_ids;
      weight[o] = arr[o].weight;
      status[o] = arr[o].status;
      carriers[o] = arr[o].name;
      nextArray[o] = arr[o].tracks;


      let i = nextArray[o].length;

      for (let u = 0; u < i; u++) {

        nextArray[o][u].carrier = parseInt(o);

        states.push(nextArray[o][u]);
      }
    }

    const firstCut = [origin, destination, weight, status];

    for (let i in firstCut) {
      all[i] = firstArray(firstCut[i]);
    }

    if (!Array.isArray(states) || !states.length) {

      return {
        error: "NO_DATA"
      };

    }else{

    return {
      states,
      origin: all[0],
      destination: all[1],
      weight: all[2],
      carriers,
      next_tracking_ids,
      status: all[3]
    }
  }
}


module.exports = {
  scrapeFeedburner,
  getArticleData,
  editMap
}
