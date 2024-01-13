"use strict";

// VARIABLES
const inputLoginUsername = document.querySelector(".login__input--username");
const inputLoginPassword = document.querySelector(".login__input--password");
const inputTransferTo = document.querySelector(".form__input--transfer-to");
const inputTransferAmount = document.querySelector(".form__input--transfer-amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--username");
const inputClosePassword = document.querySelector(".form__input--password");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".summary__btn");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const valueBalance = document.querySelector(".balance__value");
const valueSumIn = document.querySelector(".summary__in--value");
const valueSumOut = document.querySelector(".summary__out--value");
const valueSumInterest = document.querySelector(".summary__interest--value");

const bannerEl = document.querySelector(".banner");
const headerText = document.querySelector(".header__text");
const dateBalance = document.querySelector(".date");
const timerEl = document.querySelector(".timer");

// TEST DATA
const account1 = {
    owner: "Barış Emre Yalçın",
    movements: [2000, 1200, -150.99, 5000, 12000, -3000, 14500, -2200],
    interestRate: 1.2,
    password: 8888,
    movementDates: [
        '2023-11-18T21:31:17.178Z',
        '2023-11-23T07:42:02.383Z',
        '2023-11-28T09:15:04.904Z',
        '2023-12-09T10:17:24.185Z',
        '2023-12-22T14:11:59.604Z',
        '2024-01-01T17:01:17.194Z',
        '2024-01-05T23:36:17.929Z',
        '2024-01-10T10:51:36.790Z',
      ],
      currency: "TRY",
      locale: "tr-TR",
      tryToUsdRate: 0.033
};

const account2 = {
    owner: "Jackson Teller",
    movements: [50, 130, 250, -200, 300, 550, -325, 1600],
    interestRate: 1.3,
    password: 1111,
    movementDates: [
        "2023-11-01T13:15:33.035Z",
        "2023-11-30T09:48:16.867Z",
        "2023-12-05T06:04:23.907Z",
        "2023-12-15T14:18:46.235Z",
        "2023-12-05T16:33:06.386Z",
        "2023-12-22T14:43:26.374Z",
        "2024-01-05T18:49:59.371Z",
        "2024-01-07T12:01:20.894Z",
      ],
      currency: "USD",
      locale: "en-US",
      usdToTryRate: 29.95
};

const accounts = [account1, account2];

let currentAccount, timer;

// FUNCTIONS
// Create Usernames
const createUsernames = function(accs) {
    accs.forEach(acc => 
        acc.username = acc.owner
            .toLowerCase()
            .split(" ")
            .map(name => name[0])
            .join(""));
}
createUsernames(accounts);

// Format Movement Date
const formatMovementDate = function(date, locale) {
    const calcDaysPassed = (date1, date2) => Math.round(Math.abs(date2 - date1) / (24 * 60 * 60 * 1000)); // Convert milliseconds to day
    const dayPassed = calcDaysPassed(new Date(), date);

    if(dayPassed === 0) return "Today";
    if(dayPassed === 1) return "Yesterday";
    if(dayPassed <= 7) return `${dayPassed} days ago`; 

    return new Intl.DateTimeFormat(locale).format(date);
}

// Format Currency
const formatCurrency = function(valueData, locale, currency) {
    const value = typeof valueData === "number" ? valueData : valueData.loanValue;
    return new Intl.NumberFormat(locale, {style: "currency", currency: currency}).format(value);
}

// Display Movements
const displayMovements = function(acc) {
    containerMovements.innerHTML = "";

    acc.movements.forEach((mov, i) => {
        const movType = typeof mov === "object" ? "loan" : mov > 0 ? "deposit" : "withdrawal";
        const date = new Date(acc.movementDates[i]);
        const formattedDate = formatMovementDate(date, acc.locale);
        const formattedCurrency = formatCurrency(mov, acc.locale, acc.currency);
        const html = `
            <div class="movement">
                <p class="movement__type movement__type--${movType}">${i + 1} ${movType}</p>
                <p class="movement__date">${formattedDate}</p>
                <p class="movement__value">${formattedCurrency}</p>
            </div>
        `;
        containerMovements.insertAdjacentHTML("afterbegin", html);
    })
}

// Display Balance
const displayBalance = function(acc) {
    acc.balance = acc.movements.reduce((acc, mov) => typeof mov === "object" ? acc + mov.loanValue : acc + mov, 0);
    valueBalance.textContent = formatCurrency(acc.balance, acc.locale, acc.currency);
}

