class ExpenseTracker {
  constructor() {
    this.expenses = JSON.parse(localStorage.getItem("expenses")) || [];
    this.budget = parseFloat(localStorage.getItem("budget")) || 0;
    this.charts = {
      pie: null
    };

    // Wait for DOM to be ready before initialization
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => this.init());
    } else {
      this.init();
    }
  }

  init() {
    this.initializeCharts();
    this.initializeEventListeners();
    this.updateUI();
  }

  initializeEventListeners() {
    // Budget input
    const budgetInput = document.getElementById("budgetInput");
    budgetInput.value = this.budget;
    budgetInput.addEventListener("change", (e) => {
      this.budget = parseFloat(e.target.value) || 0;
      localStorage.setItem("budget", this.budget);
      this.updateUI();
    });

    // Expense form
    document.getElementById("expenseForm").addEventListener("submit", (e) => {
      e.preventDefault();
      this.addExpense();
    });
  }

  addExpense() {
    const amount = parseFloat(document.getElementById("amountInput").value);
    const category = document.getElementById("categoryInput").value;
    const description = document.getElementById("descriptionInput").value;

    if (!amount || !category) return;

    const expense = {
      id: Date.now(),
      amount,
      category,
      description,
      date: new Date().toISOString(),
    };

    this.expenses.push(expense);
    localStorage.setItem("expenses", JSON.stringify(this.expenses));

    // Reset form
    document.getElementById("expenseForm").reset();
    this.updateUI();
  }

  updateUI() {
    this.updateOverview();
    this.updateExpensesList();
    this.updateCharts?.(); // Optional chaining ,this code is similar to below comment
    //     if (this.charts.pie && this.charts.bar) {
    //       this.updateCharts();
    //     }
  }

  updateOverview() {
    let totalSpent = this.expenses.reduce((acc, curr) => acc + curr.amount, 0);
    let remaining = this.budget - totalSpent;

    document.getElementById("totalSpent").textContent = `${totalSpent.toFixed(
      2
    )} Rs`;
    document.getElementById(
      "remainingBudget"
    ).textContent = `${remaining.toFixed(2)} Rs`;
  }

  updateExpensesList() {
    const expensesList = document.getElementById("expensesList");
    expensesList.innerHTML = this.expenses
      .slice()
      .reverse()
      .map(
        (expense) => `
                <div class="expense-item">
                    <div class="expense-item-header">
                        <div>
                            <p class="expense-description">${
                              expense.description || expense.category
                            }</p>
                            <p class="expense-category">${expense.category}</p>
                        </div>
                        <p class="expense-amount">${expense.amount.toFixed(
                          2
                        )} Rs</p>
                    </div>
                </div>
              `
      )
      .join("");
  }

  initializeCharts() {
    const pieCtx = document.getElementById("pieChart");

    if (!pieCtx) {
      console.error("Chart canvases not found");
      return;
    }

    // Initialize Pie Chart
    this.charts.pie = new Chart(pieCtx, {
      type: "doughnut",
      data: {
        labels: [],
        datasets: [
          {
            data: [],
            backgroundColor: [
              "#0088FE",
              "#00C49F",
              "#FFBB28",
              "#FF8042",
              "#8884d8",
              "#82ca9d",
              "#ffc658",
            ],
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
      },
    });

 
    };
  

  updateCharts() {
    if (!this.charts.pie) {
      console.error("Charts not initialized");
      return;
    }

    // Update Pie Chart
    const categoryData = {};
    this.expenses.forEach((expense) => {
      categoryData[expense.category] =
        (categoryData[expense.category] || 0) + expense.amount;
    });

    this.charts.pie.data.labels = Object.keys(categoryData);
    this.charts.pie.data.datasets[0].data = Object.values(categoryData);
    this.charts.pie.update();
  }
}

// Initialize the application
new ExpenseTracker();
