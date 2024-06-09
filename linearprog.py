from scipy.optimize import linprog

# Coefficients of the objective function (to be maximized)
c = [-1, -3, -7]  # We use negative because linprog does minimization by default

# Coefficients of the inequality constraints
A = [[1, 2, 11]]

# RHS of the inequality constraints
b = [80]

# Bounds for the variables (x1, x2, x3)
x0_bounds = (0, None)
x1_bounds = (0, None)
x2_bounds = (0, None)

# Solve the linear programming problem
result = linprog(c, A_ub=A, b_ub=b, bounds=[x0_bounds, x1_bounds, x2_bounds], method='highs')

# Output the results
result
