const tripList = window.document.getElementById("trip_list");

const updateUserMessage = (newMessage, targetElement) => {
  const p = window.document.createElement("p");
  p.textContent = newMessage;
  // eslint-disable-next-line no-param-reassign
  targetElement.innerHTML = "";
  targetElement.append(p);
};

const listOfExpenseElem = [];

const getExpenseList = () => {
  const expenseList = window.document.createElement("ul");
  expenseList.classList.add("list_expenses");
  expenseList.innerHTML = `<h3>Trip Expenses:</h3>
  <p class="placeholder_msg">
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
        <p class="placeholder_msg">A description of the trip</p>`;
    li.appendChild(expenseList);
    li.dataset.dbid = trip._id;
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

// const getFormattedDate = () => {};

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
    .then((response) => response.json())
    .catch((e) => {
      console.log("error occurred fetching expenses list: ", e);
    });

  const expRequestTimer = makeAPITimeout(null, 5000);

  const getExpListElem = (expenseItem, zerodIndex) => {
    const li = window.document.createElement("li");
    li.innerHTML = `<ul> <h3>Expense #${zerodIndex + 1}:</h3>
      <li>Amount: ${expenseItem.amount}</li>
      <li>Category: ${expenseItem.category}</li>
      <li>Description: ${expenseItem.description}</li>
      <li>date: ${expenseItem.date}</li>
    </ul>`;
    return li;
  };

  const updateExpenseListElems = (returnedExp) => {
    const expenses = returnedExp && returnedExp.expenses ? returnedExp.expenses : [];
    let listExpenses;
    window.document.querySelectorAll("#trip_list > li").forEach((tripListElem) => {
      expenses.forEach((expense, i) => {
        listExpenses = tripListElem.querySelector(".list_expenses");
        if (expense.trip === tripListElem.dataset.dbid) {
          listExpenses.querySelector(".placeholder_msg").remove();
          listExpenses.append(getExpListElem(expense, i));
        } else {
          listExpenses.innerHTML = "No expenses for this trip have been recorded.";
        }
      });
      // updateUserMessage("Sorry, could not fetch expenses for this trip.", expListElem);
    });
  };

  Promise.race([expRequestTimer, expRequest])
    .then(updateExpenseListElems)
    .catch((e) => {
      console.log("error occurred when processing/fetching expenses", e);
      updateExpenseListElems();
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
