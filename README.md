# BankApp

## You can perform basic banking operations such as transfering, receiving, or loaning money. 

You can use following login data:
- User 1:

    *username*: &nbsp; &nbsp; bey

    *password*: &nbsp; &nbsp; 8888

- User 2:

    *username*: &nbsp; &nbsp; jt

    *password*: &nbsp; &nbsp; 1111

<br>

### Some Tips
- You cannot transfer an amount exceeding the account balance.

- There is a ratio related to the amount of credit you can request and the incoming amounts to your account previously:
    
    <div style="background-color: #25252e; padding: 10px;">
    Requested Loan Amount * 0.2 <= Largest Income You Have <i>(excluding previous loans, considering just deposits...)</i>
    </div>

- There is also a ratio related to the amount of interest and the incoming amounts to your account previously:

    <div style="background-color: #25252e; padding: 10px;">
    Income <i>(for each loan and deposit...)</i> * Interest Rate of the User / 100 >= 1 

    Interest Rates => bey: 1.2 and jt: 1.3
    </div> 

- You can sort the movements from largest to smallest or vice versa using "Sort" button.

- You can also close the account by confirming the account username and password.

- You have to perform an operation in 2 minutes. Otherwise, you will be logged out.

<br>

![The UI](img/app.jpg)

### Tech Stack:
- HTML
- CSS
- JavaScript