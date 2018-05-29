const editMap = (arr) => {

  const states = [];
  const carriers = [];
  const next_tracking_ids = [];
  const origin = {};
  const status = {};
  const weight = {};
  const destination = {};

  arr.map((i, el) => {
    states.push(...i.tracks.get());
    carriers.push(i.name);
    next_tracking_ids.push(i.next_tracking_ids);
    origin[el] = i.origin,
    status[el] = i.status,
    weight[el] = i.weight,
    destination[el] = i.destination
  });

  if (!states.length) {
    return {
      error: "NO_DATA"
    }
  } else {
    return {
      states,
      carriers,
      next_tracking_ids,
      origin: origin[0],
      destination: destination[0],
      status: status[0],
      weight: weight[0]
    };
  }
}
