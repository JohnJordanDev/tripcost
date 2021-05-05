const getListItemsFromJSON = (tripList) => {
  const docFrag = new DocumentFragment();
  tripList.forEach((trip) => {
    const li = window.document.createElement("li");
    li.innerHTML = `<h3>${trip.name}</h3>
        <p>A description of the trip</p>`;
    docFrag.appendChild(li);
  });
  return docFrag;
};
const tripList = window.document.getElementById("trip_list");
let trips;
const tripRequest = fetch("http://localhost:3000/trips")
  .then((response) => response.json())
  .then((jsonTrips) => {
    trips = jsonTrips;
    tripList.innerHTML = "";
    tripList.appendChild(getListItemsFromJSON(trips.trips));
  })
  .catch((e) => { console.log("an error occurred", e); });

// TODO add race to update message if more than 5 seconds have elapsed
let timeoutID = null;

const timeout = new Promise((res, reject) => {
  timeoutID = window.setTimeout(reject, 1000, "foo");
});

Promise.race([timeout, tripRequest]).then((d) => {
  console.log("d is: ", d);
}).catch(console.log).finally(() => {
  window.clearTimeout(timeoutID);
});
