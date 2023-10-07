class Transaction {
    amount: number;
    date: Date;

    constructor(amount: number, date: Date) {
        this.amount = amount;
        this.date = date;
    }
}

class Bank {
    name: string;
    branches: Branch[] = [];

    constructor(name: string) {
        this.name = name;
    }

    addBranch(branch: Branch): boolean {
        const branchExisted = this.branches.some(b => b.getName() === branch.getName());

        if (!branchExisted) {
            this.branches.push(branch);
            return true;
        }
        return false;
    }

    addCustomer(branch: Branch, customer: Customer): boolean {
        if (branch instanceof Branch && customer instanceof Customer) {
            return branch.addCustomer(customer);
        }
        return false;
    }

    addCustomerTransaction(branch: Branch, customerId: number, amount: number): boolean {
        const foundBranch = this.branches.find(b => b.getName() === branch.getName());
        if (foundBranch) {
            return foundBranch.addCustomerTransaction(customerId, amount);
        }
        return false;
    }

    findBranchByName(branchName: string): Branch[] {
        return this.branches.filter(branch => branch.getName() === branchName);
    }

    checkBranch(branch: Branch): boolean {
        return this.branches.includes(branch);
    }

    listCustomers(branch: Branch, includeTransactions: boolean): void {
        const foundBranch = this.branches.find(b => b.getName() === branch.getName());
        if (foundBranch) {
            foundBranch.listCustomers(includeTransactions);
        } else {
            console.error("Branch not found.");
        }
    }

    searchCustomers(keyword: string): Customer[] {
        const matchingCustomers: Customer[] = [];
        this.branches.forEach(branch => {
            branch.getCustomers().forEach(customer => {
                if (
                    customer.getName().toLowerCase().includes(keyword.toLowerCase()) ||
                    customer.getId().toString() === keyword.toString()
                ) {
                    matchingCustomers.push(customer);
                }
            });
        });
        return matchingCustomers;
    }
}

class Branch {
    name: string;
    customers: Customer[] = [];

    constructor(name: string) {
        this.name = name;
    }

    getName(): string {
        return this.name;
    }

    getCustomers(): Customer[] {
        return this.customers;
    }

    addCustomer(customer: Customer): boolean {
        const customerExisted = this.customers.some(c => c.getId() === customer.getId());

        if (!customerExisted) {
            this.customers.push(customer);
            return true;
        } else {
            console.error("This customer is already added.");
            return false;
        }
    }

    addCustomerTransaction(customerId: number, amount: number): boolean {
        const customer = this.customers.find(c => c.getId() === customerId);
        if (customer) {
            return customer.addTransaction(amount);
        }
        return false;
    }

    listCustomers(includeTransactions: boolean): void {
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
    name: string;
    id: number;
    transactions: Transaction[] = [];

    constructor(name: string, id: number) {
        this.name = name;
        this.id = id;
    }

    getName(): string {
        return this.name;
    }

    getId(): number {
        return this.id;
    }

    getTransactions(): Transaction[] {
        return this.transactions;
    }

    getBalance(): number {
        return this.transactions.reduce((total, current) => total + current.amount, 0);
    }

    addTransaction(amount: number): boolean {
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
arizonaBank.addBranch(westBranch);

arizonaBank.addCustomer(westBranch, customer1);
arizonaBank.addCustomer(westBranch, customer3);
arizonaBank.addCustomer(sunBranch, customer1);
arizonaBank.addCustomer(sunBranch, customer2);
arizonaBank.addCustomer(westBranch, customer2);

arizonaBank.addCustomerTransaction(westBranch, customer1.getId(), 3000);
arizonaBank.addCustomerTransaction(westBranch, customer1.getId(), 2000);
arizonaBank.addCustomerTransaction(westBranch, customer2.getId(), 3000);

customer1.addTransaction(-1000);
console.log(customer1.getBalance());
console.log(arizonaBank.listCustomers(westBranch, true));
console.log(arizonaBank.listCustomers(sunBranch, true));

const searchResults = arizonaBank.searchCustomers("John");
console.log("\n__________Search Results:__________\n");
searchResults.forEach(customer => {
    console.log(`Customer Name: ${customer.getName()}, Customer ID: ${customer.getId()}`);
});