// Display Summary
const displaySummary = function(acc) {
    const incomes = acc.movements
        .filter(mov => mov > 0)
        .reduce((acc, mov) => acc + mov, 0);
    valueSumIn.textContent = formatCurrency(incomes, acc.locale, acc.currency);

    const outgoings = acc.movements
        .filter(mov => mov < 0)
        .reduce((acc, mov) => acc + mov, 0);
    valueSumOut.textContent = formatCurrency(Math.abs(outgoings), acc.locale, acc.currency);

    const interest = acc.movements
        .filter(mov => mov > 0)
        .map(deposit => (deposit * acc.interestRate) / 100 )
        .filter(int => int >= 1)
        .reduce((acc, int) => acc + int, 0);
    valueSumInterest.textContent = formatCurrency(interest, acc.locale, acc.currency);
}

// Update UI
const updateUI = function(acc) {
    displayMovements(acc);
    displayBalance(acc);
    displaySummary(acc);
}

// Logout Timer
const startLogoutTimer = function() {
    let time = 120;

    const tick = function() {
        const min = String(Math.floor(time / 60)).padStart(2,0);
        const sec = String(Math.floor(time % 60)).padStart(2,0);

        timerEl.textContent = `${min}:${sec}`;

        if(time === 0) {
            clearInterval(timerId);
            bannerEl.classList.remove("hidden");
            containerApp.classList.add("hidden");
            headerText.textContent = `Login to get started`;
        }

        time--;
    }

    tick();

    const timerId = setInterval(tick, 1000);
    return timerId;
}

// Login
btnLogin.addEventListener("click", function(e) {
    e.preventDefault();

    currentAccount = accounts.find(acc => acc.username === inputLoginUsername.value);

    if(currentAccount?.password === +inputLoginPassword.value) {
        inputLoginUsername.value = inputLoginPassword.value = "";
        inputLoginPassword.blur();

        bannerEl.classList.add("hidden");
        containerApp.classList.remove("hidden");

        const firstname = currentAccount.owner.split(" ")[0];
        headerText.textContent = `Welcome back, ${firstname}`
        
        updateUI(currentAccount);

        const now = new Date();
        const options = {
            hour: "numeric",
            minute: "numeric",
            day: "numeric",
            month: "numeric",
            year: "numeric",
        }

        dateBalance.textContent = new Intl.DateTimeFormat(currentAccount.locale, options).format(now);

        // Start or Reset Timer
        if(timer) clearInterval(timer);
        timer = startLogoutTimer();
    }
})

// Transfer Money
btnTransfer.addEventListener("click", function(e) {
    e.preventDefault();

    const receiver = accounts.find(acc => acc.username === inputTransferTo.value);
    const transferAmount = +inputTransferAmount.value;
    const convertedTransferAmount = receiver === account1 
        ? transferAmount * account2.usdToTryRate 
        : transferAmount * account1.tryToUsdRate;

    inputTransferTo.value = inputTransferAmount.value = "";
    inputTransferAmount.blur();

    if(
        transferAmount > 0 &&
        receiver &&
        currentAccount.username !== receiver?.username &&
        currentAccount.balance >= transferAmount
    ) {
        currentAccount.movements.push(-transferAmount);
        receiver.movements.push(convertedTransferAmount);
        currentAccount.movementDates.push(new Date().toISOString());
        receiver.movementDates.push(new Date().toISOString());
        updateUI(currentAccount);

        // Reset Timer
        clearInterval(timer);
        timer = startLogoutTimer();
    }
})

// Loan Money
btnLoan.addEventListener("click", function(e) {
    e.preventDefault();
    
    const loanAmount = +inputLoanAmount.value;

    if(loanAmount > 0 && currentAccount.movements.some(mov => mov >= loanAmount * 0.2 && !mov?.type)) {
        setTimeout(function() {
            const movLoan = {
                movType: "loan",
                loanValue: loanAmount
            };
            currentAccount.movements.push(movLoan);
            currentAccount.movementDates.push(new Date().toISOString());
            updateUI(currentAccount);

            // Reset Timer
            clearInterval(timer);
            timer = startLogoutTimer();
        }, 3000)
    }
    inputLoanAmount.value = "";
    inputLoanAmount.blur();
})

// Close Account
btnClose.addEventListener("click", function(e) {
    e.preventDefault();

    if(
        currentAccount.username === inputCloseUsername.value &&
        currentAccount.password === +inputClosePassword.value
    ) {
        const currentAccountIndex = accounts.indexOf(currentAccount);
        accounts.splice(currentAccountIndex, 1);
        
        bannerEl.classList.remove("hidden");
        containerApp.classList.add("hidden");

        headerText.textContent = `Login to get started`;
    }

    inputCloseUsername.value = inputClosePassword.value = "";
})