const tripList = window.document.getElementById("trip_list");

const updateUserMessage = (newMessage, targetElement) => {
  const p = window.document.createElement("p");
  p.textContent = newMessage;
  targetElement.innerHTML = "";
  targetElement.append(p);
};

const listOfExpenseElem = [];

const getExpenseList = () => {
  const expenseList = window.document.createElement("ul");
  expenseList.classList.add("list_expenses");
  expenseList.innerHTML = `<p>
    <span class="icon-loading">&#8635;</span>
    Fetching your expenses...
  </p>`;
  return expenseList;
};

const getListItemsFromJSON = (listOfTrips) => {
  const docFrag = new DocumentFragment();
  listOfTrips.forEach((trip) => {
    const li = window.document.createElement("li");
    const expenseList = getExpenseList();
    li.innerHTML = `<h3>${trip.name}</h3>
        <p>A description of the trip</p>`;
    li.appendChild(expenseList);
    listOfExpenseElem.push(expenseList);
    docFrag.appendChild(li);
  });
  return docFrag;
};

let trips;

const updatePageWithTrips = (jsonTrips) => {
  trips = jsonTrips;
  tripList.innerHTML = "";
  tripList.appendChild(getListItemsFromJSON(trips.trips));
  return true;
};

// TODO add race to update message if more than 5 seconds have elapsed
const makeAPITimeout = (msg, time) => {
  let timerID;
  const p = new Promise((resolve) => {
    timerID = window.setTimeout(() => {
      resolve(msg);
    }, time);
  });
  const clear = () => {
    window.clearTimeout(timerID);
  };
  p.clear = clear;
  return p;
};

const tripRequest = fetch("http://localhost:3000/trips")
  .then((response) => response.json())
  .catch((e) => { console.log("an error occurred fetching trips", e); });

const decorateTripsWithExpenses = () => {
  const expRequest = fetch("http://localhost:3000/expenses")
    .then((response) => response.json)
    .catch(console.log("error occurred fetching expenses list"));

  const expRequestTimer = makeAPITimeout(null, 5000);

  Promise.race([expRequestTimer, expRequest])
    .then((expenses) => {
      if (expenses) {
        console.log("expenses are back", listOfExpenseElem);
      } else {
        window.document.querySelectorAll(".list_expenses").forEach((expListElem) => {
          updateUserMessage("Sorry, could not fetch expenses for this trip.", expListElem);
        });
      }
    })
    .catch((e) => {
      console.log("error occurred when fetching expenses");
      window.document.querySelectorAll(".list_expenses").forEach((expListElem) => {
        updateUserMessage("Sorry, could not fetch expenses for this trip.", expListElem);
      });
    })
    .finally(() => {
      expRequestTimer.clear();
    });
};

const tripRequestTimer = makeAPITimeout(null, 5000);

Promise.race([tripRequestTimer, tripRequest])
  .then((tripJSON) => {
    if (tripJSON) {
      updatePageWithTrips(tripJSON);
      decorateTripsWithExpenses();
    } else {
      updateUserMessage("Sorry, the server took too long to respond", tripList);
    }
  })
  .catch(console.log)
  .finally(() => {
    // clears memory held by closure in Promise constructor
    tripRequestTimer.clear();
  });
