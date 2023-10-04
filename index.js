class Transaction {
    constructor(amount, date) {
        this.amount = amount;
        this.date = date;
    }
}

class Bank {
    constructor(name) {
        this.name = name;
        this.branches = [];
    }

    addBranch(branch) {
        if (!this.branches.some(b => b.getName() === branch.getName())) {
            this.branches.push(branch);
            return true;
        }
        return false;
    }

    addCustomer(branch, customer) {
        if (branch instanceof Branch && customer instanceof Customer) {
            return branch.addCustomer(customer);
        }
        return false;
    }

    addCustomerTransaction(branch, customerId, amount) {
        const foundBranch = this.branches.find(b => b.getName() === branch.getName());
        if (foundBranch) {
            return foundBranch.addCustomerTransaction(customerId, amount);
        }
        return false;
    }

    findBranchByName(branchName) {
        return this.branches.filter(branch => branch.getName() === branchName);
    }

    checkBranch(branch) {
        return this.branches.includes(branch);
    }

    listCustomers(branch, includeTransactions) {
        const foundBranch = this.branches.find(b => b.getName() === branch.getName());
        if (foundBranch) {
            return foundBranch.listCustomers(includeTransactions);
        } else {
            console.error("Branch not found.");
            return null; // Return null in case of error
        }
    }
}

class Branch {
    constructor(name) {
        this.name = name;
        this.customers = [];
    }

    getName() {
        return this.name;
    }

    getCustomers() {
        return this.customers;
    }

    addCustomer(customer) {
        if (!this.customers.some(c => c.getId() === customer.getId())) {
            this.customers.push(customer);
            return true;
        } else {
            console.error("This customer is already added.");
            return false;
        }
    }

    addCustomerTransaction(customerId, amount) {
        const customer = this.customers.find(c => c.getId() === customerId);
        if (customer) {
            return customer.addTransaction(amount);
        }
        return false;
    }

    listCustomers(includeTransactions) {
        console.log(`Customers of branch ${this.name}:`);
        this.customers.forEach(customer => {
            console.log(`Customer Name: ${customer.getName()}, Customer ID: ${customer.getId()}`);
            if (includeTransactions) {
                console.log(`Transactions:`, customer.getTransactions());
            }
        });
    }
}

class Customer {
    constructor(name, id) {
        this.name = name;
        this.id = id;
        this.transactions = [];
    }

    getName() {
        return this.name;
    }

    getId() {
        return this.id;
    }

    getTransactions() {
        return this.transactions;
    }

    getBalance() {
        return this.transactions.reduce((total, current) => total + current.amount, 0);
    }

    addTransaction(amount) {
        if (amount < 0) {
            console.error("The transaction cannot be negative.");
            return false;
        }
        const transaction = new Transaction(amount, new Date());
        this.transactions.push(transaction);
        return true;
    }
}

const arizonaBank = new Bank("Arizona");
const westBranch = new Branch("West Branch");
const sunBranch = new Branch("Sun Branch");
const customer1 = new Customer("John", 1);
const customer2 = new Customer("Anna", 2);
const customer3 = new Customer("John", 3);

arizonaBank.addBranch(westBranch);
arizonaBank.addBranch(sunBranch);

arizonaBank.findBranchByName("bank");
arizonaBank.findBranchByName("Sun Branch");

arizonaBank.addCustomer(westBranch, customer1);
arizonaBank.addCustomer(westBranch, customer3);
arizonaBank.addCustomer(sunBranch, customer1);
arizonaBank.addCustomer(sunBranch, customer2);

arizonaBank.addCustomerTransaction(westBranch, customer1.getId(), 3000);
arizonaBank.addCustomerTransaction(westBranch, customer1.getId(), 2000);
arizonaBank.addCustomerTransaction(westBranch, customer2.getId(), 3000);

customer1.addTransaction(-1000);
console.log(customer1.getBalance());
console.log(arizonaBank.listCustomers(westBranch, true));
console.log(arizonaBank.listCustomers(sunBranch, true));